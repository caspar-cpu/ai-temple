import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { fetchSkillMarkdown } from "@/lib/github";
import { CopyButton } from "@/components/copy-button";
import { Card, SectionLabel } from "@/components/ui/card";
import { ContributorTag } from "@/components/contributor-tag";
import { MarkDoneButton } from "@/components/mark-done-button";

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: plugin } = await supabase
    .from("plugins")
    .select(
      "id, slug, name, description, github_url, install_command, invocation_prompt, example_search, department, created_at, contributor:profiles(full_name, username, email)",
    )
    .eq("slug", slug)
    .single();

  if (!plugin) notFound();

  const [usesRes, myUseRes, markdown] = await Promise.all([
    supabase
      .from("plugin_uses")
      .select("user:profiles(full_name, username)")
      .eq("plugin_id", plugin.id)
      .order("used_at", { ascending: false })
      .limit(20),
    supabase
      .from("plugin_uses")
      .select("id", { head: true, count: "exact" })
      .eq("plugin_id", plugin.id)
      .eq("user_id", user.id),
    fetchSkillMarkdown(plugin.github_url),
  ]);

  const alreadyUsed = (myUseRes.count ?? 0) > 0;
  const uses = usesRes.data ?? [];

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Link
            href="/plugins"
            className="text-sm text-muted-foreground hover:text-bead-blue"
          >
            ← All plugins
          </Link>
          {plugin.department && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {plugin.department}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{plugin.name}</h1>
        <p className="max-w-2xl text-muted-foreground">{plugin.description}</p>
        {plugin.contributor && (
          <div className="flex flex-wrap items-center gap-2">
            <ContributorTag contributor={plugin.contributor} />
            <span className="text-xs text-muted-foreground">
              {plugin.contributor.email}
            </span>
          </div>
        )}
      </header>

      <Card className="space-y-4">
        <Row label="Install command" value={plugin.install_command} mono />
        <Row label="Invocation prompt" value={plugin.invocation_prompt} mono />
        {plugin.example_search && (
          <Row label="Example to trigger it" value={plugin.example_search} />
        )}
        <div className="flex items-center justify-between border-t border-border pt-4">
          {plugin.github_url ? (
            <a
              href={plugin.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-bead-blue"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              View on GitHub
            </a>
          ) : (
            <span className="text-xs text-muted-foreground">
              Install from inside Claude Cowork.
            </span>
          )}
          <MarkDoneButton
            contentType="plugin"
            contentKey={plugin.id}
            alreadyDone={alreadyUsed}
          />
        </div>
      </Card>

      {markdown && plugin.github_url && (
        <section aria-labelledby="skill-md-heading">
          <h2 id="skill-md-heading" className="sr-only">
            SKILL.md content
          </h2>
          <SectionLabel className="mb-3">SKILL.md (live from GitHub)</SectionLabel>
          <Card className="px-8 py-6">
            <div className="prose-article">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: "h3",
                  h2: "h3",
                  h3: "h4",
                  h4: "h5",
                  h5: "h6",
                  h6: "h6",
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </Card>
        </section>
      )}

      {uses.length > 0 && (
        <section aria-labelledby="plugin-uses-heading">
          <h2 id="plugin-uses-heading" className="sr-only">
            Who has used this plugin
          </h2>
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

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex items-start gap-3">
        <pre
          className={
            "flex-1 overflow-x-auto rounded-md bg-muted px-3 py-2 text-sm " +
            (mono ? "font-mono" : "whitespace-pre-wrap font-sans")
          }
        >
          {value}
        </pre>
        <CopyButton text={value} />
      </div>
    </div>
  );
}
