import { Clapperboard, Gamepad2, Bot } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";

const projects = [
  {
    title: "Thailand Research Expo 2024 — Bronze Medal",
    category: "Award",
    image: "/projects/expo2024-bronze.jpg",
    real: true,
    desc: "DME students won a Bronze Medal at the Higher Education Innovation Stage, Thailand Research Expo 2024 (มหกรรมงานวิจัยแห่งชาติ 2567).",
  },
  {
    title: "Interactive Album Story",
    category: "Digital Media",
    icon: Clapperboard,
    desc: "A 3D animated short combining character rigging and real-time rendering, produced as a Digital Media Studio capstone.",
  },
  {
    title: "Campus Quest",
    category: "Interactive",
    icon: Gamepad2,
    desc: "A game-dev orientation project that turns the KKU campus into an explorable 2D game for incoming freshmen.",
  },
  {
    title: "DME FAQ Assistant",
    category: "Software / AI",
    icon: Bot,
    desc: "An early prototype chatbot answering common DME admissions questions, built with a lightweight NLP pipeline.",
  },
];

export default function StudentProjects() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-white">Student Projects</h1>
        <p className="mb-8 text-slate-400">
          A sample of work produced by DME students. The Thailand Research Expo entry
          is real; the rest are placeholder entries pending real project media and links.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <FadeIn key={p.title} delay={0.08 * i}>
            <div className="h-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-dme-orange hover:shadow-lg hover:shadow-dme-orange/10">
              {p.image ? (
                <img src={p.image} alt={p.title} className="h-40 w-full object-cover object-top" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <p.icon className="h-12 w-12 text-dme-orange" strokeWidth={1.5} />
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block rounded-full bg-dme-orange/20 px-2 py-0.5 text-xs font-medium text-dme-orange">
                    {p.category}
                  </span>
                  {p.real && (
                    <span className="inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                      Real
                    </span>
                  )}
                </div>
                <h2 className="mb-1 font-semibold text-white">{p.title}</h2>
                <p className="text-sm text-slate-400">{p.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
