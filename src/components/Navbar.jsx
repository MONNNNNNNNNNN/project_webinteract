import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import DmeLogo from "./DmeLogo.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/tuition", label: "Tuition & Fees" },
  { to: "/careers", label: "Career Explorer" },
  { to: "/projects", label: "Student Projects" },
  { to: "/3d-world", label: "3D World" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-dme-navy/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-lg font-bold text-white"
        >
          <DmeLogo className="h-8 w-8 text-dme-orange" />
          DME <span className="text-dme-orange">Explorer</span>
        </NavLink>

        <ul className="hidden flex-wrap items-center gap-1 text-sm md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative z-10 block rounded px-3 py-2 transition-colors ${
                    isActive ? "text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 -mx-3 -my-2 rounded bg-dme-orange px-3 py-2"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                      />
                    )}
                    {link.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-800 px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2 text-sm">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 transition-colors ${
                      isActive ? "bg-dme-orange text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
