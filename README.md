# Suhaas Mandava — Portfolio

A fast, responsive, dark-mode-friendly personal portfolio built with **plain HTML, CSS, and vanilla JavaScript**. No frameworks, no build step.

## Sections
- **Hero** — name, title, intro, and social links
- **About** — bio, tech stack, profile card
- **Projects** — cards linking out to GitHub repos (+ optional live demos)
- **Skills** — grouped by category
- **Contact** — email CTA and socials

## Run it
Just open `index.html` in a browser. Or serve locally:

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000

# or with Node
npx serve
```

## Customize
All content lives in easy-to-edit places:

| What | Where |
|------|-------|
| Projects | `projects` array in `script.js` |
| Skills | `skillGroups` array in `script.js` |
| GitHub username | `GITHUB_USER` const in `script.js` |
| Bio / about text | `#about` section in `index.html` |
| Name, title, email, social URLs | `index.html` (hero + contact) |
| Colors / theme | CSS variables at the top of `styles.css` |

### Update your links
Replace the placeholders before publishing:
- `github.com/SuhaasMandava` → already set to the real GitHub
- `linkedin.com/in/suhaas-mandava-247647365` → already set to the real LinkedIn
- `hasumandava@gmail.com` → already set to the real contact email

## Theme
Dark mode is the default. The toggle in the navbar switches to light and remembers
the choice in `localStorage`. First-time visitors get their OS preference
(`prefers-color-scheme`).

## Deploy
Works as-is on any static host — **GitHub Pages**, Netlify, Vercel, or Cloudflare Pages.
For GitHub Pages: push these files to a repo and enable Pages on the `main` branch.

## Security
This is a static site with no backend, so the surface is small. What's in place:

- **Content-Security-Policy** — a strict `<meta>` CSP in each HTML file restricts
  scripts/styles to `self` plus the Google Fonts domains actually used. Because it
  forbids inline styles/scripts, keep all CSS in `styles.css` and all JS in `script.js`
  (no `style="..."` attributes or `<style>`/inline `<script>` blocks).
- **Referrer-Policy** — `strict-origin-when-cross-origin` via `<meta>`, so full URLs
  aren't leaked to sites you link to.
- **Anti-framing** — enforced via **HTTP headers**, not meta tags: `X-Frame-Options: DENY`
  and CSP `frame-ancestors 'none'`. ⚠️ These are *ignored* when set via `<meta>`, so they
  live in [`_headers`](./_headers) (Netlify / Cloudflare Pages) and [`vercel.json`](./vercel.json)
  (Vercel). **GitHub Pages does not support custom headers**, so on GitHub Pages the site
  cannot block framing — use Netlify/Cloudflare/Vercel if that matters to you.
- **No secrets** — there are no API keys, tokens, or secrets in the client bundle, and
  there shouldn't be: anything shipped to the browser is public. Keep it that way.
- **External links** use `rel="noopener noreferrer"` to prevent tab-nabbing.

### Adding third-party scripts later
If you add a library or analytics snippet:
1. **Pin the exact version** — load `library@1.2.3`, never `library@latest`.
2. Add **Subresource Integrity** (`integrity="sha384-..."` + `crossorigin="anonymous"`) for CDN scripts.
3. **Update the CSP** in every HTML `<head>` *and* in `_headers` / `vercel.json` to
   allow the new domain — otherwise the browser will block it.

## License
Released under the [MIT License](./LICENSE) — free to use, copy, and adapt with attribution.
