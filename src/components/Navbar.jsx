import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import DmeLogo from "./DmeLogo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/curriculum", label: "Curriculum" },
  { to: "/tuition", label: "Tuition & Fees" },
  { to: "/careers", label: "Career Explorer" },
  { to: "/projects", label: "Projects & Competition" },
  { to: "/3d-world", label: "3D World" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-dme-navy/95">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"
        >
          <DmeLogo className="h-8 w-8" />
          DME <span className="text-dme-orange">Explorer</span>
        </NavLink>

        <ul className="hidden flex-wrap items-center gap-1 text-sm lg:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `relative z-10 block whitespace-nowrap rounded px-3 py-2 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-200 dark:border-slate-800 lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 pb-4 pt-2 text-sm">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-dme-orange text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
