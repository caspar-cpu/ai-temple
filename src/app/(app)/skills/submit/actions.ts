"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { parseQuizFields } from "@/components/quiz-fields";

const Schema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(5).max(2000),
  url: z.url(),
  publisher: z.string().max(200).optional().nullable(),
  category: z.string().max(200).optional().nullable(),
  department: z.string().max(200).optional().nullable(),
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
 * Insert a skill row, optionally with a quick-check quiz. Same shape
 * as `submitPlugin` (Zod → unique slug → insert → optional quiz row →
 * redirect to /skills/[slug]). Validation errors come back via
 * `?error=` on the submit page.
 */
export async function submitSkill(formData: FormData) {
  const result = Schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    url: formData.get("url"),
    publisher: formData.get("publisher") || null,
    category: formData.get("category") || null,
    department: formData.get("department") || null,
  });

  if (!result.success) {
    errorTo("/skills/submit", firstIssueMessage(result.error));
  }
  const parsed = result.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const baseSlug = slugify(parsed.title);
  let slug = baseSlug || "skill";
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("skills")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug || "skill"}-${suffix++}`;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("skills")
    .insert({
      slug,
      title: parsed.title,
      description: parsed.description,
      url: parsed.url,
      publisher: parsed.publisher,
      category: parsed.category,
      department: parsed.department,
      contributor_id: user.id,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    errorTo(
      "/skills/submit",
      insertError?.message ?? "Could not save the skill. Please try again.",
    );
  }

  const quiz = parseQuizFields(formData);
  if (quiz) {
    await supabase.from("content_questions").insert({
      content_type: "skill",
      content_key: inserted.id,
      question: quiz.question,
      options: quiz.options,
      correct_index: quiz.correctIndex,
      created_by: user.id,
    });
  }

  redirect(`/skills/${slug}`);
}
