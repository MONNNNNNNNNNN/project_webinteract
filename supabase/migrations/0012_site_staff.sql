-- Admin-editable lecturer directory.
--
-- src/lib/staffData.js stays: it seeds this table and remains the runtime
-- fallback for AboutDME.jsx when Supabase is unreachable. See the
-- "Admin-editable content" section of CLAUDE.md.
--
-- No email column, deliberately. The source directory obfuscates addresses with
-- anti-spam JS and staffData.js omits them rather than guessing; adding the
-- field here would invite someone to fill it in with a guess.

create table site_staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null default '',
  education text not null default '',
  specialty text not null default '',
  photo_url text,
  profile_url text,
  room text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_staff_sort_idx on site_staff (sort_order, name);

alter table site_staff enable row level security;

-- Public page reads it; writes go through api/content/[type].js with the
-- service role key after the admin session cookie authorizes the request.
create policy "site staff is viewable by everyone" on site_staff
  for select using (true);

-- Seed — generated from the LECTURERS array in src/lib/staffData.js, which was
-- transcribed from gear.kku.ac.th. Dollar-quoted: several names and degrees
-- contain apostrophes.
insert into site_staff (name, title, education, specialty, photo_url, profile_url, room, sort_order) values
  ($t$Bhichate Chiewthanakul$t$, $t$Assoc. Prof.$t$, $t$B.Eng. King Mongkut's Institute of Technology Ladkrabang, M.Eng. Asian Institute of Technology$t$,
   $t$Number theory, Elliptic curves, Modular forms$t$, $t$/staff/bhichate.png$t$, $t$https://gear.kku.ac.th/~bhichate$t$, null, 10),
  ($t$Chatchai Khunboa$t$, $t$Assoc. Prof.$t$, $t$B.Eng. (Hons.) Khon Kaen University, M.S. University of Pittsburgh, Ph.D. George Mason University$t$,
   $t$Ad hoc Networks, Sensor Networks, Telecommunications, Computer Networks$t$, $t$/staff/chatchai.jpg$t$, null, null, 20),
  ($t$Chavis Srichan$t$, $t$Asst. Prof.$t$, $t$B.Eng. Khon Kaen University, M.Sc. Hamburg University of Technology, D.Eng. Asian Institute of Technology$t$,
   $t$Nanoelectronic$t$, $t$/staff/chavis.jpg$t$, null, null, 30),
  ($t$Daranee Hormdee$t$, $t$Asst. Prof.$t$, $t$B.Eng. Khon Kaen University, M.Sc./Ph.D. University of Manchester$t$,
   $t$Embedded Systems, Microprocessors, Micro-controller$t$, $t$/staff/daranee.png$t$, $t$https://gear.kku.ac.th/~ying/$t$, null, 40),
  ($t$Jiradej Ponsawat$t$, $t$Asst. Prof.$t$, $t$B.Eng. Khon Kaen University, M.Eng./D.Eng. Chulalongkorn University$t$,
   $t$Evolutionary Processing, Bioinformatics$t$, $t$/staff/jiradej.png$t$, null, null, 50),
  ($t$Kanda Runapongsa Saikaew$t$, $t$Assoc. Prof.$t$, $t$B.S. (Hons.) Carnegie Mellon University, M.S./Ph.D. University of Michigan$t$,
   $t$XML, DBMS, Web Services, Web 2.0$t$, $t$/staff/kanda.jpg$t$, $t$https://gear.kku.ac.th/~krunapon$t$, null, 60),
  ($t$Kitt Tientanopajai$t$, $t$Lecturer$t$, $t$B.Eng. Khon Kaen University, M.Eng./D.Eng. Asian Institute of Technology$t$,
   $t$Computer Networks, Information Security, Free/Open Source Software$t$, $t$/staff/kitt.png$t$, $t$https://gear.kku.ac.th/~kitt$t$, null, 70),
  ($t$Kornchawal Chaipah$t$, $t$Asst. Prof.$t$, $t$B.S./M.S./Ph.D. Carnegie Mellon University$t$,
   $t$Computer Technology in Education, Computer Networks$t$, $t$/staff/kornchawal.jpg$t$, null, null, 80),
  ($t$Manasawee Kaenampornpan$t$, $t$Asst. Prof.$t$, $t$B.Eng. University of Warwick, M.Sc. University of Bristol, Ph.D. University of Bath$t$,
   $t$UX Design, HCI, Mobile & Ubiquitous Computing, Social Media & Digital Marketing, Software Engineering$t$, $t$/staff/manasawee.jpg$t$, null, $t$EN4202A$t$, 90),
  ($t$Nawapak Eua-Anant$t$, $t$Lecturer$t$, $t$B.Eng. (Hons.) Khon Kaen University, M.E./Ph.D. Iowa State University$t$,
   $t$Digital Signal/Image Processing, Pattern Recognition, Artificial Neural Networks$t$, $t$/staff/nawapak.jpg$t$, null, null, 100),
  ($t$Panawit Hanpinitsak$t$, $t$Lecturer$t$, $t$B.Eng. (1st Hons.) Sirindhorn International Institute of Technology, M.Eng./D.Eng. Tokyo Institute of Technology$t$,
   $t$Computer Vision, Localization, Wireless Communication$t$, $t$/staff/panawit.jpg$t$, null, $t$EN4512A$t$, 110),
  ($t$Panupong Wanjantuk$t$, $t$Asst. Prof.$t$, $t$B.Eng. Khon Kaen University, M.Phil. University of Manchester$t$,
   $t$High-performance Computing, Data Mining$t$, $t$/staff/panupong.png$t$, null, null, 120),
  ($t$Pattarawit Polpinit$t$, $t$Asst. Prof.$t$, $t$B.S. Cornell University, M.Sc. Asian Institute of Technology, Ph.D. University of Liverpool$t$,
   $t$Game Theory, Theory of Computation, Analysis of Algorithms$t$, $t$/staff/pattarawit.jpg$t$, $t$https://gear.kku.ac.th/~polpinit/$t$, null, 130),
  ($t$Sarun Paisarnsrisomsuk$t$, $t$Lecturer$t$, $t$B.S. Worcester Polytechnic Institute, M.S. University of Virginia, Ph.D. Worcester Polytechnic Institute$t$,
   $t$Neural Networks$t$, $t$/staff/sarun.jpg$t$, null, null, 140),
  ($t$Tatpong Katanyukul$t$, $t$Assoc. Prof.$t$, $t$B.Eng. King Mongkut's Institute of Technology Ladkrabang, M.Eng. Asian Institute of Technology, Ph.D. Colorado State University$t$,
   $t$Machine Learning, Pattern Recognition$t$, $t$/staff/tatpong.jpg$t$, $t$https://gear.kku.ac.th/index.php/staff/tatpong$t$, null, 150),
  ($t$Wanida Kanarkard$t$, $t$Prof.$t$, $t$B.Eng. (Hons.) Khon Kaen University, Imperial College London, Ph.D. University of Hertfordshire, Postdoc National Institute of Informatics (Japan)$t$,
   $t$Computational Intelligence, A.I., High-performance Computing$t$, $t$/staff/wanida.png$t$, null, null, 160),
  ($t$Wasu Chaopanon$t$, $t$Lecturer$t$, $t$B.Eng. Khon Kaen University, M.S. New York University, Ph.D. University of Pittsburgh$t$,
   $t$Web, HCI, Information Retrieval$t$, $t$/staff/wasu.jpg$t$, $t$https://gear.kku.ac.th/~wasu$t$, null, 170),
  ($t$Watis Leelapatra$t$, $t$Lecturer$t$, $t$B.Eng. Khon Kaen University, M.S. Case Western Reserve University, D.Eng. Asian Institute of Technology$t$,
   $t$Embedded Systems, Computer Architecture$t$, $t$/staff/watis.jpg$t$, $t$https://gear.kku.ac.th/~watis$t$, null, 180),
  ($t$Witcha Feungchan$t$, $t$Asst. Prof.$t$, $t$B.Eng. Khon Kaen University, M.Sc. Chulalongkorn University, Ph.D. University of Regina$t$,
   $t$Games Design, Ubiquitous Computing, Virtual Reality$t$, $t$/staff/witcha.jpg$t$, $t$https://gear.kku.ac.th/~witcha$t$, null, 190)
;
