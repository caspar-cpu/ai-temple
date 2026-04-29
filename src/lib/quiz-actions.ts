"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type QuizContentType =
  | "plugin"
  | "article"
  | "course"
  | "journey_step"
  | "skill"
  | "ai_tool";

export type LoadedQuestion =
  | { status: "ready"; question: string; options: string[] }
  | { status: "locked"; minutesUntil: number }
  | { status: "already_done" }
  | { status: "no_question" };

export type SubmitResult =
  | { status: "correct" }
  | { status: "wrong"; minutesUntil: number }
  | { status: "locked"; minutesUntil: number }
  | { status: "already_done" }
  | { status: "error"; message: string }
  | { status: "no_question" };

const LOCKOUT_MS = 24 * 60 * 60 * 1000;

type MarkTarget = {
  table:
    | "plugin_uses"
    | "article_reads"
    | "course_completions"
    | "skill_uses"
    | "journey_step_completions"
    | "ai_tool_uses";
  fk:
    | "plugin_id"
    | "article_id"
    | "course_id"
    | "skill_id"
    | "step_key"
    | "ai_tool_id";
  revalidate: string;
};

const MARK_TARGETS: Record<QuizContentType, MarkTarget> = {
  plugin: { table: "plugin_uses", fk: "plugin_id", revalidate: "/plugins" },
  article: { table: "article_reads", fk: "article_id", revalidate: "/articles" },
  course: {
    table: "course_completions",
    fk: "course_id",
    revalidate: "/courses",
  },
  skill: { table: "skill_uses", fk: "skill_id", revalidate: "/skills" },
  journey_step: {
    table: "journey_step_completions",
    fk: "step_key",
    revalidate: "/start-here",
  },
  ai_tool: { table: "ai_tool_uses", fk: "ai_tool_id", revalidate: "/ai-tools" },
};

type SB = Awaited<ReturnType<typeof createClient>>;

async function isAlreadyDone(
  supabase: SB,
  userId: string,
  contentType: QuizContentType,
  contentKey: string,
): Promise<boolean> {
  const { table, fk } = MARK_TARGETS[contentType];
  // Dynamic column name: Supabase's typed client can't narrow .eq() here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const { count } = await db
    .from(table)
    .select("id", { head: true, count: "exact" })
    .eq("user_id", userId)
    .eq(fk, contentKey);
  return (count ?? 0) > 0;
}

async function lockedMinutes(
  supabase: SB,
  userId: string,
  contentType: QuizContentType,
  contentKey: string,
): Promise<number | null> {
  const cutoff = new Date(Date.now() - LOCKOUT_MS).toISOString();
  const { data } = await supabase
    .from("quiz_attempts")
    .select("attempted_at")
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_key", contentKey)
    .eq("correct", false)
    .gte("attempted_at", cutoff)
    .order("attempted_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  const until = new Date(data.attempted_at).getTime() + LOCKOUT_MS;
  return Math.max(0, Math.ceil((until - Date.now()) / 60_000));
}

async function performMark(
  supabase: SB,
  userId: string,
  contentType: QuizContentType,
  contentKey: string,
): Promise<{ ok: boolean; error?: string }> {
  const { table, fk, revalidate } = MARK_TARGETS[contentType];
  // Dynamic table + fk column: Supabase's typed client can't narrow this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  const { error } = await db
    .from(table)
    .upsert(
      { user_id: userId, [fk]: contentKey },
      { onConflict: `user_id,${fk}`, ignoreDuplicates: true },
    );
  revalidatePath(revalidate);
  revalidatePath("/");
  if (error) {
    console.error("performMark failed", {
      contentType,
      contentKey,
      userId,
      error,
    });
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function loadQuestion(
  contentType: QuizContentType,
  contentKey: string,
): Promise<LoadedQuestion> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "no_question" };

  if (await isAlreadyDone(supabase, user.id, contentType, contentKey)) {
    return { status: "already_done" };
  }

  const { data: q } = await supabase
    .from("content_questions")
    .select("question, options")
    .eq("content_type", contentType)
    .eq("content_key", contentKey)
    .maybeSingle();
  if (!q) return { status: "no_question" };

  const locked = await lockedMinutes(supabase, user.id, contentType, contentKey);
  if (locked !== null) return { status: "locked", minutesUntil: locked };

  return { status: "ready", question: q.question, options: q.options };
}

export async function submitQuiz(
  contentType: QuizContentType,
  contentKey: string,
  answerIndex: number,
): Promise<SubmitResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "no_question" };

  if (await isAlreadyDone(supabase, user.id, contentType, contentKey)) {
    return { status: "already_done" };
  }

  const { data: q } = await supabase
    .from("content_questions")
    .select("correct_index")
    .eq("content_type", contentType)
    .eq("content_key", contentKey)
    .maybeSingle();

  if (!q) {
    const r = await performMark(supabase, user.id, contentType, contentKey);
    if (!r.ok) return { status: "error", message: r.error ?? "Unknown error" };
    return { status: "no_question" };
  }

  const locked = await lockedMinutes(supabase, user.id, contentType, contentKey);
  if (locked !== null) return { status: "locked", minutesUntil: locked };

  const correct = answerIndex === q.correct_index;
  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    content_type: contentType,
    content_key: contentKey,
    correct,
  });

  if (correct) {
    const r = await performMark(supabase, user.id, contentType, contentKey);
    if (!r.ok) return { status: "error", message: r.error ?? "Unknown error" };
    return { status: "correct" };
  }
  return { status: "wrong", minutesUntil: 24 * 60 };
}

export async function markWithoutQuiz(
  contentType: QuizContentType,
  contentKey: string,
): Promise<{ ok: boolean; alreadyDone?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  if (await isAlreadyDone(supabase, user.id, contentType, contentKey)) {
    return { ok: true, alreadyDone: true };
  }

  const { data: q } = await supabase
    .from("content_questions")
    .select("id")
    .eq("content_type", contentType)
    .eq("content_key", contentKey)
    .maybeSingle();
  if (q) return { ok: false };

  const r = await performMark(supabase, user.id, contentType, contentKey);
  return { ok: r.ok };
}
