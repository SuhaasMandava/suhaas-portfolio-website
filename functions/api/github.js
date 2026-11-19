// ============================================================
//  /api/github  —  recent public GitHub activity for the home page.
//
//  Runs server-side as a Cloudflare Pages Function so the page can keep
//  its strict Content-Security-Policy (connect-src 'self'): the browser
//  only ever calls this site, and this function calls GitHub.
//
//  No API key is required. Public repository data works unauthenticated,
//  and the edge cache keeps this far under the rate limit. A GITHUB_TOKEN
//  variable in the Pages project settings is optional and only raises
//  that limit.
//
//  This uses the repos endpoint rather than /events: the events API no
//  longer includes commit messages in push payloads, and "which projects
//  am I actively working on" is a better signal for a portfolio anyway.
// ============================================================

import { cachedJson } from "../_lib.js";

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

export function onRequestGet(context) {
  return cachedJson(context, 600, async () => {
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": USER + "-portfolio",
    };
    if (context.env.GITHUB_TOKEN) {
      headers.Authorization = "Bearer " + context.env.GITHUB_TOKEN;
    }

    try {
      const r = await fetch(
        `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=20`,
        { headers }
      );
      if (!r.ok) return { status: 502, body: { error: "GitHub request failed" } };
      const all = await r.json();
      if (!Array.isArray(all)) return { status: 502, body: { error: "Unexpected response" } };

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

      return {
        status: 200,
        body: {
          repos,
          latest: repos.length ? repos[0].at : null,
          profile: "https://github.com/" + USER,
        },
      };
    } catch (err) {
      return { status: 502, body: { error: "Upstream request failed" } };
    }
  });
}
