create table student_status (
  status_id serial primary key,
  status_name text not null check (status_name in ('Thai', 'Mekong Region', 'International')),
  has_estimated_living_cost boolean default true
);

create table fee_detail (
  fee_id serial primary key,
  status_id integer references student_status(status_id),
  study_period text not null check (study_period in ('Per Semester', 'Full 4 Years')),
  item_name text not null,
  cost_type text not null check (cost_type in ('Academic costs', 'Estimated costs')),
  item_type text not null check (item_type in ('Mandatory', 'One-time', 'Optional')),
  amount integer not null
);

insert into student_status (status_name, has_estimated_living_cost) values
  ('Thai', false),
  ('Mekong Region', true),
  ('International', true);

-- Thai (status_id 1)
insert into fee_detail (status_id, study_period, item_name, cost_type, item_type, amount) values
  (1, 'Per Semester', 'Tuition Fee', 'Academic costs', 'Mandatory', 45000),
  (1, 'Per Semester', 'Summer Training', 'Academic costs', 'One-time', 2500),
  (1, 'Full 4 Years', 'Tuition Fee', 'Academic costs', 'Mandatory', 360000),
  (1, 'Full 4 Years', 'Summer Training', 'Academic costs', 'One-time', 2500);

-- Mekong Region (status_id 2)
insert into fee_detail (status_id, study_period, item_name, cost_type, item_type, amount) values
  (2, 'Per Semester', 'Tuition Fee', 'Academic costs', 'Mandatory', 50000),
  (2, 'Per Semester', 'Summer Training', 'Academic costs', 'One-time', 2500),
  (2, 'Per Semester', 'Accommodation', 'Estimated costs', 'Optional', 4000),
  (2, 'Per Semester', 'Cost of Living', 'Estimated costs', 'Optional', 6000),
  (2, 'Full 4 Years', 'Tuition Fee', 'Academic costs', 'Mandatory', 400000),
  (2, 'Full 4 Years', 'Summer Training', 'Academic costs', 'One-time', 2500),
  (2, 'Full 4 Years', 'Accommodation', 'Estimated costs', 'Optional', 160000),
  (2, 'Full 4 Years', 'Cost of Living', 'Estimated costs', 'Optional', 240000);

-- International (status_id 3)
insert into fee_detail (status_id, study_period, item_name, cost_type, item_type, amount) values
  (3, 'Per Semester', 'Tuition Fee', 'Academic costs', 'Mandatory', 65000),
  (3, 'Per Semester', 'Summer Training', 'Academic costs', 'One-time', 2500),
  (3, 'Per Semester', 'Enrollment Fee', 'Academic costs', 'One-time', 10000),
  (3, 'Per Semester', 'Accommodation', 'Estimated costs', 'Optional', 4000),
  (3, 'Per Semester', 'Cost of Living', 'Estimated costs', 'Optional', 6000),
  (3, 'Full 4 Years', 'Tuition Fee', 'Academic costs', 'Mandatory', 520000),
  (3, 'Full 4 Years', 'Summer Training', 'Academic costs', 'One-time', 2500),
  (3, 'Full 4 Years', 'Enrollment Fee', 'Academic costs', 'One-time', 10000),
  (3, 'Full 4 Years', 'Accommodation', 'Estimated costs', 'Optional', 160000),
  (3, 'Full 4 Years', 'Cost of Living', 'Estimated costs', 'Optional', 240000);
