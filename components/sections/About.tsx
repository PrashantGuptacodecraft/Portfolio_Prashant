"use client";

import { motion } from "framer-motion";
import { about, stats } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/utils";

/**
 * About: two-column layout — narrative on the left, animated stat cards on the
 * right. Stats reveal with a stagger as the section scrolls into view.
 */
export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:py-32">
      <SectionHeading
        eyebrow="01 — About"
        title="Building beyond the syllabus"
        align="left"
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Narrative */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-5"
        >
          {about.paragraphs.map((p) => (
            <motion.p
              key={p.slice(0, 24)}
              variants={fadeUp}
              className="text-base leading-relaxed text-text-muted sm:text-lg"
            >
              {p}
            </motion.p>
          ))}
        </motion.div>

        {/* Stat cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-4 self-start"
        >
          {stats.map((s) => (
            <GlassCard key={s.label} variants={fadeUp} bordered hoverLift className="conic-border glass-highlight p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
                {s.label}
              </p>
              <p className="mt-2 font-display text-xl font-bold text-text-primary">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-text-muted">{s.hint}</p>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
