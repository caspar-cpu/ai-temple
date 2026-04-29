import type { MetadataRoute } from "next";

const BASE = "https://the-ai-temple.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${BASE}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/login`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
