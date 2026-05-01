import { ExternalLink } from "lucide-react";
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
import { POD_VIDEO_URL_PATTERNS } from "@/lib/media-kind";

const SORTS = ["newest", "oldest", "most-read"] as const;

const POD_VIDEO_OR_FILTER = POD_VIDEO_URL_PATTERNS
  .map((p) => `url.ilike.${p}`)
  .join(",");

export default async function PodsVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string; sort?: string }>;
}) {
  const { q, source, sort: sortParam } = await searchParams;
  const sort = resolveSort(sortParam, SORTS, "newest");

  const user = await getCurrentUser();
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select(
      "id, title, url, description, author, source, created_at, contributor:profiles(full_name, username), article_reads(count)",
    )
    .or(POD_VIDEO_OR_FILTER);

  if (source) query = query.eq("source", source);
  if (q) query = query.ilike("title", `%${q}%`);

  const allSourcesQuery = supabase
    .from("articles")
    .select("source")
    .not("source", "is", null)
    .or(POD_VIDEO_OR_FILTER);

  const [articlesRes, readsRes, allSourcesRes] = await Promise.all([
    query,
    supabase.from("article_reads").select("article_id").eq("user_id", user.id),
    allSourcesQuery,
  ]);

  const readSet = new Set((readsRes.data ?? []).map((r) => r.article_id));

  const articles = (articlesRes.data ?? []).map((a) => ({
    ...a,
    read_count: extractCount(a.article_reads),
  }));

  if (sort === "oldest") {
    articles.sort((a, b) => a.created_at.localeCompare(b.created_at));
  } else if (sort === "most-read") {
    articles.sort((a, b) => {
      if (b.read_count !== a.read_count) return b.read_count - a.read_count;
      return b.created_at.localeCompare(a.created_at);
    });
  } else {
    articles.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const sources = Array.from(
    new Set(
      (allSourcesRes.data ?? [])
        .map((r) => r.source)
        .filter(Boolean) as string[],
    ),
  ).sort();

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <SectionLabel>Pods & Videos</SectionLabel>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            The listening room
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Podcasts and videos worth your commute. Tick when you&apos;ve
            listened or watched.
          </p>
        </div>
        <Button href="/articles/submit">Add a pod or video</Button>
      </header>

      <form className="flex flex-col gap-3 sm:flex-row" action="/pods-videos">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search pods & videos"
          aria-label="Search pods & videos"
          className={`flex-1 ${inputClass}`}
        />
        <select
          name="source"
          defaultValue={source ?? ""}
          aria-label="Filter by source"
          className={inputClass + " sm:w-56"}
        >
          <option value="">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
        <Button variant="secondary" type="submit">
          Filter
        </Button>
      </form>

      <SortPills
        basePath="/pods-videos"
        currentSort={sort}
        defaultSort="newest"
        preserved={{ q, source }}
        options={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
          { value: "most-read", label: "Most listened" },
        ]}
      />

      {articles.length === 0 ? (
        <EmptyContent
          title="No pods or videos match"
          body="Try a different filter, or contribute one to the listening room."
          ctaLabel="Add a pod or video"
          ctaHref="/articles/submit"
        />
      ) : (
        <>
          <h2 className="sr-only">Pods & Videos</h2>
          <Card className="p-0">
            <ul className="divide-y divide-border">
              {articles.map((a) => {
                const read = readSet.has(a.id);
                return (
                  <li key={a.id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-1.5"
                        >
                          <h3 className="text-lg font-semibold tracking-tight group-hover:underline">
                            {a.title}
                          </h3>
                          <ExternalLink
                            className="size-3.5 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </a>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[a.author, a.source].filter(Boolean).join(" · ")}
                        </p>
                        {a.description && (
                          <p className="mt-3 text-sm text-foreground/80">
                            {a.description}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <ContributorTag contributor={a.contributor} />
                          <span className="tabular-nums">
                            {a.read_count}{" "}
                            {a.read_count === 1 ? "listen" : "listens"}
                          </span>
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
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
