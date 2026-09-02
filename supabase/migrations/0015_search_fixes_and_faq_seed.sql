-- Three things the first run against real student questions exposed.
--
-- 1. search_kb ANDed every query term, so natural questions returned nothing.
-- 2. Typos missed entirely on the English side.
-- 3. Nothing recorded the questions that found no answer.
--
-- Plus the FAQ content that closes the biggest coverage gaps.
--
-- NOTE on the previous attempt: this function used to carry
-- `set pg_trgm.word_similarity_threshold = 0.3`. That works only when
-- `create extension pg_trgm` runs in the same session, which it did inside
-- 0010; standalone it is an unregistered placeholder GUC and setting one
-- requires superuser — hence "42501: permission denied to set parameter". The
-- thresholds are now compared explicitly, which needs no session state at all.

-- ---------------------------------------------------------------- indexes

-- Typo tolerance for English, mirroring what content_th already had. Without
-- this, "tuiton", "leturer" and "curiculum" match nothing: English went through
-- exact stemming only, while Thai got trigram fuzziness.
create index if not exists kb_chunks_en_trgm_idx on kb_chunks using gin (content_en gin_trgm_ops);

-- ------------------------------------------------------------ chat misses

-- Every question that found no answer is a student telling you what the content
-- lacks. Without this the signal evaporates and coverage stays guesswork.
create table if not exists chat_misses (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  asked_at timestamptz not null default now()
);

create index if not exists chat_misses_asked_at_idx on chat_misses (asked_at desc);

alter table chat_misses enable row level security;

-- Deliberately NO select policy: these are visitors' own words, and the table is
-- readable only through the service role behind an admin session. Writes also go
-- through the service role, so a client can neither read the log nor forge it.

-- ------------------------------------------------------------- search_kb

create or replace function search_kb(p_query text, p_limit integer default 6)
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
as $$
  with q as (
    select
      -- websearch_to_tsquery parses, stems and drops stopwords correctly; we
      -- only loosen its conjunctions. ANDing meant "Which lecturer works on
      -- computer vision?" needed one chunk holding all of
      -- 'which','lectur','work','comput','vision' -- so it returned nothing,
      -- while "computer vision" found the right course instantly. Two extra
      -- human words should not decide that. With OR, ts_rank_cd sorts chunks
      -- matching more terms more densely to the top, so precision comes from
      -- ranking rather than from refusing to answer.
      -- Phrase operators (<->) from quoted input are left intact.
      nullif(replace(websearch_to_tsquery('english', p_query)::text, '&', '|'), '')::tsquery as tsq,
      p_query as raw
  )
  select
    merged.id, merged.source, merged.title,
    merged.content_en, merged.content_th, merged.metadata, merged.score
  from (
    select
      k.id, k.source, k.title, k.content_en, k.content_th, k.metadata,
      greatest(
        coalesce(ts_rank_cd(k.content_en_tsv, q.tsq, 32), 0),
        coalesce(word_similarity(q.raw, k.content_th), 0),
        -- English trigram sits below the tsquery on purpose: it is the typo
        -- safety net, not the primary matcher.
        coalesce(word_similarity(q.raw, k.title || ' ' || k.content_en), 0) * 0.9
      )::real as score
    from kb_chunks k
    cross join q
    where (q.tsq is not null and k.content_en_tsv @@ q.tsq)
       or (k.content_th <> '' and word_similarity(q.raw, k.content_th) >= 0.3)
       or word_similarity(q.raw, k.title || ' ' || k.content_en) >= 0.4

    union all

    select
      'faq:' || f.id::text, 'faq', f.question, f.answer, '', '{}'::jsonb,
      greatest(
        coalesce(ts_rank_cd(to_tsvector('english', f.question || ' ' || f.answer), q.tsq, 32), 0),
        coalesce(word_similarity(q.raw, f.question || ' ' || f.answer), 0)
      )::real
    from faqs f
    cross join q
    where (q.tsq is not null and to_tsvector('english', f.question || ' ' || f.answer) @@ q.tsq)
       or word_similarity(q.raw, f.question || ' ' || f.answer) >= 0.3
  ) merged
  where merged.score > 0
  order by merged.score desc, merged.id asc
  limit greatest(coalesce(p_limit, 6), 1);
$$;

grant execute on function search_kb(text, integer) to anon, authenticated, service_role;

