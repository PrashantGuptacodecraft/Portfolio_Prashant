"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

type MagneticProps = {
  children: React.ReactNode;
  /** 0..1 — how strongly the element tracks the cursor. */
  strength?: number;
  className?: string;
};

/**
 * Thin wrapper that gives any inline content a magnetic hover pull.
 * Renders a motion.span (inline-block) so it can wrap buttons, links and icons
 * without disturbing layout. Falls back to a plain span on touch/reduced-motion.
 */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const { ref, style, onMouseMove, onMouseLeave } = useMagnetic<HTMLSpanElement>(strength);

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
