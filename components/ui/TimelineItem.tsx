"use client";

import { motion } from "framer-motion";
import type { TimelineEntry } from "@/lib/data";
import { fadeUp } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

const tagStyles: Record<TimelineEntry["tag"], string> = {
  work: "text-primary border-primary/40",
  ongoing: "text-accent border-accent/40",
  achievement: "text-primary border-primary/40",
  certification: "text-secondary border-secondary/40",
  event: "text-text-muted border-surface-border",
};

const tagLabels: Record<TimelineEntry["tag"], string> = {
  work: "Internship",
  ongoing: "Ongoing",
  achievement: "Achievement",
  certification: "Certification",
  event: "Event",
};

/**
 * A single node on the vertical glowing timeline.
 * The connector line + node dot live here; the parent supplies the rail layout.
 */
export function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <motion.li variants={fadeUp} className="relative pl-12">
      {/* Glowing node dot on the rail */}
      <span className="absolute left-[10px] top-2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-brand shadow-glow-primary ring-4 ring-background" />

      <GlassCard className="p-5" hoverLift>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            {entry.title}
          </h3>
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tagStyles[entry.tag]}`}
          >
            {tagLabels[entry.tag]}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-primary">{entry.meta}</p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          {entry.description}
        </p>
      </GlassCard>
    </motion.li>
  );
}
