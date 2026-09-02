-- Admin-editable tuition and fees.
--
-- src/lib/tuitionData.js stays: STUDENT_TYPES and FEE_BREAKDOWN seed these
-- tables and remain the runtime fallback for TuitionFees.jsx. See the
-- "Admin-editable content" section of CLAUDE.md.
--
-- These are figures a prospective student will budget against, so the
-- constraints are real rather than decorative: amounts cannot go negative,
-- period and item type are closed sets, and a fee row cannot reference a
-- student type that does not exist.

create table site_student_types (
  -- Text, not uuid: 'thai' / 'mekong' / 'international' are referenced by
  -- TuitionFees.jsx state and read far better in the fee_rows foreign key.
  id text primary key,
  label text not null,
  semester_fee integer not null default 0 check (semester_fee >= 0),
  has_living_cost boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table site_fee_rows (
  id uuid primary key default gen_random_uuid(),
  -- restrict, not cascade: deleting a student type that still has fee rows
  -- should fail loudly rather than silently delete a fee schedule.
  student_type_id text not null references site_student_types(id) on update cascade on delete restrict,
  period text not null check (period in ('Per Semester', 'Full 4 Years')),
  item text not null,
  item_type text not null check (item_type in ('Mandatory', 'One-time', 'Optional')),
  amount integer not null default 0 check (amount >= 0),
  -- Per-semester one-off charges (enrollment fee, summer training) are shown
  -- but left out of the per-semester total; see grandTotal() in tuitionData.js.
  excluded_from_total boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_fee_rows_lookup_idx on site_fee_rows (student_type_id, period, sort_order);

alter table site_student_types enable row level security;
alter table site_fee_rows enable row level security;

create policy "student types are viewable by everyone" on site_student_types
  for select using (true);

create policy "fee rows are viewable by everyone" on site_fee_rows
  for select using (true);

-- Seed — generated from STUDENT_TYPES and FEE_BREAKDOWN in
-- src/lib/tuitionData.js. Those figures were confirmed against the official
-- program page (en.kku.ac.th/web/en/beng-dme) for the international rates; the
-- Thai rate comes from the Studio 4 report.
insert into site_student_types (id, label, semester_fee, has_living_cost, sort_order) values
($t$thai$t$, $t$Thai Students$t$, 45000, false, 10),
  ($t$mekong$t$, $t$Mekong Region$t$, 50000, true, 20),
  ($t$international$t$, $t$International$t$, 65000, true, 30);

insert into site_fee_rows (student_type_id, period, item, item_type, amount, excluded_from_total, sort_order) values
($t$thai$t$, $t$Per Semester$t$, $t$Tuition Fee$t$, $t$Mandatory$t$, 45000, false, 10),
  ($t$thai$t$, $t$Per Semester$t$, $t$Summer Training$t$, $t$One-time$t$, 2500, true, 20),
  ($t$thai$t$, $t$Full 4 Years$t$, $t$Tuition Fee (8 semesters)$t$, $t$Mandatory$t$, 360000, false, 10),
  ($t$thai$t$, $t$Full 4 Years$t$, $t$Summer Training$t$, $t$One-time$t$, 2500, false, 20),
  ($t$mekong$t$, $t$Per Semester$t$, $t$Tuition Fee$t$, $t$Mandatory$t$, 50000, false, 10),
  ($t$mekong$t$, $t$Per Semester$t$, $t$Summer Training$t$, $t$One-time$t$, 2500, true, 20),
  ($t$mekong$t$, $t$Per Semester$t$, $t$Health Insurance (~฿5,000–10,000/yr)$t$, $t$Optional$t$, 3750, false, 30),
  ($t$mekong$t$, $t$Per Semester$t$, $t$Accommodation (~฿3,000–6,000/mo x4)$t$, $t$Optional$t$, 18000, false, 40),
  ($t$mekong$t$, $t$Per Semester$t$, $t$Living Costs (~฿6,000–10,000/mo x4)$t$, $t$Optional$t$, 32000, false, 50),
  ($t$mekong$t$, $t$Full 4 Years$t$, $t$Tuition Fee (8 semesters)$t$, $t$Mandatory$t$, 400000, false, 10),
  ($t$mekong$t$, $t$Full 4 Years$t$, $t$Summer Training$t$, $t$One-time$t$, 2500, false, 20),
  ($t$mekong$t$, $t$Full 4 Years$t$, $t$Health Insurance (4 years)$t$, $t$Optional$t$, 30000, false, 30),
  ($t$mekong$t$, $t$Full 4 Years$t$, $t$Accommodation (~40 months)$t$, $t$Optional$t$, 180000, false, 40),
  ($t$mekong$t$, $t$Full 4 Years$t$, $t$Living Costs (~40 months)$t$, $t$Optional$t$, 320000, false, 50),
  ($t$international$t$, $t$Per Semester$t$, $t$Tuition Fee$t$, $t$Mandatory$t$, 65000, false, 10),
  ($t$international$t$, $t$Per Semester$t$, $t$Summer Training$t$, $t$One-time$t$, 2500, true, 20),
  ($t$international$t$, $t$Per Semester$t$, $t$Enrollment Fee (new students)$t$, $t$One-time$t$, 10000, true, 30),
  ($t$international$t$, $t$Per Semester$t$, $t$Health Insurance (~฿5,000–10,000/yr)$t$, $t$Optional$t$, 3750, false, 40),
  ($t$international$t$, $t$Per Semester$t$, $t$Accommodation (~฿3,000–6,000/mo x4)$t$, $t$Optional$t$, 18000, false, 50),
  ($t$international$t$, $t$Per Semester$t$, $t$Living Costs (~฿6,000–10,000/mo x4)$t$, $t$Optional$t$, 32000, false, 60),
  ($t$international$t$, $t$Full 4 Years$t$, $t$Tuition Fee (8 semesters)$t$, $t$Mandatory$t$, 520000, false, 10),
  ($t$international$t$, $t$Full 4 Years$t$, $t$Summer Training$t$, $t$One-time$t$, 2500, false, 20),
  ($t$international$t$, $t$Full 4 Years$t$, $t$Enrollment Fee$t$, $t$One-time$t$, 10000, false, 30),
  ($t$international$t$, $t$Full 4 Years$t$, $t$Health Insurance (4 years)$t$, $t$Optional$t$, 30000, false, 40),
  ($t$international$t$, $t$Full 4 Years$t$, $t$Accommodation (~40 months)$t$, $t$Optional$t$, 180000, false, 50),
  ($t$international$t$, $t$Full 4 Years$t$, $t$Living Costs (~40 months)$t$, $t$Optional$t$, 320000, false, 60);
