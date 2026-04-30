# The AI Temple

Internal AI-skills warehouse for staff at Temple of the Sun. Apply, learn, mine.

A gamified library of:

- **Plugins** — Claude skills hosted on GitHub, install once and use everywhere
- **Skills** — marketplace skills that ship a single capability
- **AI Tools** — the 2026 field guide, ordered by leverage
- **Courses** — long-form learning from Anthropic and others
- **Articles** — curated AI reading

Every tick / read / contribute earns nuggets and gemstones, ranked on a live leaderboard.

## Tech

- Next.js 16 (App Router) + React 19, TypeScript, Tailwind 4
- Supabase (Postgres + Auth via magic link + RLS + Postgres trigger-driven trophy logic)
- Cormorant Garamond (display) + Inter (body) + JetBrains Mono via `next/font/google`
- Custom Nugget + Gemstone SVG components for achievement visuals

## Local dev

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase URL + anon key
pnpm dev                     # http://localhost:3000
```

Full setup, including Supabase auth-URL configuration and Vercel env vars, is in [SETUP.md](SETUP.md).

## Live

Production: https://ai-temple-eta.vercel.app (Vercel project `ai-temple`, region pinned to `lhr1` to co-locate with Supabase eu-west-2).
