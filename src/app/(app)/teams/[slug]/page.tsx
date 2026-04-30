import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Card, SectionLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContributorTag } from "@/components/contributor-tag";
import { EmptyContent } from "@/components/empty-content";
import { MarkDoneButton } from "@/components/mark-done-button";
import { getTeam } from "@/lib/teams";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = getTeam(slug);
  if (!team) notFound();

  const user = await getCurrentUser();
  const supabase = await createClient();

  const [articlesRes, readsRes, coursesRes, completionsRes] = await Promise.all([
    supabase
      .from("articles")
      .select(
        "id, title, url, description, author, source, team_order, contributor:profiles(full_name, username)",
      )
      .eq("team", slug)
      .order("team_order", { ascending: true, nullsFirst: false }),
    supabase.from("article_reads").select("article_id").eq("user_id", user.id),
    supabase
      .from("courses")
      .select("id, title, url, description, provider, estimated_hours, team_order")
      .eq("team", slug)
      .order("team_order", { ascending: true, nullsFirst: false }),
    supabase
      .from("course_completions")
      .select("course_id")
      .eq("user_id", user.id),
  ]);

  const readSet = new Set((readsRes.data ?? []).map((r) => r.article_id));
  const completedSet = new Set(
    (completionsRes.data ?? []).map((c) => c.course_id),
  );
  const articles = articlesRes.data ?? [];
  const courses = coursesRes.data ?? [];
  const Icon = team.icon;

  return (
    <div className="space-y-10">
      <header>
        <Link
          href="/teams"
          className="text-sm text-muted-foreground hover:text-bead-blue"
        >
          ← All teams
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="size-6 text-primary" />
          </span>
          <div>
            <SectionLabel>Team specific</SectionLabel>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {team.name}
            </h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {team.description}
        </p>
      </header>

      <section>
        <SectionLabel className="mb-3">Reading, in order</SectionLabel>
        {articles.length === 0 ? (
          <EmptyContent
            title="No articles tagged yet"
            body={`Nothing queued for the ${team.name} team. Tag an article to seed the path.`}
            ctaLabel="Add an article"
            ctaHref="/articles/submit"
          />
        ) : (
          <Card className="p-0">
            <ol className="divide-y divide-border">
              {articles.map((a, i) => {
                const read = readSet.has(a.id);
                return (
                  <li key={a.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-1.5"
                          >
                            <h3 className="text-lg font-semibold tracking-tight group-hover:underline">
                              {a.title}
                            </h3>
                            <ExternalLink className="size-3.5 text-muted-foreground" />
                          </a>
                        </div>
                        <p className="ml-8 mt-1 text-sm text-muted-foreground">
                          {[a.author, a.source].filter(Boolean).join(" · ")}
                        </p>
                        {a.description && (
                          <p className="ml-8 mt-2 text-sm text-foreground/80">
                            {a.description}
                          </p>
                        )}
                        <div className="ml-8 mt-3">
                          <ContributorTag contributor={a.contributor} />
                        </div>
                      </div>
                      <MarkDoneButton
                        contentType="article"
                        contentKey={a.id}
                        alreadyDone={read}
                      />
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
        )}
      </section>

      {courses.length > 0 && (
        <section>
          <SectionLabel className="mb-3">Courses for this team</SectionLabel>
          <ul className="grid gap-4 sm:grid-cols-2">
            {courses.map((c) => {
              const done = completedSet.has(c.id);
              return (
                <li key={c.id}>
                  <Card className="flex h-full flex-col">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5"
                    >
                      <h3 className="font-semibold group-hover:underline">
                        {c.title}
                      </h3>
                      <ExternalLink className="size-3.5 text-muted-foreground" />
                    </a>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[
                        c.provider,
                        c.estimated_hours ? `${c.estimated_hours}h` : undefined,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {c.description && (
                      <p className="mt-3 text-sm text-foreground/80">
                        {c.description}
                      </p>
                    )}
                    <div className="mt-5 flex flex-1 items-end justify-end">
                      <MarkDoneButton
                        contentType="course"
                        contentKey={c.id}
                        alreadyDone={done}
                      />
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <Card className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Missing something? Add a plugin, skill, article, or course for{" "}
            {team.name}.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button href="/plugins/submit" size="sm" variant="secondary">
              Add plugin
            </Button>
            <Button href="/skills/submit" size="sm" variant="secondary">
              Add skill
            </Button>
            <Button href="/articles/submit" size="sm" variant="secondary">
              Add article
            </Button>
            <Button href="/courses/submit" size="sm" variant="secondary">
              Add course
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
