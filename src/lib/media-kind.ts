// URL host patterns that mark a row in `articles` as a podcast or video
// rather than a written article. Used by /pods-videos to include and
// /articles to exclude. ilike-friendly (already wrapped in %).
export const POD_VIDEO_URL_PATTERNS = [
  "%youtube.com%",
  "%youtu.be%",
  "%open.spotify.com%",
  "%share.snipd.com%",
  "%snipd.com%",
  "%podcasts.apple.com%",
  "%pca.st%",
  "%overcast.fm%",
  "%pocketcasts.com%",
];
