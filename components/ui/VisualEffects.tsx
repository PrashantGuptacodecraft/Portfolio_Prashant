"use client";

import dynamic from "next/dynamic";

/*
 * Heavy visual effects lazy-loaded with ssr:false so they don't block
 * the initial render or bloat the critical JS bundle.
 *
 * FluidCursor       — 37KB WebGL Navier-Stokes fluid simulation
 * SpotlightBackground — spring-smoothed cursor spotlight + aurora parallax
 * CustomCursor      — spring-smoothed dot/ring cursor replacement
 *
 * Wrapped in a client component because `ssr: false` is not allowed
 * in Server Components (Next.js App Router restriction).
 */
const FluidCursor = dynamic(
  () => import("@/components/effects/FluidCursor").then((m) => m.FluidCursor),
  { ssr: false },
);
const SpotlightBackground = dynamic(
  () => import("@/components/ui/SpotlightBackground").then((m) => m.SpotlightBackground),
  { ssr: false },
);
const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

import { useLowPowerMode } from "@/lib/hooks/useLowPowerMode";

/**
 * Client-side visual effects shell. These are purely decorative — no content
 * that crawlers need. They load after the page is interactive.
 */
export function VisualEffects() {
  const [lowPower] = useLowPowerMode();

  if (lowPower) return null;

  return (
    <>
      <SpotlightBackground />
      <FluidCursor />
      <CustomCursor />
    </>
  );
}
