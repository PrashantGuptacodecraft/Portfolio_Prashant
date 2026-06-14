"use client";

import { cn } from "@/lib/utils";

const tints = {
  cyan: "rgba(0,245,255,0.07)",
  violet: "rgba(123,97,255,0.09)",
  mint: "rgba(0,255,179,0.06)",
} as const;

/**
 * Subtle, fixed-position radial wash that gives each section its own colour
 * lean (cyan / violet / mint) for visual rhythm as the user scrolls. Decorative
 * only; sits behind the section's content.
 */
export function SectionTint({
  color,
  position = "top",
  className,
}: {
  color: keyof typeof tints;
  position?: "top" | "bottom";
  className?: string;
}) {
  const pos = position === "top" ? "20% -10%" : "80% 110%";
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        background: `radial-gradient(50rem 40rem at ${pos}, ${tints[color]}, transparent 60%)`,
      }}
    />
  );
}
