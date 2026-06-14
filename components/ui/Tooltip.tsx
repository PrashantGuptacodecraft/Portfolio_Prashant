"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Lightweight hover/focus tooltip with a fade + slide-up animation.
 * Appears above the trigger; shown on both mouse hover and keyboard focus for
 * accessibility.
 */
export function Tooltip({ label, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={`relative inline-flex ${className ?? ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-surface-border bg-[#0a0f24] px-2.5 py-1 font-mono text-[11px] text-text-primary shadow-glass"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
