import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/db";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Authenticated profile getter for protected routes. Redirects to /login
 * if there's no session or the profile row is missing. `cache` dedupes
 * across server components so multiple callers in one request share one
 * round-trip.
 */
export const getCurrentUser = cache(async (): Promise<Profile> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) redirect("/login");
  return profile;
});

/**
 * Like `getCurrentUser` but returns null instead of redirecting when
 * there's no session. Use on pages that render for both signed-in and
 * signed-out visitors (e.g. the public landing).
 */
export const getOptionalUser = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ?? null;
});

/**
 * Top-N rows from the `leaderboard` view, points-desc. Returns [] on
 * error so callers can render a graceful empty state. Cached per request.
 */
export const getLeaderboard = cache(async (limit = 10) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("total_points", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data;
});
