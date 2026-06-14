"use client";

import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "./usePointerFine";

/**
 * Magnetic hover hook: pulls an element toward the cursor while hovered, then
 * springs back to rest on leave. No-op on touch / reduced-motion.
 *
 * Usage:
 *   const { ref, style, onMouseMove, onMouseLeave } = useMagnetic();
 *   <motion.a ref={ref} style={style} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.35) {
  const enabled = usePointerFine();
  const ref = useRef<T>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.3 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // Offset from the element centre, scaled by strength.
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, style: { x: sx, y: sy }, onMouseMove, onMouseLeave, enabled };
}
