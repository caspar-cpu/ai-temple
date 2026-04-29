import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fbldcfbrhvymuksyshdu.supabase.co",
      },
    ],
  },
};

export default nextConfig;
