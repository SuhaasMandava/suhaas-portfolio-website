# Suhaas Mandava — Portfolio

This is the code behind [Suhaas Mandava's personal website](https://github.com/SuhaasMandava) — a portfolio page showing off projects, skills, hackathons, and some investment research write-ups.

It's built with plain web basics (HTML, CSS, JavaScript) — no fancy frameworks, no complicated build process. That keeps it simple, fast, and easy to host anywhere for free.

## What's on the site
- **Hero** — name, title, a short intro, and links to social profiles
- **About** — a short bio, the tools/technologies used, and a profile card
- **Projects** — cards that link out to GitHub projects (and live demos, when available)
- **Skills** — organized into categories
- **Hackathons** — one card per event competed in (shows a "looking for my first" placeholder until there's one to show)
- **Contact** — a way to get in touch by email or social links
- **Research** — a separate page with investment write-ups (currently on Anthropic and SpaceX) and a live stock ticker

## How to view it
Just double-click `index.html` and it opens in your browser. That's it — no installation needed.

## How to make changes
Nearly everything you'd want to change lives in a predictable spot:

| What you want to change | Where to find it |
|---|---|
| Projects shown | the projects list inside `script.js` |
| Skills shown | the skills list inside `script.js` |
| Hackathons shown | the hackathons list inside `script.js` |
| Bio / about text | the "About" section of `index.html` |
| Name, title, email, social links | `index.html` |
| Colors / overall look | the top of `styles.css` |

You don't need to know how to code to make small text edits — open the file in any text editor, find the words you want to change, and save.

## Dark mode
The site defaults to dark mode. Visitors can switch to light mode with the toggle in the navigation bar, and their choice is remembered the next time they visit. First-time visitors see whichever mode matches their device's setting.

## Publishing the site
This site can be hosted for free on services like **GitHub Pages**, **Netlify**, **Vercel**, or **Cloudflare Pages** — no server to manage. It's currently set up to deploy on **Vercel**.

Two small pieces of the site (the GitHub activity feed and the stock ticker on the Research page) run a tiny bit of behind-the-scenes code on Vercel so that a private stock-data key never gets exposed to visitors' browsers. Everything else is just static pages.

## Keeping it secure
Since this is a simple site with no login system or database, there isn't much that could go wrong — but a few protections are already in place:
- Strict rules about what the browser is allowed to load, so it's harder to sneak in malicious scripts
- No usernames, passwords, or private keys anywhere in the code visitors can see
- Links to other websites open safely without leaking data about where the visitor came from
- Extra protection (on Netlify/Vercel/Cloudflare, not GitHub Pages) against the site being embedded inside someone else's page without permission

If you ever add a third-party script (like an analytics tool), double check with whoever maintains the code that the site's security rules get updated to allow it — otherwise the browser will silently block it.

## License
Free to use, copy, and adapt — just give credit. See the [LICENSE](./LICENSE) file for the full terms.
