// Real course data from Studio 4 Final Report (see docs/reference/curriculum-data.md).
// A few codes are marked "unclear" where the source screenshot was obscured or
// low-resolution — verify against the official KKU DME curriculum before publishing.

export const CATEGORIES = ["AI", "Digital Media", "Interactive", "Software"];

export const ELECTIVE_COURSES = {
  AI: [
    { code: "EN 813 706", name: "Artificial Neural Networks", credits: "3(3-0-6)" },
    { code: "EN 813 707", name: "Natural Language Processing", credits: "3(3-0-6)" },
    { code: "EN [unclear]", name: "Pattern Recognition and Its Applications", credits: "3(3-0-6)" },
    { code: "EN 842 401", name: "Data Visualization", credits: "3(3-0-6)" },
    { code: "EN 843 402", name: "Image Processing and Computer Vision", credits: "3(3-0-6)" },
    { code: "EN 843 403", name: "Data Science", credits: "3(3-0-6)" },
    { code: "EN 843 404", name: "Cognitive Computing", credits: "3(3-0-6)" },
    { code: "EN 843 405", name: "Deep Learning for Computer Vision", credits: "3(3-0-6)" },
    { code: "EN 843 407", name: "Artificial Intelligence", credits: "3(3-0-6)" },
    { code: "EN 844 306", name: "Information Architecture and Visualization", credits: "3(3-0-6)" },
    { code: "EN 844 406", name: "Interactive Data Visualization", credits: "3(3-0-6)" },
  ],
  "Digital Media": [
    { code: "EN 842 101", name: "3D Modeling and Animation", credits: "3(3-0-6)" },
    { code: "EN 842 500", name: "Fundamental Audio Engineering", credits: "3(2-3-6)" },
    { code: "EN [unclear]", name: "Character Animation and Control", credits: "—" },
    { code: "EN 843 105", name: "Computer-Generated Imagery", credits: "3(3-0-6)" },
    { code: "EN 843 107", name: "3D Animation Pipeline", credits: "3(3-0-6)" },
    { code: "EN 843 108", name: "Shading, Lighting and Rendering", credits: "3(2-3-6)" },
    { code: "EN 843 109", name: "3D Modelling and Digital Sculpting", credits: "3(3-0-6)" },
    { code: "EN 843 110", name: "Character and Theme Design", credits: "3(3-0-6)" },
    { code: "EN 843 111", name: "Visual Effects", credits: "3(2-3-6)" },
    { code: "EN 843 116", name: "Character Rigging and Dynamics", credits: "3(2-3-6)" },
    { code: "EN 843 117", name: "Real-Time Rendering", credits: "3(2-3-6)" },
    { code: "EN 843 501", name: "Advance Audio Engineering", credits: "3(2-3-6)" },
    { code: "EN 844 112", name: "Advanced Computer Graphics", credits: "3(3-0-6)" },
    { code: "EN 844 113", name: "Digital Compositing and Post-production", credits: "3(3-0-6)" },
    { code: "EN 844 114", name: "Python Scripting for Animation", credits: "3(3-0-6)" },
    { code: "EN 844 115", name: "3D Animation Pre-Production", credits: "3(3-0-6)" },
    { code: "EN 844 207", name: "Dynamic Simulation", credits: "3(3-0-6)" },
    { code: "EN 844 502", name: "Sound Design for Game and Animation", credits: "3(2-3-6)" },
  ],
  Interactive: [
    { code: "EN 841 315", name: "E-Sport", credits: "3(3-0-6)" },
    { code: "EN 842 316", name: "Advanced Digital Media Electronics", credits: "3(3-0-6)" },
    { code: "EN [unclear]", name: "Game Programming", credits: "—" },
    { code: "EN 843 201", name: "Game Design", credits: "3(3-0-6)" },
    { code: "EN 843 202", name: "Advanced Game Programming", credits: "3(3-0-6)" },
    { code: "EN 843 210", name: "Game Quality Assurance", credits: "3(3-0-6)" },
    { code: "EN 843 301", name: "User Interface and User Experience Design", credits: "3(3-0-6)" },
    { code: "EN 844 204", name: "Online Game Development", credits: "3(3-0-6)" },
    { code: "EN 844 209", name: "Serious Game", credits: "3(3-0-6)" },
    { code: "EN 844 308", name: "Interaction Design", credits: "3(3-0-6)" },
  ],
  Software: [
    { code: "EN 813 705", name: "Computer Technology for Education", credits: "3(3-0-6)" },
    { code: "EN 842 300", name: "Interactive Web Programming", credits: "3(3-0-6)" },
    { code: "EN [unclear]", name: "Multimedia Database", credits: "—" },
    { code: "EN 843 317", name: "Mobile Application Development", credits: "3(3-0-6)" },
    { code: "EN 843 318", name: "Web Application Development", credits: "3(3-0-6)" },
    { code: "EN 844 307", name: "Ubiquitous Computing", credits: "3(3-0-6)" },
    { code: "EN 844 309", name: "Computer Network Programming", credits: "3(3-0-6)" },
    { code: "EN 844 312", name: "Introduction to Software Engineering", credits: "3(3-0-6)" },
    { code: "EN 844 774", name: "Special Topics in Digital Media Engineering", credits: "3(3-0-6)" },
  ],
};

