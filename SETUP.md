# The AI Temple — setup

## What's wired up

- Next.js 16 (App Router) + TypeScript + Tailwind + Turbopack
- Supabase (Postgres + Auth + RLS) — link to your own new project
- Schema + trophy triggers + leaderboard view applied via migration
- Auth: email magic link, open to any email domain
- Pages: dashboard, plugins (list/detail/submit), articles (list/submit), courses (list/submit), profile, full leaderboard
- Right-hand collapsible leaderboard sidebar
- Trophies awarded automatically by Postgres triggers when you tick "used", "read", "completed", or contribute

## Two things you need to do in the Supabase dashboard

### 1. Configure Auth URLs

Go to **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs** (add these): `http://localhost:3000/**`

When you deploy to Vercel, come back here and add:

- `https://your-vercel-domain.vercel.app/**` to redirect URLs
- Update Site URL to your production URL (or keep localhost if you prefer)

### 2. Email templates (optional)

**Authentication → Email Templates → Magic Link** — customise the email copy if you want.

## Running locally

```bash
cd "AI Temple"
pnpm dev
```

Open `http://localhost:3000`, sign in with any email, click the magic link in your inbox.

## Adding content

Once you're signed in, there are "Add" buttons on each section:

- **Plugins** → point to a GitHub blob URL for a `SKILL.md`. Warehouse fetches it live, so pushing to GitHub updates everyone instantly.
- **Articles** → title, URL, author, source, short description.
- **Courses** → title, URL, provider, estimated hours.

Each contribution earns points — 50 for a plugin, 5 for an article or course.

## Deploying to Vercel

```bash
pnpm install -g vercel  # if not already
vercel
```

Set these env vars in the Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your Vercel URL)

Then add the Vercel URL to Supabase's Redirect URLs.

## Points scheme

| Activity | Points |
| --- | --- |
| Read an article | 10 |
| Apply a plugin | 25 |
| Contribute a plugin | 50 |
| Complete a course | 100 |
| Add an article | 5 |
| Add a course | 5 |
| First plugin used | +20 |
| 5 / 10 / 25 plugins used | +50 / +100 / +200 |
| Your plugin used by 10 people | +150 |

All defined in [src/lib/points.ts](src/lib/points.ts) and awarded via Postgres triggers in the migration.
