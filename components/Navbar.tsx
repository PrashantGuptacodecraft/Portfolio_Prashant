"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navLinks, profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import { GradientButton } from "./ui/GradientButton";
import { Magnetic } from "./ui/Magnetic";
import { FluidToggle } from "./ui/FluidToggle";
import { CloseIcon, DownloadIcon, MenuIcon } from "./ui/Icons";

/**
 * Sticky navbar that gains a glass background once the page is scrolled.
 * Desktop: animated underline links + resume CTA.
 * Mobile: slide-in menu with staggered links.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24;
      // Only re-render when the boolean value actually changes.
      setScrolled((prev) => (prev !== next ? next : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-glass" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <a href="#top" className="group flex items-center gap-2" aria-label="Back to top">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand font-display text-sm font-bold text-background shadow-glow-primary">
            {profile.initials}
          </span>
          <span className="hidden font-display font-semibold tracking-wide text-text-primary sm:block">
            Prashant<span className="text-primary">.</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Magnetic strength={0.25}>
                <a
                  href={link.href}
                  className="group relative text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
                >
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-gradient-brand transition-all duration-300 group-hover:w-full" />
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <FluidToggle />
          <GradientButton as="a" href={profile.resumeUrl} download className="px-5 py-2.5">
            <DownloadIcon className="h-4 w-4" /> Resume
          </GradientButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-10 w-10 place-items-center rounded-lg glass text-text-primary md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <MenuIconWrapper open /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 top-[72px] z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass mx-4 rounded-2xl p-6 shadow-glass"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-lg font-medium text-text-primary hover:bg-white/5"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* Optional fluid-cursor effect toggle (off by default on touch). */}
              <div className="mt-2 border-t border-surface-border pt-2">
                <FluidToggle withLabel />
              </div>

              <a
                href={profile.resumeUrl}
                download
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 font-semibold text-background"
              >
                <DownloadIcon className="h-4 w-4" /> Download Resume
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Renders the close glyph when the mobile menu is open. */
function MenuIconWrapper({ open }: { open: boolean }) {
  return open ? <CloseIcon /> : <MenuIcon />;
}
