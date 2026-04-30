"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { parseQuizFields } from "@/components/quiz-fields";

const Schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(5).max(2000),
  github_url: z.string().optional().nullable(),
  install_command: z.string().min(2).max(1000),
  invocation_prompt: z.string().min(2).max(2000),
  example_search: z.string().max(1000).optional().nullable(),
  department: z.string().max(120).optional().nullable(),
});

function errorTo(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function firstIssueMessage(
  error: z.ZodError,
  fallback = "Invalid input",
): string {
  const issue = error.issues[0];
  if (!issue) return fallback;
  const field = issue.path[0] ? String(issue.path[0]) : "";
  return field ? `${field}: ${issue.message}` : issue.message;
}

/**
 * Insert a plugin row, optionally with a quick-check quiz. Steps:
 * Zod-validate → resolve a unique slug (suffix `-2`, `-3`, … on
 * collision) → insert plugin → insert content_questions row if quiz
 * fields were filled → redirect to the new detail page. On any
 * validation/insert failure, redirects back to the submit form with
 * `?error=` set so the page can render the message.
 */
export async function submitPlugin(formData: FormData) {
  const result = Schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    github_url:
      ((formData.get("github_url") as string | null) ?? "").trim() || null,
    install_command: formData.get("install_command"),
    invocation_prompt: formData.get("invocation_prompt"),
    example_search: formData.get("example_search") || null,
    department: formData.get("department") || null,
  });

  if (!result.success) {
    errorTo("/plugins/submit", firstIssueMessage(result.error));
  }
  const parsed = result.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const baseSlug = slugify(parsed.name);
  let slug = baseSlug || "plugin";
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("plugins")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug || "plugin"}-${suffix++}`;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("plugins")
    .insert({
      slug,
      name: parsed.name,
      description: parsed.description,
      github_url: parsed.github_url,
      install_command: parsed.install_command,
      invocation_prompt: parsed.invocation_prompt,
      example_search: parsed.example_search,
      department: parsed.department,
      contributor_id: user.id,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    errorTo(
      "/plugins/submit",
      insertError?.message ?? "Could not save the plugin. Please try again.",
    );
  }

  const quiz = parseQuizFields(formData);
  if (quiz) {
    await supabase.from("content_questions").insert({
      content_type: "plugin",
      content_key: inserted.id,
      question: quiz.question,
      options: quiz.options,
      correct_index: quiz.correctIndex,
      created_by: user.id,
    });
  }

  redirect(`/plugins/${slug}`);
}
