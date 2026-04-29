import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The AI Temple",
    short_name: "AI Temple",
    description:
      "AI plugins, skills, courses, and articles for Temple of the Sun.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F0EB",
    theme_color: "#C18B2A",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
