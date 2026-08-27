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

/** Classic upward slide-in with spring physics. */
export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

/** Slide in from the left — used for narrative text and timeline items. */
export const fadeLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

/** Slide in from the right — pairs with fadeLeft for converging layouts. */
export const fadeRight = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

/** Pop-in scale effect — punchy reveal for stat cards and badges. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 18 },
  },
};

/** Parent variant that staggers its children's reveal. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

/** Faster stagger for dense grids (skill chips, tech pills). */
export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.02 },
  },
};

/** Standard viewport config so reveals fire once, slightly before fully in view. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
