"use client";

import { useSyncExternalStore, useEffect } from "react";

const KEY = "pg_low_power";

function detectDefault(): boolean {
  if (typeof window === "undefined") return false;
  // Auto-enable low power mode for devices with <= 4GB RAM, if supported by the browser.
  const memory = (navigator as any).deviceMemory;
  if (memory && memory <= 4) return true;
  
  return false;
}

// Module-scope state, initialised once on the client from localStorage.
let lowPower = (() => {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return detectDefault();
})();

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
  if (typeof document !== "undefined") {
    if (lowPower) {
      document.documentElement.classList.add("low-power-mode");
    } else {
      document.documentElement.classList.remove("low-power-mode");
    }
  }
}

export function setLowPowerMode(value: boolean) {
  lowPower = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, String(value));
  }
  emit();
}

export function getLowPowerMode() {
  return lowPower;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/**
 * Global store for Low Power / Performance Mode.
 * Disables heavy animations, WebGL, canvas particles, and blurs.
 */
export function useLowPowerMode(): [boolean, (v: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => lowPower,
    () => false,
  );
  
  // Ensure the class is applied on mount if it's true initially
  useEffect(() => {
    if (lowPower && typeof document !== "undefined") {
      document.documentElement.classList.add("low-power-mode");
    }
  }, []);

  return [value, setLowPowerMode];
}
