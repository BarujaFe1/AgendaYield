import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages project site needs a base path; Vercel/local stay at root.
  basePath: isGithubPages ? "/AgendaYield" : undefined,
  assetPrefix: isGithubPages ? "/AgendaYield" : undefined,
  trailingSlash: true,
};

export default nextConfig;
