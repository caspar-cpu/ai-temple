import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/db";

// Paths that bypass the auth gate. Auth surfaces (/login, /auth/*), the
// public marketing page (/about), and metadata routes that need to be
// accessible to crawlers and social platforms (OG image, manifest, robots,
// sitemap). The path matcher in `proxy.ts` already excludes static assets.
const PUBLIC_PATHS = [
  "/login",
  "/auth/callback",
  "/auth/error",
  "/about",
  "/opengraph-image",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
];

/**
 * Edge-middleware session sync. Reads cookies, refreshes the Supabase
 * session if needed, mirrors any new cookies onto the response, and
 * redirects unauthenticated visits to /login (preserving the intended
 * path in `?next=`). PUBLIC_PATHS bypass the gate. Called from
 * `proxy.ts` (the project's renamed `middleware.ts`).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
