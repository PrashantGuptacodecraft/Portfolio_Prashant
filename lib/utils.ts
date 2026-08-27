/** Tiny class-name joiner — keeps conditional Tailwind classes readable. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shared Framer Motion variants for scroll-triggered reveals.
 * Importing these keeps motion consistent across every section.
 *
 * All variants use spring physics for a natural, alive feel
 * with a slight overshoot that settles gracefully.
 */

/** Classic upward slide-in, fast and lightweight. */
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** Slide in from the left — used for narrative text and timeline items. */
export const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** Slide in from the right — pairs with fadeLeft for converging layouts. */
export const fadeRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** Pop-in scale effect — punchy reveal for stat cards and badges. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/** Parent variant that staggers its children's reveal. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0 },
  },
};

/** Faster stagger for dense grids (skill chips, tech pills). */
export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.02, delayChildren: 0 },
  },
};

/** 
 * Trigger reveals 200px BEFORE they enter the viewport.
 * This guarantees elements are already visible by the time the user scrolls
 * to them, completely eliminating the "invisible lag" on fast mobile scrolling.
 */
export const viewportOnce = { once: true, amount: 0, margin: "200px" } as const;
