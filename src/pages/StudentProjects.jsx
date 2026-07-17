const projects = [
  {
    title: "Interactive Album Story",
    category: "Digital Media",
    desc: "A 3D animated short combining character rigging and real-time rendering, produced as a Digital Media Studio capstone.",
  },
  {
    title: "Campus Quest",
    category: "Interactive",
    desc: "A game-dev orientation project that turns the KKU campus into an explorable 2D game for incoming freshmen.",
  },
  {
    title: "DME FAQ Assistant",
    category: "Software / AI",
    desc: "An early prototype chatbot answering common DME admissions questions, built with a lightweight NLP pipeline.",
  },
];

export default function StudentProjects() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">Student Projects</h1>
      <p className="mb-8 text-slate-400">
        A sample of work produced by DME students. Placeholder entries — swap in
        real project media and links.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.title} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="flex h-40 items-center justify-center bg-slate-800 text-slate-500">
              Project image placeholder
            </div>
            <div className="p-4">
              <span className="mb-2 inline-block rounded-full bg-dme-orange/20 px-2 py-0.5 text-xs font-medium text-dme-orange">
                {p.category}
              </span>
              <h2 className="mb-1 font-semibold text-white">{p.title}</h2>
              <p className="text-sm text-slate-400">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
