import DmeFullLogo from "../components/DmeFullLogo.jsx";

const facts = [
  {
    title: "What is DME?",
    body: "Digital Media Engineering (DME) is an international undergraduate program at Khon Kaen University's Faculty of Engineering that blends software engineering fundamentals with digital media production — 3D/animation, interactive media, AI, and game/software development.",
  },
  {
    title: "What do we learn?",
    body: "Students build a foundation in programming, data structures, and computer graphics in Years 1-2, then specialize in Years 3-4 through elective tracks: AI, Digital Media, Interactive, or Software. See the Curriculum Roadmap for the full plan.",
  },
  {
    title: "Vision & Mission",
    body: "To produce engineers who can design, build, and ship digital media products end-to-end — combining engineering rigor with creative and interactive media skills that the games, animation, and software industries need.",
  },
  {
    title: "Why choose DME KKU?",
    body: "DME-specific facilities (CDLC, Mac labs, VR/broadcast classrooms), an updated curriculum aligned with industry tools (Unity, Unreal, Adobe Suite, Figma, Blender), and a curriculum designed around 4 real specialization tracks rather than a generic CS degree.",
  },
];

export default function AboutDME() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 inline-block rounded-2xl bg-white px-6 py-4 shadow-xl">
        <DmeFullLogo iconClassName="h-16 w-16" textClassName="text-xl" />
      </div>

      <h1 className="mb-2 text-3xl font-bold text-white">About DME</h1>
      <p className="mb-10 text-slate-400">
        Digital Media Engineering at Khon Kaen University's Faculty of Engineering.
      </p>

      <div className="space-y-8">
        {facts.map((f) => (
          <div key={f.title} className="border-l-2 border-dme-orange pl-4">
            <h2 className="mb-1 text-lg font-semibold text-white">{f.title}</h2>
            <p className="text-slate-300">{f.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-slate-500">
        Placeholder content — edit freely once official program copy is available.
      </p>
    </div>
  );
}
