import { NavLink } from "react-router-dom";

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
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-dme-navy/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-lg font-bold text-white">
          DME <span className="text-dme-orange">Explorer</span>
        </NavLink>
        <ul className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-dme-orange text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
