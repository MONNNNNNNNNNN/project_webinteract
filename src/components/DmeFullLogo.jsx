import DmeLogo from "./DmeLogo.jsx";

export default function DmeFullLogo({ iconClassName = "h-16 w-16", textClassName = "text-xl" }) {
  return (
    <div className="flex items-center gap-3">
      <DmeLogo className={iconClassName} />
      <div className={`font-extrabold leading-tight tracking-tight ${textClassName}`}>
        <p style={{ color: "#8a2c2c" }}>DIGITAL MEDIA</p>
        <p style={{ color: "#f97316" }}>ENGINEERING</p>
      </div>
    </div>
  );
}
