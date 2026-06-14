"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Slim gradient progress bar pinned to the very top of the viewport that fills
 * as the user scrolls the page. Spring-smoothed for a fluid feel.
 * Purely decorative (aria-hidden) — scrolling itself conveys the state.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-primary via-secondary to-accent shadow-glow-primary"
    />
  );
}
