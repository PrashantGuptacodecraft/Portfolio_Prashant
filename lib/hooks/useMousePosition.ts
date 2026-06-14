"use client";

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export type MousePosition = {
  /** Raw viewport coordinates (px). */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Normalised 0..1 position across the viewport, handy for parallax. */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
};

/**
 * Global mouse position as Framer MotionValues, updated on a single
 * requestAnimationFrame tick per frame (mousemove is coalesced) so multiple
 * consumers share one cheap listener.
 */
export function useMousePosition(): MousePosition {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const nx = useMotionValue(0.5);
  const ny = useMotionValue(0.5);

  useEffect(() => {
    let raf = 0;
    let lx = 0;
    let ly = 0;

    const flush = () => {
      x.set(lx);
      y.set(ly);
      nx.set(lx / window.innerWidth);
      ny.set(ly / window.innerHeight);
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      lx = e.clientX;
      ly = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y, nx, ny]);

  return { x, y, nx, ny };
}
