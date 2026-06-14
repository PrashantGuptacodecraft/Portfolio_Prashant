"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny global store for the WebGL fluid-cursor toggle.
 *
 * Implemented with useSyncExternalStore so any client component (Navbar toggle,
 * FluidCursor, CustomCursor) can read/write it without a Context Provider — which
 * matters because the root layout is a Server Component.
 *
 * Persisted to localStorage under "fluidCursorEnabled". Default: ON for desktop
 * (fine pointer), OFF for touch-only devices to protect performance.
 */
const KEY = "fluidCursorEnabled";

function detectDefault(): boolean {
  if (typeof window === "undefined") return false;
  const coarse =
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !coarse && !reduced;
}

// Module-scope state, initialised once on the client from localStorage.
let enabled = (() => {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return detectDefault();
})();

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Update the toggle, persist it, and notify all subscribers. */
export function setFluidEnabled(value: boolean) {
  enabled = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, String(value));
  }
  emit();
}

/** Read the current value once (non-reactive). */
export function getFluidEnabled() {
  return enabled;
}

/**
 * Reactive hook → [enabled, setEnabled].
 * Server snapshot is always false so SSR markup is stable; the real value is
 * applied after hydration on the client.
 */
export function useFluidEnabled(): [boolean, (v: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
  return [value, setFluidEnabled];
}
