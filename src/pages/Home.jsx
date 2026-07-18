import FadeIn from "../components/FadeIn.jsx";
import NewsCarousel from "../components/NewsCarousel.jsx";

const newsItems = [
  {
    tag: "Award",
    title: "DME Students Win Bronze Medal — Thailand Research Expo 2024",
    image: "/projects/expo2024-bronze.jpg",
    real: true,
    description:
      "DME students won a Bronze Medal at the Higher Education Innovation Stage, Thailand Research Expo 2024 (มหกรรมงานวิจัยแห่งชาติ 2567).",
  },
  {
    tag: "Field Study",
    title: "DME Studio Visit — The Monk Studios, Igdrasil Group, Zurreal Studio",
    image: "/projects/studio-visit-2024.jpg",
    real: true,
    description:
      "March 7–9, 2024: 36 third-year DME students visited three digital media companies — The Monk Studios, Igdrasil Group, and Zurreal Studio — to build real-world industry experience alongside classroom learning.",
  },
  {
    tag: "Faculty Events",
    title: "Engineering Freshmen '63 — July 2026 Activity Calendar",
    image: "/news/july-events-2026.jpg",
    real: true,
    description:
      "This month's Faculty of Engineering student council calendar: Explore Your Path (Jul 4), EN Choir (Jul 6–9), Quest for Athlete orientation series (Jul 11–18), Wai Kru Day (Jul 23), and Sophomore's Day (Jul 25).",
  },
  {
    tag: "KKU News",
    title: "Thailand University Esports Championship 2026, hosted at KKU",
    image: "/news/esports-2026.jpg",
    real: true,
    description:
      "Khon Kaen University hosted the 1st Thailand University Esports Championship, 6–10 July 2026 — 3 games, 400+ players from universities nationwide. Not a DME-organized event, but held on campus.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(249,115,22,0.18),transparent_60%)]" />
        <FadeIn className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <h1 className="mb-4 bg-gradient-to-r from-[#f97316] to-[#8a2c2c] bg-clip-text pb-2 text-3xl font-extrabold leading-[1.15] tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Digital Media Engineering
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            An interactive guide to the Digital Media Engineering program at Khon Kaen
            University — curriculum, tuition, careers, and student work, all in one
            place, built for prospective and first-year students.
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
        <FadeIn>
          <h2 className="mb-4 text-center text-xl font-bold text-slate-900 dark:text-white">News & Activities</h2>
          <NewsCarousel items={newsItems} />
        </FadeIn>
      </section>
    </div>
  );
}
