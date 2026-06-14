"use client";

import { motion } from "framer-motion";
import { useFluidEnabled } from "@/lib/hooks/useFluidEnabled";
import { DropletIcon } from "./Icons";
import { Tooltip } from "./Tooltip";

/**
 * Toggles the WebGL fluid-cursor effect on/off. Choice persists to localStorage
 * via the shared store. The icon fills with the brand gradient when active.
 */
export function FluidToggle({ withLabel = false }: { withLabel?: boolean }) {
  const [enabled, setEnabled] = useFluidEnabled();

  if (withLabel) {
    // Used inside the mobile menu where a labelled row is clearer.
    return (
      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        aria-pressed={enabled}
        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-text-primary hover:bg-white/5"
      >
        <span className="flex items-center gap-2">
          <DropletIcon className="h-4 w-4 text-primary" />
          Fluid cursor effect
        </span>
        <span
          className={`relative h-5 w-9 rounded-full transition-colors ${
            enabled ? "bg-gradient-brand" : "bg-white/15"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
              enabled ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
    );
  }

  return (
    <Tooltip label={enabled ? "Fluid cursor: on" : "Fluid cursor: off"}>
      <motion.button
        type="button"
        onClick={() => setEnabled(!enabled)}
        aria-pressed={enabled}
        aria-label="Toggle fluid cursor effect"
        whileTap={{ scale: 0.9 }}
        className={`grid h-10 w-10 place-items-center rounded-full glass transition-all ${
          enabled
            ? "text-primary shadow-glow-primary"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        <DropletIcon className="h-5 w-5" />
      </motion.button>
    </Tooltip>
  );
}
