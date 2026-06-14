"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { SkillChip } from "@/components/ui/SkillChip";
import { TiltCard } from "@/components/ui/TiltCard";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/utils";

const accentDot: Record<string, string> = {
  primary: "bg-primary shadow-glow-primary",
  secondary: "bg-secondary shadow-glow-secondary",
  accent: "bg-accent shadow-glow-accent",
};

/**
 * Skills grouped into categorized glass panels. Each chip carries a qualitative
 * proficiency band (Core / Proficient / Familiar) instead of fabricated %s.
 */
export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:py-32">
      <SectionHeading
        eyebrow="02 — Skills"
        title="The stack I build with"
        subtitle="From low-level DSA to full-stack apps and browser automation — grouped by where they live in the build."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-6 md:grid-cols-2"
      >
        {skillCategories.map((cat) => (
          <motion.div key={cat.title} variants={fadeUp}>
            <TiltCard max={4} className="rounded-2xl">
              <GlassCard className="glass-highlight p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${accentDot[cat.accent]}`} />
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {cat.title}
                  </h3>
                </div>
                <motion.div variants={staggerContainer} className="grid gap-3 sm:grid-cols-2">
                  {cat.skills.map((skill) => (
                    <SkillChip key={skill.name} skill={skill} />
                  ))}
                </motion.div>
              </GlassCard>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Proficiency legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-5 font-mono text-[11px] uppercase tracking-wider text-text-muted">
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-primary" /> Core</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-accent" /> Proficient</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-text-muted" /> Familiar</span>
      </div>
    </section>
  );
}
