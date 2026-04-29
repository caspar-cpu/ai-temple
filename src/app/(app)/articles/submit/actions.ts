"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseQuizFields } from "@/components/quiz-fields";

const Schema = z.object({
  title: z.string().min(2).max(300),
  url: z.url(),
  description: z.string().max(2000).optional().nullable(),
  author: z.string().max(200).optional().nullable(),
  source: z.string().max(200).optional().nullable(),
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

export async function submitArticle(formData: FormData) {
  const result = Schema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description") || null,
    author: formData.get("author") || null,
    source: formData.get("source") || null,
  });

  if (!result.success) {
    errorTo("/articles/submit", firstIssueMessage(result.error));
  }
  const parsed = result.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: inserted, error: insertError } = await supabase
    .from("articles")
    .insert({
      title: parsed.title,
      url: parsed.url,
      description: parsed.description,
      author: parsed.author,
      source: parsed.source,
      contributor_id: user.id,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    errorTo(
      "/articles/submit",
      insertError?.message ?? "Could not save the article. Please try again.",
    );
  }

  const quiz = parseQuizFields(formData);
  if (quiz) {
    await supabase.from("content_questions").insert({
      content_type: "article",
      content_key: inserted.id,
      question: quiz.question,
      options: quiz.options,
      correct_index: quiz.correctIndex,
      created_by: user.id,
    });
  }

  redirect("/articles");
}
