"use client";

import { cn } from "@/lib/utils";

/**
 * Decorative floating gradient orbs (auroras) used behind sections.
 * Pure CSS animation (blob-drift / float) so it's cheap and respects
 * reduced-motion via the global media query in globals.css.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* blur halved on mobile, will-change-transform promotes to own GPU layer */}
      <div className="absolute -left-24 top-[-10%] h-72 w-72 rounded-full bg-secondary/30 blur-[35px] md:blur-[70px] animate-blob-drift max-md:animate-none will-change-transform" />
      <div className="absolute right-[-6%] top-1/4 h-80 w-80 rounded-full bg-primary/25 blur-[40px] md:blur-[80px] animate-blob-drift max-md:animate-none [animation-delay:-6s] will-change-transform" />
      <div className="absolute bottom-[-10%] left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-[40px] md:blur-[80px] animate-blob-drift max-md:animate-none [animation-delay:-12s] will-change-transform" />
    </div>
  );
}
