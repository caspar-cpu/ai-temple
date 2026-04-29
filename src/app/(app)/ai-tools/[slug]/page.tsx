import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Card, SectionLabel } from "@/components/ui/card";
import { MarkDoneButton } from "@/components/mark-done-button";

const CATEGORY_LABELS: Record<string, string> = {
  "general-assistants": "General Assistants",
  "research-writing": "Research & Writing",
  productivity: "Productivity",
  "dev-no-code": "Dev & No-Code",
  "content-creation": "Content Creation",
  "visuals-audio": "Visuals & Audio",
  automation: "Automation",
  "coding-development": "Coding & Development",
};

export default async function AiToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: tool } = await supabase
    .from("ai_tools")
    .select(
      "id, slug, title, summary, body_md, founded, url, category_slug, created_at",
    )
    .eq("slug", slug)
    .single();

  if (!tool) notFound();

  const [usesRes, myUseRes] = await Promise.all([
    supabase
      .from("ai_tool_uses")
      .select("user:profiles(full_name, username)")
      .eq("ai_tool_id", tool.id)
      .order("used_at", { ascending: false })
      .limit(20),
    supabase
      .from("ai_tool_uses")
      .select("id", { head: true, count: "exact" })
      .eq("ai_tool_id", tool.id)
      .eq("user_id", user.id),
  ]);

  const alreadyUsed = (myUseRes.count ?? 0) > 0;
  const uses = usesRes.data ?? [];
  const categoryLabel = CATEGORY_LABELS[tool.category_slug] ?? tool.category_slug;
  const hostname = (() => {
    try {
      return new URL(tool.url).hostname.replace(/^www\./, "");
    } catch {
      return tool.url;
    }
  })();

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/ai-tools"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← All AI tools
          </Link>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {categoryLabel}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{tool.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{tool.summary}</p>
        {tool.founded && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">Founded:</span>{" "}
            {tool.founded}
          </p>
        )}
      </header>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
        >
          <ExternalLink className="size-4" />
          Open on {hostname}
        </a>
        <MarkDoneButton
          contentType="ai_tool"
          contentKey={tool.id}
          alreadyDone={alreadyUsed}
        />
      </Card>

      <section>
        <SectionLabel className="mb-3">About this tool</SectionLabel>
        <Card className="px-8 py-6">
          <div className="prose-article">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {tool.body_md}
            </ReactMarkdown>
          </div>
        </Card>
      </section>

      {uses.length > 0 && (
        <section>
          <SectionLabel className="mb-3">Who&apos;s used this</SectionLabel>
          <ul className="flex flex-wrap gap-2">
            {uses.map((u, i) =>
              u.user ? (
                <li key={i}>
                  <Link
                    href={`/u/${u.user.username}`}
                    className="rounded-full bg-muted px-3 py-1 text-xs text-foreground/80 transition hover:bg-muted/60"
                  >
                    {u.user.full_name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      )}
    </article>
  );
}
