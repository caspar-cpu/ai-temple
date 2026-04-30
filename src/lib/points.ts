/**
 * Source-of-truth list of every trophy kind. The matching enum lives
 * in the database (`user_trophies.kind` check constraint + the
 * `award_trophy` trigger) — adding a kind here without a migration
 * will fail at insert. Keep this array, the DB enum, and TROPHY_META
 * in lockstep.
 */
export const TROPHY_KINDS = [
  "plugin_used",
  "plugin_contributed",
  "plugin_widely_used",
  "article_read",
  "article_contributed",
  "course_completed",
  "course_contributed",
  "first_plugin",
  "plugins_5",
  "plugins_10",
  "plugins_25",
  "journey_step",
  "journey_completed",
  "skill_used",
  "skill_contributed",
  "ai_tool_used",
] as const;

export type TrophyKind = (typeof TROPHY_KINDS)[number];
export type TrophyTier = "bronze" | "silver" | "gold" | "special";

export const POINTS: Record<TrophyKind, number> = {
  plugin_used: 25,
  plugin_contributed: 50,
  plugin_widely_used: 150,
  article_read: 10,
  article_contributed: 5,
  course_completed: 100,
  course_contributed: 5,
  first_plugin: 20,
  plugins_5: 50,
  plugins_10: 100,
  plugins_25: 200,
  journey_step: 5,
  journey_completed: 100,
  skill_used: 20,
  skill_contributed: 30,
  ai_tool_used: 20,
};

export const TROPHY_META: Record<
  TrophyKind,
  { label: string; icon: string; tier: TrophyTier; description: string }
> = {
  plugin_used: {
    label: "Plugin applied",
    icon: "Zap",
    tier: "silver",
    description: "Applied a plugin in your AI tool — silver nugget added.",
  },
  plugin_contributed: {
    label: "Plugin contributed",
    icon: "Wrench",
    tier: "gold",
    description: "Added a new plugin to the temple — gold nugget.",
  },
  plugin_widely_used: {
    label: "Ruby of impact",
    icon: "Ruby",
    tier: "special",
    description: "Your plugin was used by 10 people — uncut ruby.",
  },
  article_read: {
    label: "Article read",
    icon: "BookOpen",
    tier: "bronze",
    description: "Read an AI article from the library — bronze nugget.",
  },
  article_contributed: {
    label: "Article added",
    icon: "FilePlus",
    tier: "bronze",
    description: "Contributed an article to the library — bronze nugget.",
  },
  course_completed: {
    label: "Course completed",
    icon: "GraduationCap",
    tier: "gold",
    description: "Finished a full AI course — gold nugget.",
  },
  course_contributed: {
    label: "Course added",
    icon: "FilePlus",
    tier: "bronze",
    description: "Contributed a course to the library — bronze nugget.",
  },
  first_plugin: {
    label: "Citrine of first light",
    icon: "Citrine",
    tier: "special",
    description: "Your very first plugin use — citrine, the seeker's gem.",
  },
  plugins_5: {
    label: "5 plugins applied",
    icon: "Star",
    tier: "silver",
    description: "Used 5 different plugins — silver nugget.",
  },
  plugins_10: {
    label: "10 plugins applied",
    icon: "Award",
    tier: "gold",
    description: "Used 10 different plugins — gold nugget.",
  },
  plugins_25: {
    label: "Sapphire of mastery",
    icon: "Sapphire",
    tier: "special",
    description: "Used 25 different plugins — uncut sapphire.",
  },
  journey_step: {
    label: "Onboarding step",
    icon: "Check",
    tier: "bronze",
    description: "Ticked off a Start Here step — bronze nugget.",
  },
  journey_completed: {
    label: "Emerald of growth",
    icon: "Emerald",
    tier: "special",
    description: "Finished the full beginner journey — uncut emerald.",
  },
  skill_used: {
    label: "Skill applied",
    icon: "Sparkles",
    tier: "silver",
    description: "Installed and used a marketplace skill — silver nugget.",
  },
  skill_contributed: {
    label: "Skill added",
    icon: "FilePlus",
    tier: "gold",
    description: "Added a marketplace skill to the temple — gold nugget.",
  },
  ai_tool_used: {
    label: "AI tool tried",
    icon: "Sparkles",
    tier: "silver",
    description: "Tried an AI tool from the field guide — silver nugget.",
  },
};

/**
 * Lookup that tolerates unknown kinds (e.g. when the DB has a kind
 * that this client doesn't ship yet, mid-deploy). Falls back to a
 * bronze-tier `Award` icon with the raw kind as the label, so the UI
 * still renders something instead of crashing.
 */
export function trophyMeta(kind: string) {
  return (
    TROPHY_META[kind as TrophyKind] ?? {
      label: kind,
      icon: "Award",
      tier: "bronze" as TrophyTier,
      description: "",
    }
  );
}
