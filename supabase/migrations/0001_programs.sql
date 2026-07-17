create table programs (
  program_id serial primary key,
  program_name text not null,
  degree_level text not null default 'Bachelor',
  description text,
  revised_year text,
  created_at timestamptz not null default now()
);

insert into programs (program_name, degree_level, description, revised_year) values
  ('Digital Media Engineering (International Program)', 'Bachelor',
   'Bachelor of Engineering program combining digital media production with software engineering foundations.',
   'B.E. 2565 / 2022');
