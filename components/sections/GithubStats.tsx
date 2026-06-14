"use client";

import { motion } from "framer-motion";
import { githubUsername } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { GithubIcon } from "@/components/ui/Icons";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/utils";

/**
 * GitHub activity, styled to match the theme.
 *
 * These are dynamically generated SVGs from github-readme-stats. We use a plain
 * lazy-loaded <img> (not next/image) because the endpoints return live SVGs
 * that don't benefit from the image optimizer and need dangerouslyAllowSVG.
 * Theme params are tuned to the portfolio palette.
 */
export function GithubStats() {
  const common = "hide_border=true&bg_color=00000000&title_color=00F5FF&icon_color=7B61FF&text_color=A0AEC0";

  const cards = [
    {
      alt: `${githubUsername} GitHub stats`,
      src: `https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&${common}&ring_color=00F5FF`,
    },
    {
      alt: `${githubUsername} top languages`,
      src: `https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&${common}`,
    },
    {
      alt: `${githubUsername} contribution streak`,
      src: `https://streak-stats.demolab.com/?user=${githubUsername}&hide_border=true&background=00000000&stroke=7B61FF&ring=00F5FF&fire=00FFB3&currStreakLabel=00F5FF&sideLabels=A0AEC0&dates=A0AEC0&currStreakNum=FFFFFF&sideNums=FFFFFF`,
    },
  ];

  return (
    <section className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-24 sm:py-32">
      <SectionHeading
        eyebrow="05 — Activity"
        title="On GitHub"
        subtitle="Consistent shipping — contributions, languages and streaks, live from my profile."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 grid gap-6 md:grid-cols-2"
      >
        {cards.map((card, i) => (
          <GlassCard
            key={card.alt}
            variants={fadeUp}
            bordered
            className={`flex items-center justify-center p-6 ${i === 2 ? "md:col-span-2" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.src}
              alt={card.alt}
              loading="lazy"
              className="h-auto w-full max-w-md"
            />
          </GlassCard>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-10 flex justify-center"
      >
        <GradientButton
          as="a"
          href={`https://github.com/${githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
        >
          <GithubIcon className="h-4 w-4" /> View full profile
        </GradientButton>
      </motion.div>
    </section>
  );
}
