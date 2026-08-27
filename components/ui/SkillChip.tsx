"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import type { Skill } from "@/lib/data";
import { cn, fadeUp } from "@/lib/utils";

const levelStyles: Record<Skill["level"], string> = {
  Core: "text-primary border-primary/40",
  Proficient: "text-accent border-accent/40",
  Familiar: "text-text-muted border-surface-border",
};

/**
 * Animated skill pill with a spring-smoothed 3D tilt and hover glow.
 * The proficiency band is shown as a small mono tag rather than a fake %.
 */
export function SkillChip({ skill }: { skill: Skill }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 200, damping: 20 });
  const springRy = useSpring(ry, { stiffness: 200, damping: 20 });

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(-py * 12);
    ry.set(px * 12);
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div variants={fadeUp} style={{ perspective: 600 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: springRx, rotateY: springRy }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group flex items-center gap-3 rounded-xl border border-surface-border bg-white/[0.04] px-4 py-3 transition-[box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-glow-primary"
      >
        <span className="font-medium text-text-primary">{skill.name}</span>
        <span
          className={cn(
            "ml-auto rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            levelStyles[skill.level],
          )}
        >
          {skill.level}
        </span>
      </motion.div>
    </motion.div>
  );
}
