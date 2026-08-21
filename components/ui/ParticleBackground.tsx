"use client";

import { useEffect, useRef } from "react";

type ParticleBackgroundProps = {
  /** Visual density multiplier (auto-reduced on small screens). */
  density?: number;
  className?: string;
};

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Lightweight canvas particle field with a mouse-reactive parallax pull.
 *
 * Deliberately dependency-free (no tsParticles) for performance:
 *  - density scales down on mobile,
 *  - fully disabled under prefers-reduced-motion,
 *  - pauses when the tab is hidden,
 *  - connecting lines only drawn within a short distance.
 */
export function ParticleBackground({ density = 1, className }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // Honour reduced-motion: render nothing animated.

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return; // Completely disable canvas particles on mobile for maximum performance.
    
    const colors = ["#00F5FF", "#7B61FF", "#00FFB3"];

    function resize() {
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);

      const count = Math.round(50 * density * Math.min(1.4, (width * height) / (1440 * 900)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    // Debounced resize — avoids rebuilding particle array on every pixel of a
    // window drag. 300ms settle time is imperceptible to the user.
    let resizeTimer = 0;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 300);
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor repulsion: particles inside the radius are gently pushed away,
        // and briefly grow + brighten — a classier feel than attraction.
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const radius = 130;
        let proximity = 0;
        if (dist < radius) {
          proximity = 1 - dist / radius;
          const push = proximity * 0.6;
          p.vx -= (dx / dist) * push;
          p.vy -= (dy / dist) * push;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Friction + soft wrap at edges.
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r + proximity * 1.6, 0, Math.PI * 2);
        ctx!.fillStyle = colors[i % colors.length];
        ctx!.globalAlpha = 0.5 + proximity * 0.45;
        ctx!.fill();

        // Connecting lines to a few following neighbours.
        for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 110) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.strokeStyle = colors[i % colors.length];
            ctx!.globalAlpha = (1 - d / 110) * 0.12;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    // Pause/resume so the canvas only animates while on-screen AND tab-visible.
    let onScreen = true;
    function pause() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
    function resume() {
      if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    }
    function onVisibility() {
      if (document.hidden) pause();
      else resume();
    }

    // Stop work entirely once the hero scrolls out of view (big scroll win).
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) resume();
        else pause();
      },
      { threshold: 0 },
    );

    resize();
    raf = requestAnimationFrame(tick);
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
