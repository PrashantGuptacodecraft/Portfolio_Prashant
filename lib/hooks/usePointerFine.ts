"use client";

import { useEffect, useState } from "react";

/**
 * Detects whether rich pointer interactions (custom cursor, tilt, magnetic,
 * parallax) should run at all.
 *
 * Returns false when:
 *  - the primary input is coarse / touch (no precise pointer), or
 *  - the user prefers reduced motion.
 *
 * Components use this to fall back to a clean static experience. The value is
 * resolved after mount (SSR-safe) and updates live if the media queries change.
 */
export function usePointerFine(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();

    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
