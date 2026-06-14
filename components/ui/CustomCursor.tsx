"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { usePointerFine } from "@/lib/hooks/usePointerFine";
import { useFluidEnabled } from "@/lib/hooks/useFluidEnabled";

type Variant = "default" | "interactive" | "text" | "label";

/**
 * Two-part custom cursor:
 *  - a precise solid dot,
 *  - a larger ring that trails with spring lag.
 *
 * Hover behaviour is driven by data attributes on targets:
 *  - `[data-cursor="text"]`            → thin I-beam style over headings/inputs,
 *  - `[data-cursor-label="View"]`      → ring expands into a gradient pill label,
 *  - any <a>/<button>/[data-cursor="interactive"] → ring grows + dot shrinks.
 *
 * Fully disabled on touch devices and under prefers-reduced-motion (via
 * usePointerFine), where the OS cursor is used as-is.
 */
export function CustomCursor() {
  const enabled = usePointerFine();
  // When the fluid effect is on, it becomes the primary visual — so we drop the
  // trailing ring and keep only the precise dot so the two don't compete.
  const [fluidOn] = useFluidEnabled();

  // Dot tracks precisely; ring trails with spring lag.
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 350, damping: 28, mass: 0.4 });

  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Hide the OS cursor while ours is active (focus rings remain visible).
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea, select, [role='button']",
      );

      if (!hit) {
        setVariant("default");
        setLabel("");
        return;
      }

      const mode = hit.getAttribute("data-cursor");
      const labelText = hit.getAttribute("data-cursor-label");

      if (labelText) {
        setVariant("label");
        setLabel(labelText);
      } else if (mode === "text" || hit.tagName === "INPUT" || hit.tagName === "TEXTAREA") {
        setVariant("text");
        setLabel("");
      } else {
        setVariant("interactive");
        setLabel("");
      }
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled, dotX, dotY, visible]);

  if (!enabled) return null;

  // Ring sizing per variant.
  const ringSize =
    variant === "label" ? 0 : variant === "interactive" ? 60 : variant === "text" ? 4 : 36;
  const ringHeight = variant === "text" ? 28 : ringSize;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden="true">
      {/* Trailing ring / morphing label */}
      {/* Trailing ring / morphing label — hidden while the fluid effect leads. */}
      {!fluidOn && (
        <motion.div
          className="absolute left-0 top-0"
          style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
        >
          <AnimatePresence mode="popLayout">
            {variant === "label" ? (
              <motion.div
                key="label"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-semibold text-background shadow-glow-primary"
              >
                {label}
              </motion.div>
            ) : (
              <motion.div
                key="ring"
                className="cursor-ring -translate-x-1/2 -translate-y-1/2 rounded-full border"
                animate={{
                  width: variant === "text" ? 4 : ringSize,
                  height: ringHeight,
                  opacity: variant === "interactive" ? 1 : 0.8,
                  backgroundColor:
                    variant === "interactive" ? "rgba(0,245,255,0.10)" : "rgba(0,0,0,0)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Precise dot */}
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ x: dotX, y: dotY, opacity: visible ? 1 : 0 }}
        animate={{
          width: variant === "interactive" || variant === "label" ? 0 : pressed ? 5 : 7,
          height: variant === "interactive" || variant === "label" ? 0 : pressed ? 5 : 7,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  );
}
