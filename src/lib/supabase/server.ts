import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/db";

/**
 * Server-component / server-action Supabase client. Reads + writes
 * auth cookies via Next.js's async `cookies()`. The setAll catch is
 * deliberate: Server Components can't mutate cookies, so the write
 * silently fails and the proxy middleware refreshes the session on
 * the next request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component. Safe to ignore if proxy refreshes the session.
          }
        },
      },
    },
  );
}
