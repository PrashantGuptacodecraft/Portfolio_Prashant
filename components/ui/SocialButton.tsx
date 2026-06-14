"use client";

import type { SocialLink } from "@/lib/data";
import { Magnetic } from "./Magnetic";
import { Tooltip } from "./Tooltip";
import { SocialIcon } from "./Icons";

/**
 * Circular social icon link with a magnetic pull and a hover/focus tooltip.
 * Shared by the hero, contact and footer so the interaction stays consistent.
 */
export function SocialButton({ social }: { social: SocialLink }) {
  const external = social.href.startsWith("http");
  return (
    <Magnetic strength={0.4}>
      <Tooltip label={social.handle}>
        <a
          href={social.href}
          target={external ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={`${social.label} — ${social.handle}`}
          className="grid h-10 w-10 place-items-center rounded-full glass text-text-muted transition-all hover:text-primary hover:shadow-glow-primary"
        >
          <SocialIcon icon={social.icon} className="h-5 w-5" />
        </a>
      </Tooltip>
    </Magnetic>
  );
}
