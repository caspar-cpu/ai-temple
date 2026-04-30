"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuizModal } from "@/components/quiz-modal";
import { TrophyIcon } from "@/components/trophy-icon";
import { POINTS, TROPHY_META, type TrophyKind } from "@/lib/points";
import type { QuizContentType } from "@/lib/quiz-actions";
import { cn } from "@/lib/utils";

type ButtonStyle = {
  variant: "primary" | "secondary" | "tertiary";
  size: "md" | "sm";
};

type Config = {
  cta: string;
  done: string;
  trophyKind: TrophyKind;
  style: ButtonStyle;
};

const CONFIGS: Record<QuizContentType, Config> = {
  plugin: {
    cta: "I've used this",
    done: "Marked as used",
    trophyKind: "plugin_used",
    style: { variant: "primary", size: "md" },
  },
  skill: {
    cta: "I've used this",
    done: "Marked as used",
    trophyKind: "skill_used",
    style: { variant: "primary", size: "md" },
  },
  course: {
    cta: "Mark completed",
    done: "Completed",
    trophyKind: "course_completed",
    style: { variant: "primary", size: "sm" },
  },
  article: {
    cta: "Mark as read",
    done: "Read",
    trophyKind: "article_read",
    style: { variant: "tertiary", size: "sm" },
  },
  journey_step: {
    cta: "Mark as done",
    done: "Done",
    trophyKind: "journey_step",
    style: { variant: "tertiary", size: "sm" },
  },
  ai_tool: {
    cta: "I've used this",
    done: "Marked as used",
    trophyKind: "ai_tool_used",
    style: { variant: "primary", size: "md" },
  },
};

/**
 * The "Mark as done / I've used this" affordance. Owns the quiz-modal
 * lifecycle: opens on click, awards a trophy (via QuizModal's server
 * action) when the user passes the quiz, and replaces the button with
 * a tier-coloured "done" pill that runs the just-mined animation. The
 * `cta`/`done` copy and `trophyKind` come from a per-content-type config.
 */
export function MarkDoneButton({
  contentType,
  contentKey,
  alreadyDone,
  variant,
  size,
}: {
  contentType: QuizContentType;
  contentKey: string;
  alreadyDone: boolean;
  variant?: ButtonStyle["variant"];
  size?: ButtonStyle["size"];
}) {
  const [open, setOpen] = useState(false);
  const [justDone, setJustDone] = useState(false);
  const cfg = CONFIGS[contentType];
  const meta = TROPHY_META[cfg.trophyKind];
  const btnVariant = variant ?? cfg.style.variant;
  const btnSize = size ?? cfg.style.size;
  const isDone = alreadyDone || justDone;

  if (isDone) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 font-medium text-primary",
          btnSize === "md"
            ? "h-10 gap-2 px-4 text-sm"
            : "h-8 px-3 text-xs",
          justDone && "animate-just-mined",
        )}
      >
        <TrophyIcon name={meta.icon} tier={meta.tier} size="sm" />
        {cfg.done}
      </span>
    );
  }

  return (
    <>
      <Button
        variant={btnVariant}
        size={btnSize}
        onClick={() => setOpen(true)}
        className="shrink-0"
      >
        {cfg.cta}
      </Button>
      <QuizModal
        open={open}
        onClose={() => setOpen(false)}
        contentType={contentType}
        contentKey={contentKey}
        trophyIcon={meta.icon}
        trophyTier={meta.tier}
        pointsLabel={`+${POINTS[cfg.trophyKind]} points`}
        onCorrect={() => setJustDone(true)}
      />
    </>
  );
}
