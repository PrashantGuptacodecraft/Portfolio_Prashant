"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedTextProps = {
  /** Phrases to cycle through with a typewriter effect. */
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
};

/**
 * Accessible typewriter that cycles `phrases`.
 *
 * Respects prefers-reduced-motion (renders the first phrase statically) and
 * exposes the live text to assistive tech via aria-label, so the animation is
 * decorative-only for screen readers.
 */
export function AnimatedText({
  phrases,
  className,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseMs = 1400,
}: AnimatedTextProps) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) setText(phrases[0] ?? "");
  }, [phrases]);

  useEffect(() => {
    if (reducedMotion.current || phrases.length === 0) return;

    const current = phrases[phraseIndex % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      // Fully typed — pause before deleting.
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text === "") {
      // Fully deleted — advance to next phrase.
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    } else {
      // Type or delete one character.
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting
              ? current.slice(0, prev.length - 1)
              : current.slice(0, prev.length + 1),
          );
        },
        deleting ? deletingSpeed : typingSpeed,
      );
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className} aria-label={phrases.join(", ")}>
      <span aria-hidden="true">{text}</span>
      {/* Blinking caret. */}
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[2px] animate-pulse bg-primary align-middle"
      />
    </span>
  );
}
