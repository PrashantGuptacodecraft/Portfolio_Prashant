"use client";

import { navLinks, profile, socials } from "@/lib/data";
import { SocialButton } from "@/components/ui/SocialButton";

/** Minimal footer: brand, quick nav, socials and build credit. */
export function Footer() {
  const year = 2026; // Date.now() is avoided in this build; bump as needed.

  return (
    <footer className="relative border-t border-surface-border px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        {/* Brand */}
        <div>
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand font-display text-sm font-bold text-background">
              {profile.initials}
            </span>
            <span className="font-display font-semibold text-text-primary">{profile.name}</span>
          </a>
          <p className="mt-3 max-w-xs text-sm text-text-muted">{profile.tagline}</p>
        </div>

        {/* Quick nav */}
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-text-muted transition-colors hover:text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Socials */}
        <div className="flex gap-3">
          {socials.map((s) => (
            <SocialButton key={s.label} social={s} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-surface-border pt-6 text-xs text-text-muted sm:flex-row">
        <p>© {year} {profile.name}. All rights reserved.</p>

        {/* Power-user hint for the keyboard shortcuts. */}
        <p className="hidden items-center gap-1.5 md:flex">
          Press
          <kbd className="rounded border border-surface-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-primary">/</kbd>
          to jump to contact ·
          <kbd className="rounded border border-surface-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-primary">G</kbd>
          <kbd className="rounded border border-surface-border bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-primary">H</kbd>
          for GitHub
        </p>

        <p className="font-mono">
          Built with <span className="text-primary">Next.js</span> · <span className="text-secondary">Tailwind</span> · <span className="text-accent">Framer Motion</span>
        </p>
      </div>
    </footer>
  );
}
