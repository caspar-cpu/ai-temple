import { ExternalLink, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { EmptyContent } from "@/components/empty-content";
import { SortPills, resolveSort } from "@/components/sort-pills";
import { ContributorTag } from "@/components/contributor-tag";
import { MarkDoneButton } from "@/components/mark-done-button";
import { extractCount } from "@/lib/utils";

const SORTS = ["newest", "oldest", "most-completed"] as const;

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; provider?: string; sort?: string }>;
}) {
  const { q, provider, sort: sortParam } = await searchParams;
  const sort = resolveSort(sortParam, SORTS, "newest");

  const user = await getCurrentUser();
  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select(
      "id, title, url, description, provider, estimated_hours, created_at, contributor:profiles(full_name, username), course_completions(count)",
    );

  if (provider) query = query.eq("provider", provider);
  if (q) query = query.ilike("title", `%${q}%`);

  const [coursesRes, completionsRes, allProvidersRes] = await Promise.all([
    query,
    supabase
      .from("course_completions")
      .select("course_id")
      .eq("user_id", user.id),
    supabase.from("courses").select("provider").not("provider", "is", null),
  ]);

  const completedSet = new Set(
    (completionsRes.data ?? []).map((c) => c.course_id),
  );

  const courses = (coursesRes.data ?? []).map((c) => ({
    ...c,
    completion_count: extractCount(c.course_completions),
  }));

  if (sort === "oldest") {
    courses.sort((a, b) => a.created_at.localeCompare(b.created_at));
  } else if (sort === "most-completed") {
    courses.sort((a, b) => {
      if (b.completion_count !== a.completion_count)
        return b.completion_count - a.completion_count;
      return b.created_at.localeCompare(a.created_at);
    });
  } else {
    courses.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const providers = Array.from(
    new Set(
      (allProvidersRes.data ?? [])
        .map((r) => r.provider)
        .filter(Boolean) as string[],
    ),
  ).sort();

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <SectionLabel>Courses</SectionLabel>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            The classroom
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Finishing a course is worth 100 points.
          </p>
        </div>
        <Button href="/courses/submit">Add course</Button>
      </header>

      <form className="flex flex-col gap-3 sm:flex-row" action="/courses">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search courses"
          aria-label="Search courses"
          className={`flex-1 ${inputClass}`}
        />
        <select
          name="provider"
          defaultValue={provider ?? ""}
          aria-label="Filter by provider"
          className={inputClass + " sm:w-56"}
        >
          <option value="">All providers</option>
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
        <Button variant="secondary" type="submit">
          Filter
        </Button>
      </form>

      <SortPills
        basePath="/courses"
        currentSort={sort}
        defaultSort="newest"
        preserved={{ q, provider }}
        options={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
          { value: "most-completed", label: "Most completed" },
        ]}
      />

      {courses.length === 0 ? (
        <EmptyContent
          title="No courses match"
          body="Try a different filter, or add a course you've taken."
          ctaLabel="Add a course"
          ctaHref="/courses/submit"
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {courses.map((c) => {
            const done = completedSet.has(c.id);
            return (
              <li key={c.id}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-start gap-2">
                    <GraduationCap
                      className="mt-0.5 size-5 text-primary"
                      aria-hidden="true"
                    />
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex-1 inline-flex items-center gap-1.5"
                    >
                      <h3 className="font-semibold group-hover:underline">
                        {c.title}
                      </h3>
                      <ExternalLink
                        className="size-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
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
                  <div className="mt-5 flex flex-1 items-end justify-between gap-3">
                    <div className="flex flex-col items-start gap-1.5 text-xs text-muted-foreground">
                      <ContributorTag contributor={c.contributor} />
                      <span className="tabular-nums">
                        {c.completion_count}{" "}
                        {c.completion_count === 1 ? "completion" : "completions"}
                      </span>
                    </div>
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
      )}
    </div>
  );
}
