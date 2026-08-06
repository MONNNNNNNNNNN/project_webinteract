create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

alter table faqs enable row level security;

-- Readable by anyone (the chatbot / public FAQ list), writable only by
-- authenticated users (the admin panel signs in via Supabase Auth).
create policy "faqs are viewable by everyone" on faqs
  for select using (true);

create policy "faqs are insertable by authenticated users" on faqs
  for insert with check (auth.role() = 'authenticated');

create policy "faqs are updatable by authenticated users" on faqs
  for update using (auth.role() = 'authenticated');

create policy "faqs are deletable by authenticated users" on faqs
  for delete using (auth.role() = 'authenticated');

-- Seed with the same facts api/_lib/mockData.js falls back to, so the
-- admin dashboard starts from continuity rather than an empty table.
insert into faqs (question, answer) values
  ('What is DME?',
   'Digital Media Engineering (DME) is a Bachelor of Engineering program at Khon Kaen University combining digital media production with software engineering foundations.'),
  ('What major elective tracks does DME have?',
   'DME major electives split into 4 tracks: AI, Digital Media, Interactive, and Software. You pick courses across these tracks based on your interests.'),
  ('How much does DME cost?',
   'Tuition depends on student type. Thai students: ~45,000 THB/semester. Mekong Region (Cambodia, China, Laos, Myanmar, Vietnam): 50,000 THB/semester, no enrollment fee. International (other regions): 65,000 THB/semester + 10,000 THB one-time enrollment fee. See the Tuition & Fees page for the full breakdown, sourced from the official program page.'),
  ('How do I contact DME / register?',
   'For admissions and registration, contact the International Affairs Division at +66 (0) 4320 2059 or enforeign@kku.ac.th. General Faculty of Engineering line: +66 (0) 4300 9700 ext. 50215 or 45641. See the Contact page for all channels.'),
  ('What jobs can DME graduates get?',
   'DME graduates commonly go into 3D & Animation, Game Development, AI & Data roles, and Software Engineering. Check the Career Explorer page for current open listings.'),
  ('How long is the DME program?',
   'DME is a 4-year Bachelor of Engineering program. The Curriculum Roadmap page shows the full year-by-year study plan.');
