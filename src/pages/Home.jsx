import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Map, Wallet, Briefcase, Palette, Box, Sparkles } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";

const MotionLink = motion(Link);

const quickLinks = [
  { to: "/curriculum", title: "Curriculum Roadmap", desc: "See the full 4-year study plan and elective tracks.", icon: Map },
  { to: "/tuition", title: "Tuition & Fees", desc: "Calculate costs by student type and payment period.", icon: Wallet },
  { to: "/careers", title: "Career Explorer", desc: "Browse job openings in DME-related fields.", icon: Briefcase },
  { to: "/projects", title: "Student Projects", desc: "See what DME students have built.", icon: Palette },
  { to: "/3d-world", title: "3D World", desc: "Walk through the CDLC facility in 3D.", icon: Box },
  { to: "/about", title: "About DME", desc: "What the program is and who it's for.", icon: Sparkles },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(249,115,22,0.18),transparent_60%)]" />
        <FadeIn className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-[#f97316] to-[#8a2c2c] bg-clip-text pb-2 text-4xl font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-6xl">
            Digital Media Engineering
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            An interactive guide to the Digital Media Engineering program at Khon Kaen
            University — curriculum, tuition, careers, and student work, all in one
            place, built for prospective and first-year students.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <MotionLink
              whileTap={{ scale: 0.96 }}
              to="/curriculum"
              className="rounded-lg bg-dme-orange px-6 py-3 font-semibold text-white shadow-lg shadow-dme-orange/20 transition hover:scale-[1.03] hover:brightness-110"
            >
              Explore the Curriculum
            </MotionLink>
            <MotionLink
              whileTap={{ scale: 0.96 }}
              to="/tuition"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:scale-[1.03] hover:bg-slate-800"
            >
              Check Tuition & Fees
            </MotionLink>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link, i) => (
            <FadeIn key={link.to} delay={0.05 * i}>
              <MotionLink
                whileTap={{ scale: 0.97 }}
                to={link.to}
                className="block h-full rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-dme-orange hover:bg-slate-900 hover:shadow-lg hover:shadow-dme-orange/10"
              >
                <link.icon className="mb-2 h-6 w-6 text-dme-orange" />
                <h2 className="mb-1 font-semibold text-white">{link.title}</h2>
                <p className="text-sm text-slate-400">{link.desc}</p>
              </MotionLink>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
