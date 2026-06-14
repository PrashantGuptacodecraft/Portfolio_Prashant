"use client";

import { useRef } from "react";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { usePointerFine } from "./usePointerFine";

export type TiltState = {
  ref: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** Background string for a cursor-following glare highlight. */
  glare: MotionValue<string>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  enabled: boolean;
};

/**
 * Perspective tilt hook. Tracks the cursor's position within the element and
 * maps it to spring-smoothed rotateX/rotateY, plus a glare gradient that moves
 * with the cursor. No-op on touch / reduced-motion (rotations stay at 0).
 */
export function useTilt(max = 10): TiltState {
  const enabled = usePointerFine();
  const ref = useRef<HTMLDivElement>(null);

  // Normalised pointer position within the card (0..1), centred at rest.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  const glare = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,255,255,0.16), transparent 45%)`,
  );

  const onMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return { ref, rotateX, rotateY, glare, onMouseMove, onMouseLeave, enabled };
}