-- ------------------------------------------------------------- FAQ seed
--
-- Answers supplied by the program owner. These live in `faqs`, which search_kb
-- unions at query time, so they are editable from the admin dashboard with no
-- redeploy and no re-ingestion.

insert into faqs (question, answer) values
  ($t$How do I apply to DME?$t$,
   $t$Two main routes for Thai applicants: TCAS, where your A-Level scores must meet the programme's threshold for that year (the threshold is set annually, so check the current round), and Quota, which is based on your own demonstrated ability, portfolio or awards. Applicants from ASEAN countries and China apply through https://activerecruit.kku.ac.th/#applynow. Applicants from other regions should contact the International Affairs Division on +66 (0) 4320 2059 or enforeign@kku.ac.th for the current application pack.$t$),

  ($t$Is DME taught in English?$t$,
   $t$Yes. Digital Media Engineering is an international programme and teaching is entirely in English.$t$),

  ($t$Are there scholarships for DME?$t$,
   $t$Scholarship information for the programme is published on the official DME page: https://www.en.kku.ac.th/web/en/beng-dme/ — see the scholarships section. For eligibility and deadlines specific to your applicant type, contact the International Affairs Division on +66 (0) 4320 2059 or enforeign@kku.ac.th.$t$),

  ($t$What laptop or software do I need?$t$,
   $t$You do not have to buy a high-end machine to start. The CDLC room provides Mac desktops with the production software used in the programme, and laptops can be borrowed through the KKU digital service at https://digital.kku.ac.th/. A personal laptop is useful for coursework but the lab machines cover the heavy 3D, video and audio work.$t$),

  ($t$How does Practical Training (internship) work?$t$,
   $t$Practical Training is EN 843 796, taken in the summer after third year (roughly April to June). It is audited, so the credit is not counted toward the 120-credit total. To register you must be in at least your third year, have passed at least 18 credit hours of compulsory courses, and hold a GPA of at least 1.90. Registration is through https://reg.kku.ac.th and the DME fee is 2,250 THB. You contact companies yourself before the placement starts, and you submit a report, a daily logbook and a final presentation at the end.$t$),

  ($t$How does Cooperative Education (co-op) work?$t$,
   $t$Cooperative Education is EN 844 786, worth 6 credits, taken in fourth year. You can do it in either semester: the first (roughly June to October) or the second (roughly November to March). The fee is 2,250 THB. To be eligible you must be in your fourth year, have passed all general education, fundamental and compulsory courses plus Practical Training as set out in the study plan, and hold a GPA of at least 2.00 in compulsory courses. You are expected to graduate within one semester of returning from the placement.$t$),

  ($t$Where do DME students live?$t$,
   $t$Students use a mix of KKU campus dormitories and private accommodation in Khon Kaen near the university; comparing a few places nearby will show you the standard local price. The Tuition & Fees page budgets roughly 3,000–6,000 THB per month for accommodation as an estimate.$t$),

  ($t$Do international students need a visa?$t$,
   $t$Yes, international students need the appropriate Thai student visa, and the university issues the supporting documents once you are admitted. Immigration requirements change and depend on your nationality, so do not rely on second-hand information: contact the International Affairs Division on +66 (0) 4320 2059 or enforeign@kku.ac.th for the current process.$t$),

  ($t$How is DME different from Computer Engineering?$t$,
   $t$Both share an engineering and programming foundation, but DME is oriented toward production rather than theory and research alone. You build and ship digital media products — 3D and animation, interactive media, games, audio, and the software behind them — and the curriculum is organised around four applied tracks: AI, Digital Media, Interactive, and Software.$t$),

  ($t$Can I take electives from more than one track?$t$,
   $t$Yes. The four major-elective tracks (AI, Digital Media, Interactive, Software) group the courses by theme, but you are not locked into one. You choose courses across the tracks to make up the minimum 27 elective credits.$t$),

  ($t$What are the graduation requirements?$t$,
   $t$The programme is 120 credits: 30 General Education (12 language, 6 humanities and social sciences, 12 mathematics and sciences), 84 in the specific group (15 fundamental, 36 compulsory, at least 27 major elective, 6 field experience), and at least 6 free elective credits. You need a minimum cumulative GPA of 2.00, must pass the university English requirement, and must complete the degree within a maximum of 8 years. The Curriculum Roadmap page shows the full year-by-year plan.$t$);
