import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The AI Temple";

async function loadFont() {
  const cssRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  );
  const css = await cssRes.text();
  const match = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);
  if (!match) return null;
  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

export default async function OGImage() {
  const fontData = await loadFont();
  const gold = "hsl(38, 55%, 48%)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F2F0EB",
          color: "hsl(0, 0%, 10%)",
          fontFamily: "Cormorant",
          padding: "60px",
          position: "relative",
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 64 64"
          fill="none"
          style={{ marginBottom: "12px" }}
        >
          <circle cx="32" cy="32" r="6" fill={gold} />
          <circle
            cx="32"
            cy="32"
            r="11"
            stroke={gold}
            strokeWidth="1.5"
            fill="none"
          />
          <g stroke={gold} strokeWidth="2.4" strokeLinecap="round">
            <line x1="32" y1="14.5" x2="32" y2="3.5" />
            <line x1="32" y1="49.5" x2="32" y2="60.5" />
            <line x1="14.5" y1="32" x2="3.5" y2="32" />
            <line x1="49.5" y1="32" x2="60.5" y2="32" />
            <line x1="19.62" y1="19.62" x2="11.85" y2="11.85" />
            <line x1="44.38" y1="44.38" x2="52.15" y2="52.15" />
            <line x1="44.38" y1="19.62" x2="52.15" y2="11.85" />
            <line x1="19.62" y1="44.38" x2="11.85" y2="52.15" />
          </g>
          <g stroke={gold} strokeWidth="1.6" strokeLinecap="round">
            <line x1="37.36" y1="19.07" x2="39.65" y2="13.52" />
            <line x1="44.93" y1="26.64" x2="50.48" y2="24.35" />
            <line x1="44.93" y1="37.36" x2="50.48" y2="39.65" />
            <line x1="37.36" y1="44.93" x2="39.65" y2="50.48" />
            <line x1="26.64" y1="44.93" x2="24.35" y2="50.48" />
            <line x1="19.07" y1="37.36" x2="13.52" y2="39.65" />
            <line x1="19.07" y1="26.64" x2="13.52" y2="24.35" />
            <line x1="26.64" y1="19.07" x2="24.35" y2="13.52" />
          </g>
        </svg>

        <div
          style={{
            fontSize: "120px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          The AI Temple
        </div>

        <div
          style={{
            marginTop: "24px",
            fontSize: "30px",
            color: "hsl(0, 0%, 38%)",
            letterSpacing: "0.02em",
            display: "flex",
          }}
        >
          Apply, learn, mine nuggets and gemstones.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "48px",
            fontSize: "16px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "hsl(0, 0%, 38%)",
            display: "flex",
          }}
        >
          For Temple of the Sun
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Cormorant",
              data: fontData,
              style: "normal",
              weight: 600,
            },
          ]
        : undefined,
    },
  );
}
