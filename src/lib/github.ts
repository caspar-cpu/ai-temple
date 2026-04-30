/**
 * Convert a `https://github.com/owner/repo/blob/<ref>/path` URL into
 * the matching `https://raw.githubusercontent.com/...` URL. Returns
 * null for any other shape (gist, non-github host, malformed). Used
 * to fetch SKILL.md previews on plugin/skill detail pages.
 */
export function githubRawUrl(githubUrl: string): string | null {
  try {
    const url = new URL(githubUrl);
    if (url.hostname !== "github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 5 || parts[2] !== "blob") return null;
    const [owner, repo, , ref, ...rest] = parts;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${rest.join("/")}`;
  } catch {
    return null;
  }
}

/**
 * Fetch the raw markdown for a github blob URL with a 5-minute
 * Next.js fetch cache. Returns null on any failure (bad URL, 404,
 * network error) so callers can render a graceful empty state.
 */
export async function fetchSkillMarkdown(
  githubUrl: string | null | undefined,
): Promise<string | null> {
  if (!githubUrl) return null;
  const raw = githubRawUrl(githubUrl);
  if (!raw) return null;
  try {
    const res = await fetch(raw, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}
