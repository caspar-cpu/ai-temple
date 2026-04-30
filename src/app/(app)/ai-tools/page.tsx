import Link from "next/link";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Card, SectionLabel } from "@/components/ui/card";
import { cardHoverLift, linkFocusRing } from "@/lib/style";
import { cn } from "@/lib/utils";

type ToolCard = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category_slug: string;
  category_order: number;
  display_order: number;
};

const CATEGORIES: { slug: string; order: number; label: string; blurb: string }[] = [
  {
    slug: "general-assistants",
    order: 1,
    label: "General Assistants",
    blurb: "The frontier model your team reaches for first.",
  },
  {
    slug: "research-writing",
    order: 2,
    label: "Research & Writing",
    blurb: "Reading, drafting and grounded answers with citations.",
  },
  {
    slug: "productivity",
    order: 3,
    label: "Productivity",
    blurb: "Where the work actually lives — wikis, voice, agents.",
  },
  {
    slug: "dev-no-code",
    order: 4,
    label: "Dev & No-Code",
    blurb: "Prompt-to-app builders for non-engineers and engineers.",
  },
  {
    slug: "content-creation",
    order: 5,
    label: "Content Creation",
    blurb: "Avatars, video, decks, newsletters, support bots.",
  },
  {
    slug: "visuals-audio",
    order: 6,
    label: "Visuals & Audio",
    blurb: "Image, video, voice and music generation.",
  },
  {
    slug: "automation",
    order: 7,
    label: "Automation",
    blurb: "Connect apps, run agents, enrich data, scrape the web.",
  },
  {
    slug: "coding-development",
    order: 8,
    label: "Coding & Development",
    blurb: "Editors, agentic CLIs and the skills/plugins ecosystem.",
  },
];

export default async function AiToolsPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const [toolsRes, usesRes] = await Promise.all([
    supabase
      .from("ai_tools")
      .select(
        "id, slug, title, summary, category_slug, category_order, display_order",
      )
      .order("category_order")
      .order("display_order"),
    supabase
      .from("ai_tool_uses")
      .select("ai_tool_id")
      .eq("user_id", user.id),
  ]);

  const tools: ToolCard[] = toolsRes.data ?? [];
  const usedSet = new Set((usesRes.data ?? []).map((u) => u.ai_tool_id));
  const usedCount = usedSet.size;
  const totalCount = tools.length;

  // Group by category, preserving the pyramid order from CATEGORIES.
  const byCategory = new Map<string, ToolCard[]>();
  for (const t of tools) {
    const list = byCategory.get(t.category_slug) ?? [];
    list.push(t);
    byCategory.set(t.category_slug, list);
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>AI Tools</SectionLabel>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            The 2026 field guide
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            A curated reference of the AI marketing &amp; ops stack, organised
            in pyramid order from general assistants down to the coding stack.
            Tap any tool to read what it does, see how Temple of the Sun would
            use it, and tick it off once you&apos;ve actually tried it.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary tabular-nums">
          {usedCount} / {totalCount} tools used
        </span>
      </header>

      {CATEGORIES.map((cat) => {
        const items = byCategory.get(cat.slug) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={cat.slug} className="space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  <span className="text-muted-foreground">{cat.order}.</span>{" "}
                  {cat.label}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {cat.blurb}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {items.filter((t) => usedSet.has(t.id)).length} / {items.length}
              </span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => {
                const used = usedSet.has(t.id);
                return (
                  <li key={t.id}>
                    <Link
                      href={`/ai-tools/${t.slug}`}
                      className={cn("block h-full", linkFocusRing)}
                    >
                      <Card className={cn("h-full", cardHoverLift)}>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-semibold">{t.title}</h3>
                          {used && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                              <Check className="size-3" aria-hidden="true" />
                              Used
                            </span>
                          )}
                        </div>
                        <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                          {t.summary}
                        </p>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
