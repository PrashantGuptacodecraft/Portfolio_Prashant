"use client";

import { motion } from "framer-motion";
import { freelanceProjects } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionTint } from "@/components/ui/SectionTint";
import { GlassCard } from "@/components/ui/GlassCard";
import { CodeIcon, ExternalIcon } from "@/components/ui/Icons";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/utils";

/**
 * Freelance section — compact grid of client projects.
 * Each card shows the project category badge, title, hook, tech pills
 * and a "View Code" link. Uses a tighter layout than the main Projects grid
 * since freelance cards carry less content.
 */
export function Freelance() {
  return (
    <section
      id="freelance"
      className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:py-32"
    >
      <SectionTint color="cyan" />
      <SectionHeading
        eyebrow="03b — Freelance"
        title="Client work I've delivered"
        subtitle="Real-world projects built for actual clients — from healthcare portals to enterprise logistics and e-commerce platforms."
      />

      {/* Stats row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 flex flex-wrap gap-4"
      >
        {[
          { value: "7", label: "Projects delivered" },
          { value: "5+", label: "Industries served" },
          { value: "100%", label: "End-to-end built" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="glass rounded-2xl px-6 py-4 text-center"
          >
            <p className="font-display text-2xl font-bold text-gradient">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Project grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {freelanceProjects.map((project) => {
          const accentClass =
            project.visual === "cyan"
              ? "text-primary border-primary/30 bg-primary/10"
              : project.visual === "violet"
                ? "text-secondary border-secondary/30 bg-secondary/10"
                : "text-accent border-accent/30 bg-accent/10";

          const glowClass =
            project.visual === "cyan"
              ? "hover:shadow-glow-primary"
              : project.visual === "violet"
                ? "hover:shadow-glow-secondary"
                : "hover:shadow-glow-accent";

          return (
            <motion.div key={project.title} variants={fadeUp}>
              <GlassCard
                bordered
                className={`conic-border glass-highlight flex h-full flex-col gap-3 rounded-2xl p-5 transition-shadow duration-300 ${glowClass}`}
              >
                {/* Category badge */}
                <span
                  className={`w-fit rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${accentClass}`}
                >
                  {project.category}
                </span>

                <div>
                  <h3 className="font-display text-base font-bold text-text-primary leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted leading-relaxed">{project.hook}</p>
                </div>

                {/* Tech pills */}
                <ul className="flex flex-wrap gap-1.5 mt-auto">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-surface-border bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-primary"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="mt-2 flex items-center gap-4 pt-1 border-t border-white/5">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
                  >
                    <CodeIcon className="h-3.5 w-3.5" />
                    Code
                  </a>
                  {project.demo !== "#" && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:brightness-125 transition-colors"
                    >
                      <ExternalIcon className="h-3.5 w-3.5" />
                      Preview
                    </a>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
