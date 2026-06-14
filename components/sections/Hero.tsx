"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { profile, socials } from "@/lib/data";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { GradientButton } from "@/components/ui/GradientButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { SocialButton } from "@/components/ui/SocialButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { ArrowDownIcon, DownloadIcon } from "@/components/ui/Icons";

/**
 * Full-viewport hero:
 *  - particle field + aurora blobs background,
 *  - mouse-following radial glow,
 *  - typing role cycler, gradient name, CTAs,
 *  - glass-framed avatar with an orbiting glow ring,
 *  - bouncing scroll indicator.
 */
export function Hero() {
  // Mouse-following glow (spring-smoothed for a premium feel).
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const glowX = useTransform(sx, (v) => `${v * 100}%`);
  const glowY = useTransform(sy, (v) => `${v * 100}%`);
  // Smoothed radial glow that tracks the cursor across the hero.
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(40rem 40rem at ${x} ${y}, rgba(0,245,255,0.12), transparent 60%)`,
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pt-24"
    >
      {/* Layered backgrounds */}
      <AuroraBackground />
      <ParticleBackground density={1.8} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: glowBackground }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent shadow-glow-accent" />
              Available for Full-Stack / SDE roles
            </span>
            <StatusChip />
          </div>

          <p className="mb-3 font-mono text-sm text-primary">Hi, I&apos;m</p>
          <h1 data-cursor="text" className="relative font-display text-hero font-bold leading-none">
            {/* Neon-sign glow duplicate behind the name. */}
            <span aria-hidden="true" className="text-gradient absolute inset-0 select-none blur-[22px] opacity-60">
              {profile.name}
            </span>
            <span className="text-gradient animate-gradient-pan relative">{profile.name}</span>
          </h1>

          {/* Typing role cycler */}
          <div className="mt-4 h-8 font-display text-xl font-semibold text-text-primary sm:text-2xl">
            <AnimatedText phrases={[...profile.roles]} />
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            {profile.valueProposition}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <GradientButton as="a" href="#projects">
              View Projects
            </GradientButton>
            <GradientButton as="a" href={profile.resumeUrl} download variant="outline">
              <DownloadIcon className="h-4 w-4" /> Download Resume
            </GradientButton>
          </div>

          {/* Social row */}
          <div className="mt-8 flex items-center gap-4">
            {socials.map((s) => (
              <SocialButton key={s.label} social={s} />
            ))}
          </div>
        </motion.div>

        {/* Right: glass-framed avatar with orbit ring + perspective tilt */}
        <motion.div
          className="relative mx-auto hidden aspect-square w-72 lg:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard max={14} className="h-full w-full rounded-full">
            {/* Orbit rings (sit at base depth) */}
            <div className="absolute inset-0 animate-orbit rounded-full border border-dashed border-primary/30" />
            <div className="absolute inset-4 animate-spin-slow rounded-full border border-secondary/20" />
            {/* Orbiting dot */}
            <div className="absolute inset-0 animate-orbit">
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-glow-accent" />
            </div>
            {/* Avatar core — real photo lifted forward in 3D for parallax depth */}
            <div
              className="glass glass-highlight absolute inset-8 overflow-hidden rounded-full shadow-glass"
              style={{ transform: "translateZ(55px)" }}
              data-cursor-label="Hello"
            >
              <Image
                src="/profile.jpg"
                alt={`${profile.name} — portrait`}
                fill
                priority
                sizes="(min-width: 1024px) 224px, 0px"
                className="object-cover"
              />
              {/* Subtle brand tint so the photo blends into the dark theme. */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-secondary/20 via-transparent to-primary/20" />
            </div>
            <div className="absolute inset-8 -z-10 rounded-full bg-gradient-radial-glow blur-2xl" />
          </TiltCard>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-text-muted sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ArrowDownIcon className="h-5 w-5 animate-bounce-soft text-primary" />
      </a>
    </section>
  );
}
