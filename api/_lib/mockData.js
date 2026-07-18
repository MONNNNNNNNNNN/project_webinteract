// Simulated data — used when no live provider key is configured
// (ANTHROPIC_API_KEY / JSEARCH_API_KEY). Facts distilled from
// src/lib/curriculumData.js and src/lib/tuitionData.js.

export const FAQ_FACTS = [
  {
    id: "what-is-dme",
    keywords: ["what is dme", "about dme", "dme program", "digital media engineering"],
    question: "What is DME?",
    answer:
      "Digital Media Engineering (DME) is a Bachelor of Engineering program at Khon Kaen University combining digital media production with software engineering foundations.",
  },
  {
    id: "electives",
    keywords: ["elective", "track", "major elective", "specialization", "categories"],
    question: "What major elective tracks does DME have?",
    answer:
      "DME major electives split into 4 tracks: AI, Digital Media, Interactive, and Software. You pick courses across these tracks based on your interests.",
  },
  {
    id: "tuition",
    keywords: ["tuition", "fee", "cost", "how much", "price"],
    question: "How much does DME cost?",
    answer:
      "Tuition depends on student type. Thai students: ~45,000 THB/semester. Mekong Region (Cambodia, China, Laos, Myanmar, Vietnam): 50,000 THB/semester, no enrollment fee. International (other regions): 65,000 THB/semester + 10,000 THB one-time enrollment fee. See the Tuition & Fees page for the full breakdown, sourced from the official program page.",
  },
  {
    id: "contact",
    keywords: ["contact", "email", "phone", "register", "registration", "apply", "admission"],
    question: "How do I contact DME / register?",
    answer:
      "For admissions and registration, contact the International Affairs Division at +66 (0) 4320 2059 or enforeign@kku.ac.th. General Faculty of Engineering line: +66 (0) 4300 9700 ext. 50215 or 45641. See the Contact page for all channels.",
  },
  {
    id: "career",
    keywords: ["job", "career", "work", "after graduation", "employment"],
    question: "What jobs can DME graduates get?",
    answer:
      "DME graduates commonly go into 3D & Animation, Game Development, AI & Data roles, and Software Engineering. Check the Career Explorer page for current open listings.",
  },
  {
    id: "duration",
    keywords: ["how long", "years", "duration", "4 year", "study plan"],
    question: "How long is the DME program?",
    answer:
      "DME is a 4-year Bachelor of Engineering program. The Curriculum Roadmap page shows the full year-by-year study plan.",
  },
];

export const FALLBACK_ANSWER =
  "I'm not sure about that one yet — try asking about the DME program, electives, tuition, careers, or program duration. (This is a simulated answer; a live AI chatbot needs ANTHROPIC_API_KEY configured.)";

export const MOCK_JOBS = [
  {
    id: "job-1",
    title: "3D Character Artist",
    company: "Riot Games",
    location: "Bangkok, Thailand (Hybrid)",
    interest: "3D & Animation",
    postedAt: "2026-07-10",
    url: "https://example.com/jobs/3d-character-artist",
  },
  {
    id: "job-2",
    title: "Junior Animator",
    company: "Kantana Animation Studio",
    location: "Bangkok, Thailand",
    interest: "3D & Animation",
    postedAt: "2026-07-05",
    url: "https://example.com/jobs/junior-animator",
  },
  {
    id: "job-3",
    title: "Gameplay Programmer",
    company: "Garena",
    location: "Bangkok, Thailand",
    interest: "Game Dev",
    postedAt: "2026-07-12",
    url: "https://example.com/jobs/gameplay-programmer",
  },
  {
    id: "job-4",
    title: "Unity Developer (Junior)",
    company: "Extend Interactive",
    location: "Remote (Thailand)",
    interest: "Game Dev",
    postedAt: "2026-07-08",
    url: "https://example.com/jobs/unity-developer",
  },
  {
    id: "job-5",
    title: "Machine Learning Engineer, Intern",
    company: "AIS",
    location: "Bangkok, Thailand",
    interest: "AI & Data",
    postedAt: "2026-07-14",
    url: "https://example.com/jobs/ml-engineer-intern",
  },
  {
    id: "job-6",
    title: "Data Analyst",
    company: "SCB 10X",
    location: "Bangkok, Thailand (Hybrid)",
    interest: "AI & Data",
    postedAt: "2026-07-11",
    url: "https://example.com/jobs/data-analyst",
  },
  {
    id: "job-7",
    title: "Frontend Developer (React)",
    company: "Bitkub",
    location: "Bangkok, Thailand",
    interest: "Software",
    postedAt: "2026-07-13",
    url: "https://example.com/jobs/frontend-developer",
  },
  {
    id: "job-8",
    title: "Backend Developer, New Grad",
    company: "LINE Thailand",
    location: "Bangkok, Thailand",
    interest: "Software",
    postedAt: "2026-07-09",
    url: "https://example.com/jobs/backend-developer-new-grad",
  },
];

export const DEFAULT_FAQS = FAQ_FACTS.map((f) => ({
  id: f.id,
  question: f.question,
  answer: f.answer,
}));
