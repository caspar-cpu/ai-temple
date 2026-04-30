"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const Schema = z.object({
  full_name: z.string().min(1).max(120).optional(),
  username: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only")
    .optional(),
  department: z.string().max(80).optional(),
});

function errorTo(message: string): never {
  redirect(`/settings?error=${encodeURIComponent(message)}`);
}

/**
 * Profile editor server action. Sanitises username (lowercases, strips
 * disallowed chars, trims edge hyphens) before Zod validation. Skips
 * any field left blank instead of writing nulls. Postgres unique-
 * violation (23505) is reported as a friendly "username taken"
 * message. Layout-revalidates so the nav reflects the new name on
 * next render, then redirects to the profile page.
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const rawName = (formData.get("full_name") as string | null)?.trim();
  const rawUsername = (formData.get("username") as string | null)
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
  const rawDept = (formData.get("department") as string | null)?.trim();

  const result = Schema.safeParse({
    full_name: rawName || undefined,
    username: rawUsername || undefined,
    department: rawDept || undefined,
  });

  if (!result.success) {
    const first = result.error.issues[0];
    errorTo(first ? `${String(first.path[0])}: ${first.message}` : "Invalid input");
  }

  const { full_name, username, department } = result.data;

  if (!full_name && !username && department === undefined) {
    errorTo("Nothing to update");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...(full_name ? { full_name } : {}),
      ...(username ? { username } : {}),
      ...(department !== undefined
        ? { department: department || null }
        : {}),
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") errorTo("That username is already taken");
    errorTo(error.message);
  }

  revalidatePath("/", "layout");

  if (result.data.username) {
    redirect(`/u/${result.data.username}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();
  redirect(profile?.username ? `/u/${profile.username}` : "/");
}
