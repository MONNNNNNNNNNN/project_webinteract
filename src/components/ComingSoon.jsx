export default function ComingSoon({ title, reason, children }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="mb-4 inline-block rounded-full bg-slate-800 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-dme-orange">
        Coming soon
      </div>
      <h1 className="mb-4 text-3xl font-bold text-white">{title}</h1>
      {reason && <p className="text-slate-400">{reason}</p>}
      {children}
    </div>
  );
}
