import { Landmark, Mail, MapPin, Phone, Link2, Navigation } from "lucide-react";
import FadeIn from "../components/FadeIn.jsx";

// Phiawijit Building, Faculty of Engineering, KKU — the CDLC is on floor 2.
// Taken from the !3d/!4d pair in the resolved maps.app.goo.gl link, which is the
// marker position rather than the viewport centre the /@lat,lng segment gives.
const CDLC = { lat: 16.4722497, lng: 102.8235039 };

// The keyless embed. Google's Maps Embed API needs a billing-enabled key; this
// older ?output=embed form does not, which keeps the page on the free tier.
const MAP_EMBED = `https://maps.google.com/maps?q=${CDLC.lat},${CDLC.lng}&z=17&hl=en&output=embed`;

// Omitting `origin` makes Google route from wherever the user is — which is the
// point of the button. Their location is resolved by Google on their own device;
// nothing about it reaches this site.
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${CDLC.lat},${CDLC.lng}`;

// The place page, for anyone who wants photos and opening hours rather than a route.
const MAP_PLACE = "https://maps.app.goo.gl/wcvcusCcbYPBwi28A";

const channels = [
  { label: "Faculty", value: "Faculty of Engineering, Khon Kaen University", icon: Landmark },
  {
    label: "Address",
    value: "123 Mittraphap Road, Nai Muang Sub-district, Muang District, Khon Kaen 40002, Thailand",
    icon: MapPin,
  },
  { label: "Faculty Phone", value: "+66 (0) 4300 9700 ext. 50215 or 45641", icon: Phone, href: "tel:+6643009700" },
  { label: "International Affairs Division", value: "+66 (0) 4320 2059", icon: Phone, href: "tel:+6643202059" },
  { label: "Email", value: "enforeign@kku.ac.th", icon: Mail, href: "mailto:enforeign@kku.ac.th" },
  { label: "Facebook", value: "facebook.com/EngineeringKKU", icon: Link2, href: "https://facebook.com/EngineeringKKU" },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <FadeIn>
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Contact</h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Questions about the DME program, admissions, or registration? Reach out through
          any of the channels below.
        </p>
      </FadeIn>

      <div className="space-y-4">
        {channels.map((c, i) => {
          const content = (
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-dme-orange dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none">
              <c.icon className="h-6 w-6 shrink-0 text-dme-orange" strokeWidth={1.5} />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.label}</p>
                <p className="text-slate-900 dark:text-white">{c.value}</p>
              </div>
            </div>
          );
          return (
            <FadeIn key={c.label} delay={0.06 * i}>
              {c.href ? (
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
                  {content}
                </a>
              ) : (
                content
              )}
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.4} className="mt-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Find us</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                CDLC — Creative Digital Learning Center, 2nd floor, Phiawijit Building
              </p>
            </div>
            <a
              href={MAP_DIRECTIONS}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-dme-orange px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
            >
              <Navigation className="h-4 w-4" />
              Go to Google Maps
            </a>
          </div>

          <iframe
            title="CDLC location on Google Maps"
            src={MAP_EMBED}
            className="h-64 w-full border-0 sm:h-80"
            /* Third-party frame below the fold on most screens — no reason to
               block first paint on it. */
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
            The button opens directions from your current location.{" "}
            <a href={MAP_PLACE} target="_blank" rel="noreferrer" className="text-dme-orange hover:underline">
              Open the place page
            </a>{" "}
            for photos and opening hours.
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
