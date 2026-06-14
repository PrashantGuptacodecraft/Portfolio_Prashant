import type { Config } from "tailwindcss";

/**
 * Tailwind theme for the Prashant Gupta portfolio.
 *
 * Design system:
 *  - Near-black navy canvas (#050816) with translucent glass surfaces.
 *  - Electric cyan / violet gradient pair drives headings, buttons and auroras.
 *  - Mint glow used sparingly as a tertiary accent.
 *  - Three font families wired to CSS variables set by next/font in layout.tsx.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base canvas + elevated navy panels.
        background: "#050816",
        surface: "rgba(255,255,255,0.04)",
        "surface-border": "rgba(255,255,255,0.08)",

        // Brand palette.
        primary: "#00F5FF", // electric cyan
        secondary: "#7B61FF", // violet
        accent: "#00FFB3", // mint / green glow

        // Text.
        "text-primary": "#FFFFFF",
        "text-muted": "#A0AEC0",
      },
      fontFamily: {
        // Display / headings (Sora), body (Inter), code labels (JetBrains Mono).
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Responsive type scale anchored to the brief.
        hero: ["clamp(2.75rem, 8vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "section-title": ["clamp(2rem, 5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        // Reusable gradient pairs for text, borders and glows.
        "gradient-brand": "linear-gradient(120deg, #00F5FF 0%, #7B61FF 100%)",
        "gradient-brand-soft":
          "linear-gradient(120deg, rgba(0,245,255,0.18) 0%, rgba(123,97,255,0.18) 100%)",
        "gradient-mint": "linear-gradient(120deg, #00FFB3 0%, #00F5FF 100%)",
        "gradient-radial-glow":
          "radial-gradient(circle at center, rgba(0,245,255,0.16) 0%, rgba(5,8,22,0) 70%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glow-primary": "0 0 24px rgba(0,245,255,0.45)",
        "glow-secondary": "0 0 24px rgba(123,97,255,0.45)",
        "glow-accent": "0 0 24px rgba(0,255,179,0.4)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "14px",
      },
      keyframes: {
        // Slow drifting gradient blobs behind sections.
        "blob-drift": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 30px) scale(0.95)" },
        },
        // Animated conic glow used on gradient borders.
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Hero avatar orbit ring.
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Subtle vertical bounce for the scroll indicator.
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.6" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
        // Floating idle motion for decorative shapes.
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        // Shimmer sweep for the loading screen progress bar.
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Animated gradient text sheen.
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "blob-drift": "blob-drift 18s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        orbit: "orbit 14s linear infinite",
        "bounce-soft": "bounce-soft 1.8s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "gradient-pan": "gradient-pan 6s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
