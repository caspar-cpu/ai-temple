"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseQuizFields } from "@/components/quiz-fields";

const Schema = z.object({
  title: z.string().min(2).max(300),
  url: z.url(),
  description: z.string().max(2000).optional().nullable(),
  provider: z.string().max(200).optional().nullable(),
  estimated_hours: z.coerce.number().positive().optional().nullable(),
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
 * Insert a course row, optionally with a quick-check quiz. Same
 * shape as `submitPlugin` (Zod → unique slug → insert → optional quiz
 * row → redirect to /courses/[slug]).
 */
export async function submitCourse(formData: FormData) {
  const result = Schema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") || null,
    provider: formData.get("provider") || null,
    estimated_hours: formData.get("estimated_hours") || null,
  });

  if (!result.success) {
    errorTo("/courses/submit", firstIssueMessage(result.error));
  }
  const parsed = result.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: inserted, error: insertError } = await supabase
    .from("courses")
    .insert({
      title: parsed.title,
      url: parsed.url,
      description: parsed.description,
      provider: parsed.provider,
      estimated_hours: parsed.estimated_hours,
      contributor_id: user.id,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    errorTo(
      "/courses/submit",
      insertError?.message ?? "Could not save the course. Please try again.",
    );
  }

  const quiz = parseQuizFields(formData);
  if (quiz) {
    await supabase.from("content_questions").insert({
      content_type: "course",
      content_key: inserted.id,
      question: quiz.question,
      options: quiz.options,
      correct_index: quiz.correctIndex,
      created_by: user.id,
    });
  }

  redirect("/courses");
}
