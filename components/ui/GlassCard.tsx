"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLMotionProps<"div"> & {
  /** Adds the animated gradient border treatment. */
  bordered?: boolean;
  /** Adds a soft hover-lift micro-interaction. */
  hoverLift?: boolean;
};

/**
 * The foundational translucent panel used across the site.
 * Pure presentational wrapper around a motion.div so callers can still pass
 * animation props (initial / whileInView / variants).
 */
export function GlassCard({
  className,
  bordered = false,
  hoverLift = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass rounded-2xl shadow-glass",
        bordered && "gradient-border",
        hoverLift && "transition-transform duration-300 will-change-transform hover:-translate-y-1.5",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
