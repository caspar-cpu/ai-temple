import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { EmptyContent } from "@/components/empty-content";
import { SortPills, resolveSort } from "@/components/sort-pills";
import { ContributorTag } from "@/components/contributor-tag";
import { cardHoverLift, linkFocusRing } from "@/lib/style";
import { cn, extractCount } from "@/lib/utils";

const SORTS = ["newest", "oldest", "most-used"] as const;

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { category, q, sort: sortParam } = await searchParams;
  const sort = resolveSort(sortParam, SORTS, "newest");
  const supabase = await createClient();

  let query = supabase
    .from("skills")
    .select(
      "id, slug, title, description, url, publisher, category, created_at, contributor:profiles(full_name, username), skill_uses(count)",
    );

  if (category) query = query.eq("category", category);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data: rows } = await query;

  const skills = (rows ?? []).map((r) => ({
    ...r,
    use_count: extractCount(r.skill_uses),
  }));

  if (sort === "oldest") {
    skills.sort((a, b) => a.created_at.localeCompare(b.created_at));
  } else if (sort === "most-used") {
    skills.sort((a, b) => {
      if (b.use_count !== a.use_count) return b.use_count - a.use_count;
      return b.created_at.localeCompare(a.created_at);
    });
  } else {
    skills.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const { data: allCats } = await supabase
    .from("skills")
    .select("category")
    .not("category", "is", null);
  const categories = Array.from(
    new Set(
      (allCats ?? []).map((c) => c.category).filter(Boolean) as string[],
    ),
  ).sort();

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <SectionLabel>Skills</SectionLabel>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            The marketplace
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Links to skills. A skill is a packaged workflow that gives Claude
            a specific expertise, like SEO auditing or UI design review, and
            kicks in automatically when the task matches. Install one from
            Claude Desktop (Settings → Skills) or Claude Code.
          </p>
        </div>
        <Button href="/skills/submit">Add skill</Button>
      </header>

      <form className="flex flex-col gap-3 sm:flex-row" action="/skills">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search skills"
          aria-label="Search skills"
          className={`flex-1 ${inputClass}`}
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          aria-label="Filter by category"
          className={inputClass + " sm:w-56"}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
        <Button variant="secondary" type="submit">
          Filter
        </Button>
      </form>

      <SortPills
        basePath="/skills"
        currentSort={sort}
        defaultSort="newest"
        preserved={{ q, category }}
        options={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
          { value: "most-used", label: "Most used" },
        ]}
      />

      {skills.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {skills.map((s) => (
            <li key={s.id}>
              <Link
                href={`/skills/${s.slug}`}
                className={cn("block h-full", linkFocusRing)}
              >
                <Card className={cn("h-full", cardHoverLift)}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    {s.category && (
                      <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {s.category}
                      </span>
                    )}
                  </div>
                  {s.publisher && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      by {s.publisher}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {s.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <ContributorTag contributor={s.contributor} />
                    <span className="tabular-nums">
                      {s.use_count} {s.use_count === 1 ? "use" : "uses"}
                    </span>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyContent
          title="No skills yet"
          body="The marketplace is bare. Add the first skill to seed the temple."
          ctaLabel="Add a skill"
          ctaHref="/skills/submit"
        />
      )}
    </div>
  );
}
