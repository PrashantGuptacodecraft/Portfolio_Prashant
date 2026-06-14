"use client";

import { motion } from "framer-motion";
import { timeline } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { SectionTint } from "@/components/ui/SectionTint";
import { staggerContainer, viewportOnce } from "@/lib/utils";

/**
 * Experience & achievements rendered as a vertical timeline with a glowing
 * gradient connector rail behind the nodes.
 */
export function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-4xl scroll-mt-20 px-5 py-24 sm:py-32">
      <SectionTint color="mint" position="bottom" />
      <SectionHeading
        eyebrow="04 — Experience"
        title="Milestones & credentials"
        subtitle="A snapshot of what I've achieved while studying and building."
      />

      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative mt-14 space-y-6"
      >
        {/* Glowing connector rail */}
        <span
          aria-hidden="true"
          className="absolute left-[10px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary via-secondary to-accent opacity-60"
        />
        {timeline.map((entry) => (
          <TimelineItem key={entry.title} entry={entry} />
        ))}
      </motion.ol>
    </section>
  );
}
