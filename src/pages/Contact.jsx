export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">Contact</h1>
      <p className="mb-8 text-slate-400">
        Questions about the DME program? Reach out through any of the channels below.
      </p>

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm text-slate-400">Faculty</p>
          <p className="text-white">Faculty of Engineering, Khon Kaen University</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm text-slate-400">Email</p>
          <p className="text-white">dme-info@kku.ac.th</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
          <p className="text-sm text-slate-400">Address</p>
          <p className="text-white">123 Mittraphap Rd, Khon Kaen 40002, Thailand</p>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-500">
        Placeholder contact details — replace with real program contacts.
      </p>
    </div>
  );
}
