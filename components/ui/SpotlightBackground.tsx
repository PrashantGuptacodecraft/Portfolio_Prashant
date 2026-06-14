"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useMousePosition } from "@/lib/hooks/useMousePosition";
import { usePointerFine } from "@/lib/hooks/usePointerFine";

/**
 * Global ambient background layered behind ALL page content (fixed, z-behind).
 *
 *  - A large, soft radial "spotlight" follows the cursor with spring lag — low
 *    opacity + huge blur so it reads as ambient light, not a flashlight.
 *  - Three slow-drifting aurora blobs (keyframe loops) that also shift a few px
 *    toward the cursor for subtle parallax.
 *
 * On touch / reduced-motion (usePointerFine === false) the spotlight is dropped
 * and only the gentle CSS blob drift remains — a calm, static-feeling fallback.
 */
export function SpotlightBackground() {
  const enabled = usePointerFine();
  const { nx, ny } = useMousePosition();

  // Spotlight position, spring-smoothed for ambient lag.
  const spotX = useSpring(useTransform(nx, (v) => v * 100), { stiffness: 50, damping: 20 });
  const spotY = useSpring(useTransform(ny, (v) => v * 100), { stiffness: 50, damping: 20 });
  const spotBg = useTransform(
    [spotX, spotY],
    ([x, y]) =>
      `radial-gradient(45rem 45rem at ${x}% ${y}%, rgba(0,245,255,0.10), rgba(123,97,255,0.05) 35%, transparent 60%)`,
  );

  // Small parallax offsets (max ~16px) for the blobs, spring-smoothed.
  const px = useSpring(useTransform(nx, [0, 1], [-16, 16]), { stiffness: 40, damping: 18 });
  const py = useSpring(useTransform(ny, [0, 1], [-16, 16]), { stiffness: 40, damping: 18 });
  const pxInv = useTransform(px, (v) => -v);
  const pyInv = useTransform(py, (v) => -v);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Cursor spotlight (desktop + motion only). */}
      {enabled && <motion.div className="absolute inset-0" style={{ background: spotBg }} />}

      {/* Drifting aurora blobs with subtle parallax. */}
      <motion.div
        className="absolute -left-32 top-[-12%] h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-[130px] animate-blob-drift"
        style={enabled ? { x: px, y: py } : undefined}
      />
      <motion.div
        className="absolute right-[-12%] top-1/3 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-[140px] animate-blob-drift [animation-delay:-7s]"
        style={enabled ? { x: pxInv, y: py } : undefined}
      />
      <motion.div
        className="absolute bottom-[-15%] left-1/3 h-[24rem] w-[24rem] rounded-full bg-accent/15 blur-[140px] animate-blob-drift [animation-delay:-13s]"
        style={enabled ? { x: px, y: pyInv } : undefined}
      />
    </div>
  );
}
