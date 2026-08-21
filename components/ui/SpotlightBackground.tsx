"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useMousePosition } from "@/lib/hooks/useMousePosition";
import { usePointerFine } from "@/lib/hooks/usePointerFine";

/**
 * Global ambient background layered behind ALL page content (fixed, z-behind).
 *
 *  - A large, soft radial "spotlight" follows the cursor. CRUCIALLY it's a
 *    STATIC gradient layer moved with GPU `transform: translate` (composited),
 *    not an animated `background` string — so it never triggers a full-viewport
 *    repaint and stays cheap.
 *  - Three slow-drifting aurora blobs (keyframe loops) that also shift a few px
 *    toward the cursor for subtle parallax (transforms only).
 *
 * On touch / reduced-motion (usePointerFine === false) the spotlight is dropped
 * and only the gentle CSS blob drift remains.
 */
export function SpotlightBackground() {
  const enabled = usePointerFine();
  const { x, y, nx, ny } = useMousePosition();

  // Spotlight follows the raw cursor px with spring lag (translate, not repaint).
  // Stiffness raised 60→80 so the spring settles faster = fewer mid-frames to composite.
  const spotX = useSpring(x, { stiffness: 80, damping: 20, mass: 0.6 });
  const spotY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.6 });

  // Small parallax offsets (max ~16px) for the blobs, spring-smoothed.
  const px = useSpring(useTransform(nx, [0, 1], [-16, 16]), { stiffness: 50, damping: 18 });
  const py = useSpring(useTransform(ny, [0, 1], [-16, 16]), { stiffness: 50, damping: 18 });
  const pxInv = useTransform(px, (v) => -v);
  const pyInv = useTransform(py, (v) => -v);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Cursor spotlight: a fixed-size, pre-rendered radial layer translated to
          the cursor. Negative margins centre it on its own transform origin. */}
      {enabled && (
        <motion.div
          style={{ x: spotX, y: spotY }}
          className="absolute left-0 top-0 -ml-[32rem] -mt-[32rem] h-[64rem] w-[64rem] rounded-full will-change-transform"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(0,245,255,0.10),rgba(123,97,255,0.05)_35%,transparent_60%)]" />
        </motion.div>
      )}

      {/* Drifting aurora blobs with subtle parallax.
          blur radius reduced 130-140px → 80-90px for GPU compositor perf. */}
      <motion.div
        className="absolute -left-32 top-[-12%] h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-[80px] animate-blob-drift will-change-transform"
        style={enabled ? { x: px, y: py } : undefined}
      />
      <motion.div
        className="absolute right-[-12%] top-1/3 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-[90px] animate-blob-drift [animation-delay:-7s] will-change-transform"
        style={enabled ? { x: pxInv, y: py } : undefined}
      />
      <motion.div
        className="absolute bottom-[-15%] left-1/3 h-[24rem] w-[24rem] rounded-full bg-accent/15 blur-[90px] animate-blob-drift [animation-delay:-13s] will-change-transform"
        style={enabled ? { x: px, y: pyInv } : undefined}
      />
    </div>
  );
}
