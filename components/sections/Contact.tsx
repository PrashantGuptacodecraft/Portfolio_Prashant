"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { profile, socials } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { DownloadIcon, SocialIcon } from "@/components/ui/Icons";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Contact section: glass form (POSTs to /api/contact) on the left, direct
 * contact channels + resume CTA on the right. Aurora bookends the hero visually.
 */
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden px-5 py-24 sm:py-32">
      <AuroraBackground className="opacity-70" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="06 — Contact"
          title="Let's build something"
          subtitle="Got a role, a project, or an idea worth automating? My inbox is open."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <GlassCard bordered className="conic-border glass-highlight p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" name="name" type="text" placeholder="Your name" />
                  <Field label="Email" name="email" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about it…"
                    className="w-full resize-none rounded-xl border border-surface-border bg-white/[0.03] px-4 py-3 text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <GradientButton as="button" type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Sending…" : "Send Message"}
                  </GradientButton>
                  {status === "success" && (
                    <p className="text-sm text-accent">Thanks — I&apos;ll get back to you soon.</p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                </div>
              </form>
            </GlassCard>
          </motion.div>

          {/* Direct channels */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-4"
          >
            {socials.map((s) => (
              <motion.a
                key={s.label}
                variants={fadeUp}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:border-primary/40 hover:shadow-glow-primary"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand-soft text-primary">
                  <SocialIcon icon={s.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text-primary">{s.label}</span>
                  <span className="block text-xs text-text-muted">{s.handle}</span>
                </span>
              </motion.a>
            ))}

            <motion.div variants={fadeUp} className="mt-2">
              <GradientButton as="a" href={profile.resumeUrl} download variant="outline" className="w-full">
                <DownloadIcon className="h-4 w-4" /> Download Resume
              </GradientButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Labelled glass input used by the contact form. */
function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-mono text-xs uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-surface-border bg-white/[0.03] px-4 py-3 text-text-primary outline-none transition-colors placeholder:text-text-muted/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
