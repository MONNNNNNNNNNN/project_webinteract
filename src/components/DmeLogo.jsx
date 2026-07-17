export default function DmeLogo({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke="#8a2c2c"
        strokeWidth="9"
        strokeDasharray="7.5 5"
      />
      <circle cx="32" cy="32" r="16" fill="#8a2c2c" />
      <circle cx="32" cy="32" r="7" fill="#f97316" />
      <g stroke="#fdf2e9" strokeWidth="1.6" strokeLinecap="round">
        <line x1="32" y1="25" x2="32" y2="19" />
        <line x1="32" y1="39" x2="32" y2="45" />
        <line x1="25" y1="32" x2="19" y2="32" />
        <line x1="39" y1="32" x2="45" y2="32" />
      </g>
      <circle cx="32" cy="19" r="2.2" fill="#fdf2e9" />
      <circle cx="32" cy="45" r="2.2" fill="#fdf2e9" />
      <circle cx="19" cy="32" r="2.2" fill="#fdf2e9" />
      <circle cx="45" cy="32" r="2.2" fill="#fdf2e9" />
    </svg>
  );
}
