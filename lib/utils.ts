/** Tiny class-name joiner — keeps conditional Tailwind classes readable. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shared Framer Motion variants for scroll-triggered reveals.
 * Importing these keeps motion consistent across every section.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Parent variant that staggers its children's reveal. */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/** Standard viewport config so reveals fire once, slightly before fully in view. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
