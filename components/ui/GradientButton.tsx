"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useMagnetic } from "@/lib/hooks/useMagnetic";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline";

/**
 * Props are built on Framer Motion's own element prop types (HTMLMotionProps)
 * rather than React's native attribute types, so spreading them onto
 * motion.button / motion.a doesn't collide on overlapping handlers like
 * onAnimationStart / onDrag.
 */
type ButtonProps = { as?: "button"; variant?: Variant } & HTMLMotionProps<"button">;
type AnchorProps = { as: "a"; variant?: Variant } & HTMLMotionProps<"a">;
type GradientButtonProps = ButtonProps | AnchorProps;

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-[box-shadow,filter,border-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  solid:
    "bg-gradient-brand text-background shadow-glow-primary hover:shadow-[0_0_36px_rgba(0,245,255,0.6)] hover:brightness-110",
  outline:
    "glass text-text-primary hover:border-primary/50 hover:text-primary hover:shadow-glow-primary",
};

/**
 * Primary call-to-action button. Renders as <button> (default) or <a>
 * (`as="a"`), with a magnetic cursor pull, hover/tap spring, and an
 * intensifying gradient glow on hover.
 */
export function GradientButton(props: GradientButtonProps) {
  // Magnetic pull (no-op on touch / reduced-motion).
  const { ref, style, onMouseMove, onMouseLeave } = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(0.3);

  const motionProps = {
    style,
    onMouseMove,
    onMouseLeave,
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.95 },
  };

  if (props.as === "a") {
    const { as: _as, variant = "solid", className, children, ...rest } = props;
    return (
      <motion.a ref={ref} className={cn(base, variants[variant], className)} {...motionProps} {...rest}>
        {children}
      </motion.a>
    );
  }

  const { as: _as, variant = "solid", className, children, ...rest } = props;
  return (
    <motion.button ref={ref} className={cn(base, variants[variant], className)} {...motionProps} {...rest}>
      {children}
    </motion.button>
  );
}
