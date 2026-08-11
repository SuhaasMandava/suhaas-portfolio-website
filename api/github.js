// ============================================================
//  /api/github  —  recent public GitHub activity for the home page.
//
//  Runs server-side on Vercel so the page can keep its strict
//  Content-Security-Policy (connect-src 'self'): the browser only
//  ever calls this site, and this function calls GitHub.
//
//  No API key is required. Public repository data works
//  unauthenticated, and the edge cache below keeps this far under
//  the rate limit. Setting a GITHUB_TOKEN env var is optional and
//  only raises that limit; nothing here depends on it.
//
//  Note: this deliberately uses the repos endpoint rather than
//  /events. The events API no longer includes commit messages in
//  push payloads, and "which projects am I actively working on"
//  is a better signal for a portfolio than a list of commits
//  against this one site anyway.
// ============================================================

const USER = "SuhaasMandava";
const LIMIT = 4;

// Repo descriptions are written on GitHub, outside this codebase, so they can
// carry punctuation the rest of the site avoids. Normalise dashes to a comma
// so nothing pulled in from outside reintroduces an em dash.
function clean(text) {
  return (text || "")
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function handler(req, res) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER + "-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = "Bearer " + process.env.GITHUB_TOKEN;
  }

  try {
    const r = await fetch(
      `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=20`,
      { headers }
    );
    if (!r.ok) {
      res.status(502).json({ error: "GitHub request failed" });
      return;
    }
    const all = await r.json();
    if (!Array.isArray(all)) {
      res.status(502).json({ error: "Unexpected response" });
      return;
    }

    const repos = all
      // Skip forks and the special profile-README repo, which is named after
      // the account and is not a project.
      .filter((repo) => !repo.fork && repo.name.toLowerCase() !== USER.toLowerCase())
      .slice(0, LIMIT)
      .map((repo) => ({
        repo: repo.name,
        url: repo.html_url,
        description: clean(repo.description),
        language: repo.language || "",
        at: repo.pushed_at,
      }));

    // Cache at the edge: every visitor in a 10 minute window shares one
    // upstream request, so the unauthenticated limit is never a concern.
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1800");
    res.status(200).json({
      repos,
      latest: repos.length ? repos[0].at : null,
      profile: "https://github.com/" + USER,
    });
  } catch (err) {
    res.status(502).json({ error: "Upstream request failed" });
  }
}
