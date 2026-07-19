import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function NewsCarousel({ items, intervalMs = 5000 }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const suppressClick = useRef(false);

  useEffect(() => {
    if (open || isDragging || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [open, isDragging, items.length, intervalMs]);

  const active = items[index];
  const goNext = () => setIndex((i) => (i + 1) % items.length);
  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  function handleDragEnd(e, info) {
    const threshold = 60;
    if (info.offset.x < -threshold) goNext();
    else if (info.offset.x > threshold) goPrev();
    setIsDragging(false);
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    }, 100);
  }

  return (
    <>
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-none">
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={`Expand: ${active.title}`}
          onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
          onClick={() => {
            if (!suppressClick.current) setOpen(true);
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="h-80 w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing sm:h-[28rem]"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active.image}
              src={active.image}
              alt={active.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              draggable={false}
              className="h-full w-full object-cover object-top"
            />
          </AnimatePresence>
        </motion.div>

        <div className="p-4 text-left sm:p-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-dme-orange">{active.tag}</span>
            {active.real && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                Real
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{active.title}</h3>
        </div>

        {items.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-4">
            {items.map((item, i) => (
              <button
                key={item.image}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-dme-orange" : "w-1.5 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        )}

        {items.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:scale-110 hover:bg-dme-orange hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goNext}
              aria-label="Next"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:scale-110 hover:bg-dme-orange hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900"
            >
              <div className="relative">
                <img src={active.image} alt={active.title} className="w-full object-cover object-top" />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-dme-orange">{active.tag}</span>
                  {active.real && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Real
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{active.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{active.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
