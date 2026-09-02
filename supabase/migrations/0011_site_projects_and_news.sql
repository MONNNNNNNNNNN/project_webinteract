-- Admin-editable content: Student Projects and the Home news carousel.
--
-- These were hardcoded arrays in src/pages/StudentProjects.jsx and
-- src/pages/Home.jsx. Both still exist and are still imported — they are the
-- seed for the rows below and the runtime fallback if Supabase is unreachable.
-- Supabase free-tier projects pause after 7 days idle, so a paused project must
-- degrade to the original static site rather than a blank page.
--
-- Two columns worth explaining:
--
--   icon_name — the placeholder project entries render a lucide component
--   (Clapperboard, Gamepad2, Bot). A React component cannot be stored in a
--   database, so the *name* is stored and StudentProjects.jsx maps it back to a
--   component through an explicit whitelist with a fallback for unknown names.
--
--   image_url — a path or URL string, nothing more. Vercel's runtime filesystem
--   is read-only, so there is no upload path; images are committed under public/
--   or hosted elsewhere.

create table site_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  image_url text,
  icon_name text,
  is_real boolean not null default false,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table site_news (
  id uuid primary key default gen_random_uuid(),
  tag text not null,
  title text not null,
  image_url text,
  is_real boolean not null default false,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_projects_sort_idx on site_projects (sort_order, created_at);
create index site_news_sort_idx on site_news (sort_order, created_at);

alter table site_projects enable row level security;
alter table site_news enable row level security;

-- Public pages read these, so select is open. No write policy: writes go
-- through api/content/[type].js with the service role key, after the admin
-- session cookie has authorized the request.
create policy "site projects are viewable by everyone" on site_projects
  for select using (true);

create policy "site news is viewable by everyone" on site_news
  for select using (true);

-- Seed — transcribed verbatim from the `projects` array in StudentProjects.jsx.
-- Dollar-quoted because the copy contains apostrophes and em dashes.
insert into site_projects (title, category, image_url, icon_name, is_real, description, sort_order) values
  ($t$Thailand Research Expo 2024 — Bronze Medal$t$, $t$Award$t$, $t$/projects/expo2024-bronze.jpg$t$, null, true,
   $t$DME students won a Bronze Medal at the Higher Education Innovation Stage, Thailand Research Expo 2024 (มหกรรมงานวิจัยแห่งชาติ 2567).$t$, 10),
  ($t$Studio Visit — The Monk Studios, Igdrasil Group, Zurreal Studio$t$, $t$Field Study$t$, $t$/projects/studio-visit-2024.jpg$t$, null, true,
   $t$March 7–9, 2024: 36 third-year DME students visited three digital media companies to build real-world industry experience alongside classroom learning.$t$, 20),
  ($t$Interactive Album Story$t$, $t$Digital Media$t$, null, $t$Clapperboard$t$, false,
   $t$A 3D animated short combining character rigging and real-time rendering, produced as a Digital Media Studio capstone.$t$, 30),
  ($t$Campus Quest$t$, $t$Interactive$t$, null, $t$Gamepad2$t$, false,
   $t$A game-dev orientation project that turns the KKU campus into an explorable 2D game for incoming freshmen.$t$, 40),
  ($t$DME FAQ Assistant$t$, $t$Software / AI$t$, null, $t$Bot$t$, false,
   $t$An early prototype chatbot answering common DME admissions questions, built with a lightweight NLP pipeline.$t$, 50);

-- Seed — transcribed verbatim from the `newsItems` array in Home.jsx.
insert into site_news (tag, title, image_url, is_real, description, sort_order) values
  ($t$Award$t$, $t$DME Students Win Bronze Medal — Thailand Research Expo 2024$t$, $t$/projects/expo2024-bronze.jpg$t$, true,
   $t$DME students won a Bronze Medal at the Higher Education Innovation Stage, Thailand Research Expo 2024 (มหกรรมงานวิจัยแห่งชาติ 2567).$t$, 10),
  ($t$Field Study$t$, $t$DME Studio Visit — The Monk Studios, Igdrasil Group, Zurreal Studio$t$, $t$/projects/studio-visit-2024.jpg$t$, true,
   $t$March 7–9, 2024: 36 third-year DME students visited three digital media companies — The Monk Studios, Igdrasil Group, and Zurreal Studio — to build real-world industry experience alongside classroom learning.$t$, 20),
  ($t$Faculty Events$t$, $t$Engineering Freshmen '63 — July 2026 Activity Calendar$t$, $t$/news/july-events-2026.jpg$t$, true,
   $t$This month's Faculty of Engineering student council calendar: Explore Your Path (Jul 4), EN Choir (Jul 6–9), Quest for Athlete orientation series (Jul 11–18), Wai Kru Day (Jul 23), and Sophomore's Day (Jul 25).$t$, 30),
  ($t$KKU News$t$, $t$Thailand University Esports Championship 2026, hosted at KKU$t$, $t$/news/esports-2026.jpg$t$, true,
   $t$Khon Kaen University hosted the 1st Thailand University Esports Championship, 6–10 July 2026 — 3 games, 400+ players from universities nationwide. Not a DME-organized event, but held on campus.$t$, 40);
