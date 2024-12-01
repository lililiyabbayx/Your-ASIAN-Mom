import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
// next.config.js (if you're using Next.js)
module.exports = {
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
};
