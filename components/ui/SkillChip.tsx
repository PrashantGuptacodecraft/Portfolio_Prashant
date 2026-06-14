"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { Skill } from "@/lib/data";
import { cn, fadeUp } from "@/lib/utils";

const levelStyles: Record<Skill["level"], string> = {
  Core: "text-primary border-primary/40",
  Proficient: "text-accent border-accent/40",
  Familiar: "text-text-muted border-surface-border",
};

/**
 * Animated skill pill with a subtle pointer-reactive 3D tilt and hover glow.
 * The proficiency band is shown as a small mono tag rather than a fake %.
 */
export function SkillChip({ skill }: { skill: Skill }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 12, ry: px * 12 });
  }

  return (
    <motion.div variants={fadeUp} style={{ perspective: 600 }}>
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        className="glass group flex items-center gap-3 rounded-xl px-4 py-3 transition-[box-shadow,border-color] duration-300 will-change-transform hover:border-primary/40 hover:shadow-glow-primary"
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
      </div>
    </motion.div>
  );
}
