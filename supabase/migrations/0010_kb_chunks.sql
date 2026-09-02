-- Knowledge base for the RAG chatbot (api/chat.js).
--
-- The chatbot used to answer from ~15 lines of facts hardcoded into its system
-- prompt, so it could not answer anything about a specific course, lecturer, or
-- fee row even though all of that data already lives in src/lib/*.js. This table
-- holds that data as retrievable chunks, populated by scripts/build-kb.js.
--
-- Retrieval is Postgres full-text search, not embeddings: the corpus is ~120
-- chunks of mostly exact-term queries (course codes, fee amounts, lecturer
-- names), which FTS handles without an embedding provider, an ingestion cost per
-- key rotation, or the pgvector extension.

-- Needed for the Thai path below.
create extension if not exists pg_trgm;

create table kb_chunks (
  -- Stable, human-readable, derived from the source record (e.g.
  -- 'course:EN 843 402'). build-kb.js upserts on this and deletes rows whose id
  -- it no longer produces, so re-running it is idempotent.
  id text primary key,
  -- 'course' | 'study_plan' | 'elective_track' | 'tuition' | 'staff' | 'page'
  source text not null,
  title text not null,
  content_en text not null default '',
  content_th text not null default '',
  -- Course code, credits, track name, student type — whatever the answer needs
  -- that isn't prose.
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),

  -- Title is folded in so a query naming a course or lecturer matches even when
  -- the body doesn't repeat the name.
  content_en_tsv tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_en, ''))
  ) stored
);

create index kb_chunks_en_tsv_idx on kb_chunks using gin (content_en_tsv);
create index kb_chunks_th_trgm_idx on kb_chunks using gin (content_th gin_trgm_ops);
create index kb_chunks_source_idx on kb_chunks (source);

alter table kb_chunks enable row level security;

-- Readable by anyone (the chatbot is public). No write policy on purpose:
-- scripts/build-kb.js writes with the service role key, which bypasses RLS, so
-- clients can never poison the knowledge base.
create policy "kb chunks are viewable by everyone" on kb_chunks
  for select using (true);

-- Ranked retrieval across kb_chunks and the live faqs table.
--
-- faqs is unioned in rather than copied into kb_chunks: the admin dashboard
-- edits those rows, so a copy would go stale the moment someone corrects an
-- answer. This way an admin edit changes the chatbot immediately, with no
-- re-ingestion and no redeploy.
--
-- Two matchers, because one language cannot use the other's:
--
--   English -> to_tsvector('english', ...) + ts_rank_cd. Normalization flag 32
--   returns rank/(rank+1), bounding the score to 0..1 so it is comparable with
--   the Thai score below; raw ts_rank_cd is unbounded and would dominate any
--   greatest() against a similarity value.
--
--   Thai -> trigram. Postgres ships no Thai text search configuration, and Thai
--   is written without spaces between words, so to_tsvector('simple', thai)
--   collapses a whole phrase into one token that matches nothing. Trigrams need
--   no word boundaries.
--
--   Specifically word_similarity()/<%, not similarity()/%. similarity() compares
--   two strings whole and collapses toward zero as their lengths diverge, so a
--   six-character question against a 400-character course description scores far
--   below any threshold. word_similarity() scores the best-matching extent
--   within the longer string, which is exactly this shape of query.
--
-- language sql, not plpgsql: 0007 named its OUT parameters after its own columns
-- and failed with 42702 on every call. A SQL function has no such variable
-- scope, and every reference below is table-qualified regardless.
create function search_kb(p_query text, p_limit integer default 6)
returns table (
  id text,
  source text,
  title text,
  content_en text,
  content_th text,
  metadata jsonb,
  score real
)
language sql
stable
set search_path = public
-- Default is 0.6, which is too strict for a short question against a long
-- description. 0.3 recalls sensibly without dragging in unrelated chunks.
set pg_trgm.word_similarity_threshold = 0.3
as $$
  with q as (
    select
      websearch_to_tsquery('english', p_query) as tsq,
      p_query as raw
  )
  select
    merged.id,
    merged.source,
    merged.title,
    merged.content_en,
    merged.content_th,
    merged.metadata,
    merged.score
  from (
    select
      k.id            as id,
      k.source        as source,
      k.title         as title,
      k.content_en    as content_en,
      k.content_th    as content_th,
      k.metadata      as metadata,
      greatest(
        coalesce(ts_rank_cd(k.content_en_tsv, q.tsq, 32), 0),
        coalesce(word_similarity(q.raw, k.content_th), 0)
      )::real         as score
    from kb_chunks k
    cross join q
    where k.content_en_tsv @@ q.tsq
       or (k.content_th <> '' and q.raw <% k.content_th)

    union all

    select
      'faq:' || f.id::text,
      'faq',
      f.question,
      f.answer,
      '',
      '{}'::jsonb,
      greatest(
        coalesce(
          ts_rank_cd(to_tsvector('english', f.question || ' ' || f.answer), q.tsq, 32),
          0
        ),
        coalesce(word_similarity(q.raw, f.question || ' ' || f.answer), 0)
      )::real
    from faqs f
    cross join q
    where to_tsvector('english', f.question || ' ' || f.answer) @@ q.tsq
       or q.raw <% (f.question || ' ' || f.answer)
  ) merged
  where merged.score > 0
  order by merged.score desc, merged.id asc
  limit greatest(coalesce(p_limit, 6), 1);
$$;

-- Read-only, returns only data that is already publicly selectable, and the
-- chatbot endpoint calls it with the anon key. Left callable by anon
-- deliberately — unlike consume_job_fetch_budget, this spends nothing.
grant execute on function search_kb(text, integer) to anon, authenticated, service_role;
