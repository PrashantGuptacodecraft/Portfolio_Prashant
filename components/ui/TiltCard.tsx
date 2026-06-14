"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/lib/hooks/useTilt";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  /** Max rotation in degrees. */
  max?: number;
  /** Adds a cursor-following sheen across the surface. */
  glare?: boolean;
  className?: string;
};

/**
 * Reusable perspective-tilt wrapper. Applies spring-smoothed rotateX/rotateY
 * based on cursor position and (optionally) a moving glare highlight.
 *
 * `transform-style: preserve-3d` is enabled so children can use translateZ for
 * layered parallax depth (used by the hero photo frame). Disabled gracefully on
 * touch / reduced-motion.
 */
export function TiltCard({ children, max = 10, glare = false, className }: TiltCardProps) {
  const t = useTilt(max);

  return (
    <motion.div
      ref={t.ref}
      onMouseMove={t.onMouseMove}
      onMouseLeave={t.onMouseLeave}
      style={{
        rotateX: t.enabled ? t.rotateX : 0,
        rotateY: t.enabled ? t.rotateY : 0,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
    >
      {children}
      {glare && t.enabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ background: t.glare }}
        />
      )}
    </motion.div>
  );
}
