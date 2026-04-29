import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5EFE5" },
    { media: "(prefers-color-scheme: dark)", color: "#C18B2A" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "The AI Temple",
    template: "%s · The AI Temple",
  },
  description:
    "A library of AI plugins, skills, courses, and articles for Temple of the Sun. Apply, learn, mine nuggets and gemstones.",
  metadataBase: new URL("https://ai-temple-eta.vercel.app"),
  openGraph: {
    title: "The AI Temple",
    description:
      "A library of AI plugins, skills, courses, and articles for Temple of the Sun. Apply, learn, mine nuggets and gemstones.",
    siteName: "The AI Temple",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "The AI Temple",
    description:
      "AI plugins, skills, courses, and articles for Temple of the Sun.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