// Year-by-year required study plan. "Elective Course" rows are filled from the
// 4 tracks above by the student; codes shown as EN XXX XXX are placeholders in
// the source curriculum, not typos.
export const STUDY_PLAN = [
  {
    year: 1,
    semesters: [
      {
        name: "Semester 1",
        totalRegistered: 17,
        totalAccumulated: 16,
        courses: [
          { code: "EN 001 205", name: "Engineering Skills Development (non-credit)", credits: "1(0-3-2)" },
          { code: "EN 841 009", name: "Introduction to Digital Media", credits: "3(3-0-6)" },
          { code: "EN 841 009", name: "Digital Media Mathematics", credits: "3(3-0-6)" },
          { code: "EN 841 011", name: "Graphics Design", credits: "3(3-0-6)" },
          { code: "EN 841 012", name: "Digital Media Studio 1", credits: "1(0-3-2)" },
          { code: "EN XXX XXX", name: "Elective Course", credits: "—" },
          { code: "IC 011 016", name: "Information Literacy", credits: "3(3-0-6)" },
        ],
      },
      {
        name: "Semester 2",
        totalAccumulated: 32,
        courses: [
          { code: "EN 811 300", name: "Fundamentals of Computer Programming", credits: "3(3-0-6)" },
          { code: "EN 841 010", name: "Statistics for Data Science", credits: "3(3-0-6)" },
          { code: "EN 841 013", name: "Digital Media Studio 2", credits: "1(0-3-2)" },
          { code: "EN 841 400", name: "Introduction to Machine Learning", credits: "3(3-0-6)" },
          { code: "EN XXX XXX", name: "Elective Course", credits: "3" },
          { code: "IC 011 002", name: "Academic English", credits: "3(3-0-6)" },
        ],
      },
    ],
  },
  {
    year: 2,
    semesters: [
      {
        name: "Semester 1",
        totalRegistered: 16,
        totalAccumulated: 48,
        courses: [
          { code: "EN 842 006", name: "Introduction to Data Structures and Algorithms", credits: "3(3-0-6)" },
          { code: "EN 842 014", name: "Digital Media Electronics", credits: "3(2-3-6)" },
          { code: "EN 842 015", name: "Digital Media Studio 3", credits: "1(0-3-2)" },
          { code: "EN 842 314", name: "Interaction Programming", credits: "3(2-3-6)" },
          { code: "IC 011 001", name: "Critical Reading and Writing", credits: "3(3-0-6)" },
          { code: "IC 011 00X", name: "Second Foreign Language", credits: "3(3-0-6)" },
        ],
      },
      {
        name: "Semester 2",
        totalAccumulated: 64,
        courses: [
          { code: "EN 842 007", name: "Introduction to Discrete Mathematics", credits: "3(3-0-6)" },
          { code: "EN 842 016", name: "Agile Software Development", credits: "3(3-0-6)" },
          { code: "EN 842 017", name: "Digital Media Studio 4", credits: "1(0-3-2)" },
          { code: "EN 842 100", name: "Computer Graphics", credits: "3(3-0-6)" },
          { code: "IC 011 001", name: "Leadership and Change Management", credits: "3(3-0-6)" },
          { code: "IC 011 00X", name: "Logical Thinking and Problem Solving", credits: "3(3-0-6)" },
        ],
      },
    ],
  },
  {
    year: 3,
    semesters: [
      {
        name: "Semester 1",
        totalRegistered: 16,
        totalAccumulated: 80,
        courses: [
          { code: "EN 843 008", name: "Digital Media Processing", credits: "3(3-0-6)" },
          { code: "EN 843 018", name: "Digital Media Studio 5", credits: "1(0-3-2)" },
          { code: "EN XXX XXX", name: "Elective Course", credits: "6" },
          { code: "EN 842 314", name: "Career Preparation and Professionalism", credits: "3(2-3-6)" },
          { code: "IC 011 00X", name: "Second Foreign Language", credits: "3(3-0-6)" },
        ],
      },
      {
        name: "Semester 2",
        totalRegistered: 16,
        totalAccumulated: 96,
        courses: [
          { code: "EN 842 007", name: "Digital Media Studio 6", credits: "3(3-0-6)" },
          { code: "EN 843 304", name: "Computer Networking and Internet Technology", credits: "3(3-0-6)" },
          { code: "EN XXX XXX", name: "Elective Course", credits: "6" },
          { code: "IC 011 019", name: "Creative Entrepreneurship", credits: "3(3-0-6)" },
          { code: "IC 011 020", name: "Basic Personal Financial Planning", credits: "3(3-0-6)" },
        ],
      },
      {
        name: "Summer",
        courses: [
          { code: "EN 843 796", name: "Practical Training (non-credit)", credits: "1(0-3-1)" },
        ],
      },
    ],
  },
  {
    year: 4,
    semesters: [
      {
        name: "Semester 1",
        totalRegistered: 18,
        totalAccumulated: 114,
        courses: [
          { code: "EN 844 020", name: "Extended Reality", credits: "3(3-0-6)" },
          { code: "EN XXX XXX", name: "Elective Courses", credits: "9" },
          { code: "XXX XXX", name: "Free Electives", credits: "6" },
        ],
      },
      {
        name: "Semester 2",
        totalRegistered: 6,
        totalAccumulated: 120,
        courses: [
          { code: "EN 842 007", name: "Cooperative Education in Digital Media Engineering", credits: "3(3-0-6)" },
        ],
      },
    ],
  },
];

export const PROGRAM_TOTAL_CREDITS = 120;
