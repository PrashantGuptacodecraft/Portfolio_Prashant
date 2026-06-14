"use client";

import { useEffect } from "react";
import { socials } from "@/lib/data";

/**
 * Global keyboard shortcuts (power-user delight):
 *  - press "/"        → smooth-scroll to the contact form and focus it,
 *  - press "g" then "h" (within 1s) → open GitHub in a new tab.
 *
 * Shortcuts are ignored while the user is typing in a field (so "/" types
 * normally), keeping the form usable. Renders nothing.
 */
export function KeyboardShortcuts() {
  useEffect(() => {
    let lastG = 0;

    const isTyping = (el: Element | null) =>
      !!el &&
      (el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        (el as HTMLElement).isContentEditable);

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(document.activeElement)) return;

      if (e.key === "/") {
        e.preventDefault();
        const contact = document.getElementById("contact");
        contact?.scrollIntoView({ behavior: "smooth" });
        const field = contact?.querySelector<HTMLElement>("input, textarea");
        // Focus after the smooth scroll settles.
        window.setTimeout(() => field?.focus(), 600);
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "g") {
        lastG = performance.now();
        return;
      }
      if (key === "h" && performance.now() - lastG < 1000) {
        const github = socials.find((s) => s.icon === "github");
        if (github) window.open(github.href, "_blank", "noopener,noreferrer");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
