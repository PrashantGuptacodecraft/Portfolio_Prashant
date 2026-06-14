/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // A parent folder also has a lockfile; pin tracing to this project so Next
  // doesn't infer the wrong workspace root.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    // GitHub readme stats / shields badges are served from these hosts.
    remotePatterns: [
      { protocol: "https", hostname: "github-readme-stats.vercel.app" },
      { protocol: "https", hostname: "github-readme-streak-stats.herokuapp.com" },
      { protocol: "https", hostname: "streak-stats.demolab.com" },
      { protocol: "https", hostname: "img.shields.io" },
    ],
  },
};

export default nextConfig;
