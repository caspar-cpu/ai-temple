"use client";

import { useEffect, useState, useTransition } from "react";
import { X, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/card";
import { TrophyIcon } from "@/components/trophy-icon";
import { cn } from "@/lib/utils";
import {
  loadQuestion,
  submitQuiz,
  markWithoutQuiz,
  type QuizContentType,
} from "@/lib/quiz-actions";

type View =
  | { kind: "loading" }
  | { kind: "ready"; question: string; options: string[] }
  | { kind: "locked"; minutesUntil: number }
  | { kind: "correct" }
  | { kind: "wrong"; minutesUntil: number }
  | { kind: "already_done" }
  | { kind: "error"; message: string }
  | { kind: "no_question" };

function formatLockout(minutes: number) {
  if (minutes >= 60) {
    const h = Math.ceil(minutes / 60);
    return `${h} hour${h === 1 ? "" : "s"}`;
  }
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export function QuizModal({
  open,
  onClose,
  contentType,
  contentKey,
  trophyIcon = "Check",
  trophyTier = "bronze",
  pointsLabel,
  onCorrect,
}: {
  open: boolean;
  onClose: () => void;
  contentType: QuizContentType;
  contentKey: string;
  trophyIcon?: string;
  trophyTier?: "bronze" | "silver" | "gold" | "special";
  pointsLabel: string;
  onCorrect: () => void;
}) {
  const [view, setView] = useState<View>({ kind: "loading" });
  const [selected, setSelected] = useState<number | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Reset view + selection when the modal opens. The setState-in-effect
    // lint flags this, but it's a standard "init on prop change" pattern
    // tied to the `open` lifecycle.
    setView({ kind: "loading" });
    setSelected(null);
    loadQuestion(contentType, contentKey).then(async (r) => {
      if (r.status === "already_done") {
        setView({ kind: "already_done" });
        onCorrect();
        setTimeout(onClose, 800);
      } else if (r.status === "no_question") {
        const m = await markWithoutQuiz(contentType, contentKey);
        if (!m.ok) {
          setView({ kind: "error", message: "Could not mark as done. Please try again." });
          return;
        }
        setView({ kind: "no_question" });
        onCorrect();
        setTimeout(onClose, 800);
      } else if (r.status === "locked") {
        setView({ kind: "locked", minutesUntil: r.minutesUntil });
      } else {
        setView({
          kind: "ready",
          question: r.question,
          options: r.options,
        });
      }
    });
  }, [open, contentType, contentKey, onClose, onCorrect]);

  function handleSubmit() {
    if (selected === null) return;
    start(async () => {
      const r = await submitQuiz(contentType, contentKey, selected);
      if (r.status === "correct") {
        setView({ kind: "correct" });
        onCorrect();
        setTimeout(onClose, 1400);
      } else if (r.status === "wrong") {
        setView({ kind: "wrong", minutesUntil: r.minutesUntil });
      } else if (r.status === "locked") {
        setView({ kind: "locked", minutesUntil: r.minutesUntil });
      } else if (r.status === "already_done") {
        setView({ kind: "already_done" });
        onCorrect();
        setTimeout(onClose, 800);
      } else if (r.status === "error") {
        setView({ kind: "error", message: r.message });
      } else {
        onCorrect();
        setTimeout(onClose, 400);
      }
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {view.kind === "loading" && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading question
          </div>
        )}

        {view.kind === "no_question" && (
          <div className="flex items-center gap-3 py-4">
            <TrophyIcon name={trophyIcon} tier={trophyTier} animate />
            <div>
              <p className="font-semibold">Marked as done.</p>
              <p className="text-sm text-muted-foreground">{pointsLabel}</p>
            </div>
          </div>
        )}

        {view.kind === "locked" && (
          <div className="text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-muted">
              <Lock className="size-5 text-muted-foreground" />
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">
              Come back in {formatLockout(view.minutesUntil)}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You answered this one incorrectly. Re-read or re-watch, then try
              the quiz again after the cooldown.
            </p>
            <Button onClick={onClose} variant="secondary" className="mt-5">
              Close
            </Button>
          </div>
        )}

        {view.kind === "ready" && (
          <div>
            <SectionLabel>Quick check</SectionLabel>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">
              {view.question}
            </h3>
            <ol className="mt-5 space-y-2">
              {view.options.map((opt, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                      selected === i
                        ? "border-bead-blue bg-bead-blue/5"
                        : "border-border hover:border-foreground/40",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        selected === i
                          ? "border-bead-blue bg-bead-blue text-pearl"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Get it wrong and you&apos;re locked out for 24 hours.
              </p>
              <Button
                onClick={handleSubmit}
                disabled={selected === null || pending}
              >
                {pending ? "Checking" : "Submit answer"}
              </Button>
            </div>
          </div>
        )}

        {view.kind === "correct" && (
          <div className="flex items-center gap-3 py-4">
            <TrophyIcon name={trophyIcon} tier={trophyTier} animate />
            <div>
              <p className="font-semibold">Correct.</p>
              <p className="text-sm text-muted-foreground">{pointsLabel}</p>
            </div>
          </div>
        )}

        {view.kind === "wrong" && (
          <div className="text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-5 text-destructive" />
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">
              Not quite.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You can try again in {formatLockout(view.minutesUntil)}. Go back
              to the material first.
            </p>
            <Button onClick={onClose} variant="secondary" className="mt-5">
              Close
            </Button>
          </div>
        )}

        {view.kind === "already_done" && (
          <div className="flex items-center gap-3 py-4">
            <TrophyIcon name={trophyIcon} tier={trophyTier} />
            <div>
              <p className="font-semibold">Already marked as done.</p>
              <p className="text-sm text-muted-foreground">
                You ticked this off earlier. No extra points this time.
              </p>
            </div>
          </div>
        )}

        {view.kind === "error" && (
          <div className="text-center">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-5 text-destructive" />
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">
              Something went wrong.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {view.message}
            </p>
            <Button onClick={onClose} variant="secondary" className="mt-5">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
