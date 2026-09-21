"use client";

import { motion } from "framer-motion";
import { useLowPowerMode } from "@/lib/hooks/useLowPowerMode";
import { Tooltip } from "./Tooltip";

export function PerformanceToggle({ withLabel = false }: { withLabel?: boolean }) {
  const [lowPower, setLowPower] = useLowPowerMode();

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={() => setLowPower(!lowPower)}
        aria-pressed={lowPower}
        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-text-primary hover:bg-white/5"
      >
        <span className="flex items-center gap-2">
          <svg className={`h-4 w-4 ${lowPower ? 'text-accent' : 'text-primary'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {lowPower ? (
              <>
                <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"/>
                <line x1="23" y1="13" x2="23" y2="11"/>
                <line x1="11" y1="6" x2="11" y2="18"/>
              </>
            ) : (
              <>
                <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
                <line x1="23" y1="13" x2="23" y2="11"/>
                <path d="M11 15V9"/>
              </>
            )}
          </svg>
          {lowPower ? "Low Power Mode" : "High Fidelity"}
        </span>
        <span
          className={`relative h-5 w-9 rounded-full transition-colors ${
            lowPower ? "bg-accent" : "bg-white/15"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
              lowPower ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
      </button>
    );
  }

  return (
    <Tooltip label={lowPower ? "Performance Mode: ON (Max speed)" : "Performance Mode: OFF (High fidelity)"}>
      <motion.button
        type="button"
        onClick={() => setLowPower(!lowPower)}
        aria-pressed={lowPower}
        aria-label="Toggle low power performance mode"
        whileTap={{ scale: 0.9 }}
        className={`grid h-10 w-10 place-items-center rounded-full glass transition-all ${
          lowPower
            ? "text-accent shadow-glow-accent"
            : "text-text-muted hover:text-text-primary"
        }`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {lowPower ? (
            <>
              <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"/>
              <line x1="23" y1="13" x2="23" y2="11"/>
              <line x1="11" y1="6" x2="11" y2="18"/>
            </>
          ) : (
            <>
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
              <line x1="23" y1="13" x2="23" y2="11"/>
              <path d="M11 15V9"/>
            </>
          )}
        </svg>
      </motion.button>
    </Tooltip>
  );
}
