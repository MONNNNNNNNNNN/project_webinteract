// One icon vocabulary for the whole site.
//
// The pages were reading as walls of text: every fee row, credit category and
// job listing looked identical until you read it. An icon gives each row a
// shape you can find again without re-reading, which is the actual problem —
// not decoration.
//
// Everything lives here rather than per page so a subject looks the same
// wherever it turns up. "AI" is the same purple brain on the Curriculum tracks
// and on a job card; if that drifts, the icons stop being a language and go
// back to being decoration.
//
// Frontend only — these are React components, so this belongs in src/lib and
// not in shared/.

import {
  Banknote,
  BedDouble,
  BookOpen,
  Box,
  Brain,
  Briefcase,
  Building2,
  Clapperboard,
  ClipboardCheck,
  Code2,
  Cpu,
  Gamepad2,
  Globe2,
  GraduationCap,
  HeartPulse,
  Layers,
  Ruler,
  Sparkles,
  Utensils,
  Waves,
  Wrench,
} from "lucide-react";

/**
 * Percentage width for a bar, as a CSS string.
 *
 * Clamped because an out-of-range value does not degrade gracefully: a negative
 * percentage is an invalid declaration, so the browser drops it and the bar
 * falls back to `width: auto` — the full track. A year whose credits went
 * negative through an admin typo would render as a *completed* year rather than
 * as a short bar. Verified in Chrome: `width: -25%` measured 400px in a 400px
 * track.
 */
export function barWidth(value, total) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return "0%";
  return `${Math.min(100, Math.max(0, (value / total) * 100))}%`;
}

/** The four major-elective tracks. Colors match the chips already on the page. */
export const TRACK_ICONS = {
  AI: Brain,
  "Digital Media": Clapperboard,
  Interactive: Gamepad2,
  Software: Code2,
};

/**
 * Credit-breakdown categories. The tints deliberately reuse the Course Map
 * legend already used for the course-type chips, so the icon and the chip say
 * the same thing in the same color.
 */
export const CREDIT_CATEGORY_ICONS = {
  "General Education": { Icon: BookOpen, tint: "text-yellow-600 dark:text-yellow-400" },
  "Basic Engineering": { Icon: Ruler, tint: "text-rose-600 dark:text-rose-400" },
  "Core Engineering": { Icon: Cpu, tint: "text-emerald-600 dark:text-emerald-400" },
  "Elective Engineering": { Icon: Layers, tint: "text-fuchsia-600 dark:text-fuchsia-400" },
  "Field Experience": { Icon: Briefcase, tint: "text-orange-600 dark:text-orange-400" },
  "Free Elective": { Icon: Sparkles, tint: "text-cyan-600 dark:text-cyan-400" },
};

/** Career Explorer's four interest filters. */
export const INTEREST_ICONS = {
  "3D & Animation": Box,
  "Game Dev": Gamepad2,
  "AI & Data": Brain,
  Software: Code2,
};

/** Tuition student types. */
export const STUDENT_TYPE_ICONS = {
  thai: GraduationCap,
  mekong: Waves,
  international: Globe2,
};

// Fee rows are free text an admin can rename ("Tuition Fee (8 semesters)",
// "Accommodation (~40 months)"), so match on a keyword rather than the exact
// string. Order matters: the first hit wins.
const FEE_KEYWORDS = [
  [/tuition/i, GraduationCap],
  [/summer|training/i, Wrench],
  [/enrol|enroll|registration/i, ClipboardCheck],
  [/accommodation|dorm|housing|rent/i, BedDouble],
  [/insurance|health|medical/i, HeartPulse],
  [/living|food|meal/i, Utensils],
];

/** Icon for a fee row. Unknown items get a generic banknote, never nothing. */
export function feeIcon(item) {
  const hit = FEE_KEYWORDS.find(([re]) => re.test(item || ""));
  return hit ? hit[1] : Banknote;
}

// Six tints, picked to stay legible on both themes and to sit apart from the
// dme-orange the page already uses for its own accents.
const AVATAR_TINTS = [
  "bg-orange-500/15 text-orange-600 dark:text-orange-300",
  "bg-purple-500/15 text-purple-600 dark:text-purple-300",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  "bg-pink-500/15 text-pink-600 dark:text-pink-300",
  "bg-amber-500/15 text-amber-700 dark:text-amber-300",
];

/**
 * A stable tile for a company that has no logo.
 *
 * The color is derived from the name, not from the list position: a job board
 * reshuffles on every filter change and a card that changes color when it moves
 * reads as a different company. Same name in, same tile out, always.
 */
export function companyAvatar(name) {
  const clean = (name || "").trim();
  if (!clean) return { initials: "", tint: AVATAR_TINTS[0], Fallback: Building2 };

  // Take the first *letter* of each word, not the first character: company
  // names arrive with brackets and punctuation attached ("Buono (Thailand)
  // Public Company Limited"), and the naive version rendered that as "B(".
  const initials = clean
    .split(/[\s\-—/]+/)
    .map((w) => w.match(/[\p{L}\p{N}]/u)?.[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  let hash = 0;
  for (const ch of clean) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;

  return {
    initials,
    tint: AVATAR_TINTS[hash % AVATAR_TINTS.length],
    Fallback: Building2,
  };
}
