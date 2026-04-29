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
});

function errorTo(message: string): never {
  redirect(`/settings?error=${encodeURIComponent(message)}`);
}

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

  const result = Schema.safeParse({
    full_name: rawName || undefined,
    username: rawUsername || undefined,
  });

  if (!result.success) {
    const first = result.error.issues[0];
    errorTo(first ? `${String(first.path[0])}: ${first.message}` : "Invalid input");
  }

  const { full_name, username } = result.data;

  if (!full_name && !username) {
    errorTo("Nothing to update");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...(full_name ? { full_name } : {}),
      ...(username ? { username } : {}),
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
