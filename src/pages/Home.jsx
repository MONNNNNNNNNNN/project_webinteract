import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/curriculum", title: "Curriculum Roadmap", desc: "See the full 4-year study plan and elective tracks." },
  { to: "/tuition", title: "Tuition & Fees", desc: "Calculate costs by student type and payment period." },
  { to: "/careers", title: "Career Explorer", desc: "Browse job openings in DME-related fields." },
  { to: "/projects", title: "Student Projects", desc: "See what DME students have built." },
  { to: "/3d-world", title: "3D World", desc: "Walk through the CDLC facility in 3D." },
  { to: "/about", title: "About DME", desc: "What the program is and who it's for." },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
          DME <span className="text-dme-orange">Explorer</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
          An interactive guide to the Digital Media Engineering program at Khon Kaen
          University — curriculum, tuition, careers, and student work, all in one
          place, built for prospective and first-year students.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/curriculum"
            className="rounded-lg bg-dme-orange px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Explore the Curriculum
          </Link>
          <Link
            to="/tuition"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Check Tuition & Fees
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-dme-orange hover:bg-slate-900"
            >
              <h2 className="mb-1 font-semibold text-white">{link.title}</h2>
              <p className="text-sm text-slate-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
