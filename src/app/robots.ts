import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/about", "/login"],
        disallow: ["/u/", "/settings", "/auth/"],
      },
    ],
    sitemap: "https://the-ai-temple.vercel.app/sitemap.xml",
    host: "https://the-ai-temple.vercel.app",
  };
}
