import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Card, SectionLabel } from "@/components/ui/card";
import { ContributorTag } from "@/components/contributor-tag";
import { MarkDoneButton } from "@/components/mark-done-button";

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: skill } = await supabase
    .from("skills")
    .select(
      "id, slug, title, description, url, publisher, category, department, created_at, contributor:profiles(full_name, username, email)",
    )
    .eq("slug", slug)
    .single();

  if (!skill) notFound();

  const [usesRes, myUseRes] = await Promise.all([
    supabase
      .from("skill_uses")
      .select("user:profiles(full_name, username)")
      .eq("skill_id", skill.id)
      .order("used_at", { ascending: false })
      .limit(20),
    supabase
      .from("skill_uses")
      .select("id", { head: true, count: "exact" })
      .eq("skill_id", skill.id)
      .eq("user_id", user.id),
  ]);

  const alreadyUsed = (myUseRes.count ?? 0) > 0;
  const uses = usesRes.data ?? [];

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/skills"
            className="text-sm text-muted-foreground hover:text-bead-blue"
          >
            ← All skills
          </Link>
          {skill.category && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {skill.category}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{skill.title}</h1>
        {skill.publisher && (
          <p className="text-sm text-muted-foreground">by {skill.publisher}</p>
        )}
        <p className="max-w-2xl text-muted-foreground">{skill.description}</p>
        {skill.contributor && (
          <div className="flex flex-wrap items-center gap-2">
            <ContributorTag contributor={skill.contributor} />
            <span className="text-xs text-muted-foreground">
              {skill.contributor.email}
            </span>
          </div>
        )}
      </header>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <a
          href={skill.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Open on {new URL(skill.url).hostname.replace(/^www\./, "")}
        </a>
        <MarkDoneButton
          contentType="skill"
          contentKey={skill.id}
          alreadyDone={alreadyUsed}
        />
      </Card>

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
