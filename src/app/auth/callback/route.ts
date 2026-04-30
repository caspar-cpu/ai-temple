import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic-link callback. Supabase sends users here with `?code=...` after
 * they click the email link. Exchanges the code for a session, then
 * redirects to the original `?next=` path (defaulting to /). Errors
 * funnel to /auth/error with a `reason` query param.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?reason=missing-code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/auth/error?reason=exchange`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
