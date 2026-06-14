"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data";
import { fadeUp } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { ProjectVisual } from "./ProjectVisual";
import { TiltCard } from "./TiltCard";
import { CodeIcon, ExternalIcon } from "./Icons";

/**
 * Premium project showcase card:
 *  - abstract auto-generated visual (no fake screenshots),
 *  - tech-stack pills, highlight bullets,
 *  - real "View Code" + placeholder "Live Demo" buttons,
 *  - perspective tilt + moving glare via <TiltCard>,
 *  - custom-cursor label ("Open") on hover.
 */
export function ProjectCard({ project }: { project: Project }) {
  const demoDisabled = project.demo === "#";
  const codeDisabled = project.github === "#";

  return (
    <motion.div variants={fadeUp} className="h-full">
      <TiltCard max={7} glare className="h-full rounded-2xl">
        <GlassCard
          bordered
          data-cursor-label="Open"
          className="conic-border glass-highlight flex h-full flex-col overflow-hidden p-5 transition-shadow duration-300 hover:shadow-glow-secondary"
        >
          {/* Abstract visual */}
          <div className="mb-5 h-44 w-full">
            <ProjectVisual visual={project.visual} label={project.title} />
          </div>

          <h3 className="font-display text-xl font-bold text-text-primary">
            {project.title}
          </h3>
          <p className="mt-1.5 text-sm text-text-muted">{project.hook}</p>

          {/* Tech pills */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-surface-border bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-primary"
              >
                {t}
              </li>
            ))}
          </ul>

          {/* Highlights */}
          <ul className="mt-4 space-y-2 text-sm text-text-muted">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="mt-auto flex gap-3 pt-6">
            <a
              href={project.github}
              target={codeDisabled ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-disabled={codeDisabled}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-surface-border px-4 py-2.5 text-sm font-medium transition-colors ${
                codeDisabled
                  ? "cursor-not-allowed text-text-muted/50"
                  : "text-text-primary hover:border-primary/50 hover:text-primary"
              }`}
              onClick={(e) => codeDisabled && e.preventDefault()}
            >
              <CodeIcon className="h-4 w-4" /> View Code
            </a>
            <a
              href={project.demo}
              target={demoDisabled ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-disabled={demoDisabled}
              title={demoDisabled ? "Live demo coming soon" : "Open live demo"}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                demoDisabled
                  ? "cursor-not-allowed border border-surface-border text-text-muted/50"
                  : "bg-gradient-brand text-background hover:brightness-110"
              }`}
              onClick={(e) => demoDisabled && e.preventDefault()}
            >
              <ExternalIcon className="h-4 w-4" /> Live Demo
            </a>
          </div>
        </GlassCard>
      </TiltCard>
    </motion.div>
  );
}
