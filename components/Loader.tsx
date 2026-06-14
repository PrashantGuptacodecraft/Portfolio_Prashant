"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const SESSION_KEY = "pg-portfolio-loaded";

/**
 * Boot screen: animates the "PG" initials assembling over a progress bar, then
 * reveals the page. Skipped on re-visits within the same session (sessionStorage)
 * and shortened/instant under reduced-motion.
 */
export function Loader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SESSION_KEY);

    if (seen || reduced) {
      setDone(true);
      return;
    }

    // Animate a faux progress bar to 100% in ~1.2s, then dismiss.
    const start = performance.now();
    const duration = 1200;
    let raf = 0;

    const step = (now: number) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(step);
      } else {
        sessionStorage.setItem(SESSION_KEY, "1");
        setTimeout(() => setDone(true), 250);
      }
    };
    raf = requestAnimationFrame(step);

    // Allow skipping with any key / click.
    const skip = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setDone(true);
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Initials assembling */}
          <div className="relative mb-8 flex items-center font-display text-7xl font-bold">
            <motion.span
              initial={{ x: -40, opacity: 0, rotate: -20 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-gradient"
            >
              {profile.initials[0]}
            </motion.span>
            <motion.span
              initial={{ x: 40, opacity: 0, rotate: 20 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-text-primary"
            >
              {profile.initials[1]}
            </motion.span>
            {/* Orbiting glow dot */}
            <span className="absolute -inset-6 -z-10 rounded-full bg-gradient-radial-glow blur-md" />
          </div>

          {/* Progress bar */}
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-brand"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
            Initializing
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
