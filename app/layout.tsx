import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/lib/data";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SpotlightBackground } from "@/components/ui/SpotlightBackground";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import "./globals.css";

/* Fonts wired to the CSS variables consumed by tailwind.config.ts. */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://prashant-gupta.vercel.app"; // Update to the real domain after deploy.

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.tagline}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.valueProposition,
  keywords: [
    "Prashant Gupta",
    "Full-Stack Developer",
    "AI Automation",
    "Next.js",
    "React",
    "Node.js",
    "Playwright",
    "Portfolio",
    "Software Engineer",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.tagline}`,
    description: profile.valueProposition,
    siteName: `${profile.name} · Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.tagline}`,
    description: profile.valueProposition,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Top scroll-progress indicator. */}
        <ScrollProgress />
        {/* Global ambient light + drifting auroras behind every section. */}
        <SpotlightBackground />
        {children}
        {/* Desktop-only custom cursor (no-op on touch / reduced-motion). */}
        <CustomCursor />
        {/* Keyboard shortcuts: "/" focuses contact, "g h" opens GitHub. */}
        <KeyboardShortcuts />
        {/* Site-wide film grain to soften the flat digital look. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
