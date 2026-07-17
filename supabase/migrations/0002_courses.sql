create table courses (
  course_id serial primary key,
  program_id integer references programs(program_id),
  course_code text not null unique,
  course_name text not null,
  credits text not null,
  course_type text not null check (course_type in ('General', 'Major (Basic)', 'Major (Core)', 'Major (Elective)', 'Field')),
  category text check (category in ('AI', 'Digital Media', 'Interactive', 'Software')),
  year integer check (year between 1 and 4),
  semester text check (semester in ('Semester 1', 'Semester 2', 'Summer')),
  description text,
  created_at timestamptz not null default now()
);

create index courses_course_type_idx on courses(course_type);
create index courses_category_idx on courses(category);
