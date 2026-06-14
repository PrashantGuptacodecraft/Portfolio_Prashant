# Prashant Gupta — Portfolio

An ultra-modern, dark-themed personal portfolio for a full-stack developer &
AI/automation builder. Built with **Next.js (App Router) + TypeScript**,
**Tailwind CSS**, and **Framer Motion** — glassmorphism, aurora gradients, a
mouse-reactive particle field, and scroll-triggered motion that respects
`prefers-reduced-motion`.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** with a fully custom theme (`tailwind.config.ts`)
- **Framer Motion** for load sequence, reveals, and micro-interactions
- Dependency-free **canvas particle background** (no tsParticles) for performance

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# open http://localhost:3000

# 3. Production build
npm run build && npm start
```

> Requires Node 18.18+ (tested on Node 24).

## Project structure

```
.
├── app/
│   ├── api/contact/route.ts   # Contact form endpoint (validates + acks)
│   ├── globals.css            # Tailwind layers, glass utilities, reduced-motion
│   ├── layout.tsx             # Fonts (Sora/Inter/JetBrains Mono), SEO metadata
│   └── page.tsx               # Composes all sections; lazy-loads below-the-fold
├── components/
│   ├── Loader.tsx             # "PG" boot screen (skippable, once per session)
│   ├── Navbar.tsx             # Sticky glass nav + mobile slide-in menu
│   ├── sections/              # Hero, About, Skills, Projects, Experience,
│   │                          #   GithubStats, Contact, Footer
│   └── ui/                    # GlassCard, GradientButton, SectionHeading,
│                              #   AnimatedText, ParticleBackground,
│                              #   AuroraBackground, SkillChip, ProjectCard,
│                              #   ProjectVisual, TimelineItem, Icons
├── lib/
│   ├── data.ts                # ALL content: profile, skills, projects, timeline
│   └── utils.ts               # cn() + shared Framer Motion variants
├── public/resume/             # Drop your resume PDF here (see below)
└── tailwind.config.ts         # Colors, fonts, gradients, keyframes
```

## Where to plug in your real assets

| What | Where |
| --- | --- |
| **Resume PDF** | Save as `public/resume/Prashant_Gupta_Resume.pdf` (or change `profile.resumeUrl` in `lib/data.ts`). |
| **Profile photo** | Hero currently uses a stylized "PG" glass avatar. To use a photo, drop it in `public/` and swap the avatar core in `components/sections/Hero.tsx` for a `next/image`. |
| **LeetCode URL** | Set in `lib/data.ts → socials` (currently linked to your real profile). |
| **Live demo URLs** | Update each project's `demo` field in `lib/data.ts` (left as `"#"` so no fake URLs ship). |
| **Real domain** | Update `siteUrl` in `app/layout.tsx` for correct OpenGraph/canonical metadata. |

## Editing content

All copy is **data-driven** — edit `lib/data.ts` only. Projects, skills,
achievements, social links, and the about narrative are typed arrays; the UI
renders whatever you put there. No content is hardcoded inside components.

## Wiring the contact form

The contact form is **already wired to email you** via Gmail SMTP (Nodemailer).
Messages POST to `app/api/contact/route.ts`, which sends them to
`adityagupta983869@gmail.com`.

To enable delivery, copy `.env.local.example` → `.env.local` and set:

```bash
GMAIL_USER=adityagupta983869@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password   # NOT your account password
```

Create the App Password at https://myaccount.google.com/apppasswords
(requires 2-Step Verification). On Vercel, add the same two variables under
**Project → Settings → Environment Variables**.

Until those are set, the form still works and shows success, but messages are
logged server-side instead of emailed (so local dev never hard-fails).

## Accessibility & performance

- Semantic `header / nav / main / section / footer`, real crawlable HTML text.
- All decorative motion disabled under `prefers-reduced-motion: reduce`.
- Particle density scales down on mobile and pauses on hidden tabs.
- Below-the-fold sections are lazy-loaded via `next/dynamic`.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — zero config.
Remember to add the contact env vars and update `siteUrl`.
