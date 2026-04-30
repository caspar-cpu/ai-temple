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

export default async function PluginsPage({
  searchParams,
}: {
  searchParams: Promise<{ dept?: string; q?: string; sort?: string }>;
}) {
  const { dept, q, sort: sortParam } = await searchParams;
  const sort = resolveSort(sortParam, SORTS, "newest");
  const supabase = await createClient();

  let query = supabase
    .from("plugins")
    .select(
      "id, slug, name, description, department, created_at, contributor:profiles(full_name, username), plugin_uses(count)",
    );

  if (dept) query = query.eq("department", dept);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data: rows } = await query;

  const plugins = (rows ?? []).map((r) => ({
    ...r,
    use_count: extractCount(r.plugin_uses),
  }));

  if (sort === "oldest") {
    plugins.sort((a, b) => a.created_at.localeCompare(b.created_at));
  } else if (sort === "most-used") {
    plugins.sort((a, b) => {
      if (b.use_count !== a.use_count) return b.use_count - a.use_count;
      return b.created_at.localeCompare(a.created_at);
    });
  } else {
    plugins.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const { data: allDepts } = await supabase
    .from("plugins")
    .select("department")
    .not("department", "is", null);
  const departments = Array.from(
    new Set(
      (allDepts ?? []).map((d) => d.department).filter(Boolean) as string[],
    ),
  ).sort();

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <SectionLabel>Plugins</SectionLabel>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            The library
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Anthropic-recommended plugins plus anything we build over time.
          </p>
        </div>
        <Button href="/plugins/submit">Add plugin</Button>
      </header>

      <Card className="bg-primary/5">
        <SectionLabel>Why plugins, and how to install them</SectionLabel>
        <div className="mt-3 space-y-3 text-sm text-foreground/80">
          <p>
            <span className="font-semibold">A plugin is a bundle of skills.</span>{" "}
            When you install a plugin in Claude Cowork, Claude always pulls the
            latest version from a central source (Anthropic&apos;s directory
            for the official ones, GitHub for anything we build).
            Everyone installs once and we all use the same, up-to-date version.
            No copy-pasting prompts around, no stale versions floating in
            different people&apos;s chats.
          </p>
          <p>
            <span className="font-semibold">
              Plugins only work in Claude Cowork, not Claude Chat.
            </span>{" "}
            The browser version at claude.ai has no plugin system. In Claude
            Cowork (the desktop app), open Settings → Plugins → Add marketplace,
            paste a GitHub URL, then install the plugins you want from that
            marketplace. Claude starts using them automatically whenever a task
            matches.
          </p>
          <p>
            <span className="font-semibold">Build your own.</span>{" "}
            The five below are what Anthropic officially publishes. Over time
            we&apos;ll build our own: marketing creative, customer comms, brand
            voice, ops runbooks, ritual programming. If you want to build one
            for your team, start with{" "}
            <a
              href="https://www.datacamp.com/tutorial/how-to-build-claude-code-plugins"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline"
            >
              DataCamp&apos;s plugin-building guide
            </a>{" "}
            and look at{" "}
            <a
              href="https://github.com/anthropics/skills"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline"
            >
              anthropics/skills
            </a>{" "}
            for real examples. Once it&apos;s in a GitHub repo, add it here and
            the whole team can install it in one click.
          </p>
        </div>
      </Card>

      <form className="flex flex-col gap-3 sm:flex-row" action="/plugins">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search plugins"
          aria-label="Search plugins"
          className={`flex-1 ${inputClass}`}
        />
        <select
          name="dept"
          defaultValue={dept ?? ""}
          aria-label="Filter by department"
          className={inputClass + " sm:w-56"}
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
        <Button variant="secondary" type="submit">
          Filter
        </Button>
      </form>

      <SortPills
        basePath="/plugins"
        currentSort={sort}
        defaultSort="newest"
        preserved={{ q, dept }}
        options={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
          { value: "most-used", label: "Most used" },
        ]}
      />

      {plugins.length > 0 ? (
        <>
          <h2 className="sr-only">Plugins</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
          {plugins.map((p) => (
            <li key={p.id}>
              <Link
                href={`/plugins/${p.slug}`}
                className={cn("block h-full", linkFocusRing)}
              >
                <Card className={cn("h-full", cardHoverLift)}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{p.name}</h3>
                    {p.department && (
                      <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {p.department}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <ContributorTag contributor={p.contributor} />
                    <span className="tabular-nums">
                      {p.use_count} {p.use_count === 1 ? "use" : "uses"}
                    </span>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
          </ul>
        </>
      ) : (
        <EmptyContent
          title="No plugins yet"
          body="The library is bare. Add the first plugin to start the collection."
          ctaLabel="Add a plugin"
          ctaHref="/plugins/submit"
        />
      )}
    </div>
  );
}
