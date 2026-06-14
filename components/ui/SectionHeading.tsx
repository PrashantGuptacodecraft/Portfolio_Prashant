"use client";

import { motion } from "framer-motion";
import { viewportOnce } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small mono eyebrow label, e.g. "02 — Skills". */
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

// Reveal: fade + slight upward slide + scale-up.
const revealParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const revealChild = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * Consistent section header: mono eyebrow, gradient title with a neon-glow
 * duplicate behind it and a one-time shimmer sweep on entry, plus optional
 * subtitle. The title gradient also pans slowly and continuously.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={revealParent}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"}
    >
      <motion.p
        variants={revealChild}
        className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary"
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        variants={revealChild}
        data-cursor="text"
        className="relative font-display text-section-title font-bold"
      >
        {/* Neon-sign glow duplicate sitting behind the text. */}
        <span
          aria-hidden="true"
          className="text-gradient absolute inset-0 select-none blur-[18px] opacity-60"
        >
          {title}
        </span>
        {/* Foreground gradient title with a slow continuous shimmer. */}
        <span className="text-gradient animate-gradient-pan relative">
          {title}
        </span>
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={revealChild}
          className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
