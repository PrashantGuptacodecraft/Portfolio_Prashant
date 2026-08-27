"use client";

import { useEffect, useState } from "react";

/**
 * Live status chip showing the current local time in India (IST) with a pulsing
 * "live" dot — a small premium detail next to the availability badge.
 *
 * Uses Intl with an explicit timezone so it's correct regardless of the
 * visitor's locale. Updates every 30s (seconds aren't shown).
 */
export function StatusChip() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-text-muted">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="font-mono">
        {time ? `${time} IST` : "— IST"} · Delhi NCR
      </span>
    </span>
  );
}
