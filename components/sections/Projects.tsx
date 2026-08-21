"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionTint } from "@/components/ui/SectionTint";
import { staggerContainer, viewportOnce } from "@/lib/utils";

/**
 * Projects showcase grid. Cards reveal with a stagger and lift/tilt on hover.
 * The first (flagship) project spans two columns on large screens.
 */
export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:py-32">
      <SectionTint color="violet" />
      <SectionHeading
        eyebrow="03 — Projects"
        title="Things I've built"
        subtitle="Flagship personal projects — voice assistants, AI agents and automation platforms. Freelance client work is in the next section."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project, i) => (
          <div key={project.title} className={i === 0 ? "lg:col-span-2" : ""}>
            <ProjectCard project={project} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
