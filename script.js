/* ============================================================
   Suhaas Mandava — Portfolio
   Data-driven content + interactions. Edit the arrays below
   to update projects and skills without touching the markup.
   ============================================================ */

// ---- Content data ------------------------------------------------

const GITHUB_USER = "SuhaasMandava";

// No projects to show yet — the section renders a "coming soon" placeholder while
// this array is empty. Add objects here and the cards appear automatically.
// Template:
//   {
//     title: "Project Name",
//     description: "One or two sentences on what it does.",
//     tags: ["Tech", "Stack"],
//     repo: `https://github.com/${GITHUB_USER}/repo-name`,
//     demo: "https://your-live-demo.com", // or "" if none
//   },
const projects = [];

const skillGroups = [
  {
    icon: "💻",
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Java", "SQL", "HTML", "CSS"],
  },
  {
    icon: "⚛️",
    title: "Frontend",
    items: ["React", "Next.js", "Vue", "Tailwind CSS", "Vite", "Accessibility"],
  },
  {
    icon: "🛠️",
    title: "Backend",
    items: ["Node.js", "Express", "REST APIs", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    icon: "☁️",
    title: "Tools & DevOps",
    items: ["Git", "Docker", "CI/CD", "AWS", "Linux", "Jest"],
  },
];

// ---- Icons (inline SVG) -----------------------------------------

const iconFolder = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const iconGithub = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/></svg>`;
const iconExternal = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>`;

// ---- Render helpers ---------------------------------------------

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  const lead = document.getElementById("projectsLead");
  if (!grid) return;

  // Empty state: friendly "coming soon" with a link to the GitHub profile.
  if (projects.length === 0) {
    if (lead) lead.textContent =
      "I'm currently building things out. In the meantime, you can find my latest work on GitHub.";
    grid.classList.add("projects--empty");
    grid.innerHTML = `
      <div class="projects__placeholder">
        <span class="projects__placeholder-icon" aria-hidden="true">🚧</span>
        <p>Projects coming soon.</p>
        <a class="btn btn--ghost" href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">View my GitHub</a>
      </div>`;
    return;
  }

  if (lead) lead.textContent =
    "A selection of things I've built. Each links out to its source on GitHub.";
  grid.classList.remove("projects--empty");
  grid.innerHTML = projects
    .map((p) => {
      const demoLink =
        p.demo && p.demo !== "#"
          ? `<a href="${escapeHtml(p.demo)}" target="_blank" rel="noopener noreferrer" aria-label="Live demo">${iconExternal}</a>`
          : "";
      const tags = p.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("");
      return `
        <article class="project reveal">
          <div class="project__top">
            <span class="project__folder">${iconFolder}</span>
            <div class="project__links">
              <a href="${escapeHtml(p.repo)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">${iconGithub}</a>
              ${demoLink}
            </div>
          </div>
          <h3 class="project__title"><a href="${escapeHtml(p.repo)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.title)}</a></h3>
          <p class="project__desc">${escapeHtml(p.description)}</p>
          <div class="project__tags">${tags}</div>
        </article>`;
    })
    .join("");
}

function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;
  grid.innerHTML = skillGroups
    .map((g) => {
      const items = g.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
      return `
        <div class="skill-group reveal">
          <h3><span>${g.icon}</span> ${escapeHtml(g.title)}</h3>
          <ul>${items}</ul>
        </div>`;
    })
    .join("");
}

// ---- Theme toggle -----------------------------------------------

function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("theme");
  const prefersLight =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  root.setAttribute("data-theme", stored || (prefersLight ? "light" : "dark"));

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// ---- Mobile nav -------------------------------------------------

function initNav() {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  const nav = document.getElementById("nav");

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  // Add shadow/border to nav once scrolled
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---- Reveal on scroll -------------------------------------------

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => observer.observe(el));
}

// ---- Back to top ------------------------------------------------

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

// ---- Boot -------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderProjects();
  renderSkills();
  initNav();
  initReveal();
  initBackToTop();

  // Mark section headers as reveal targets too
  document.querySelectorAll(".section__title, .about__text, .about__aside, .contact")
    .forEach((el) => el.classList.add("reveal"));
  initReveal(); // re-observe newly tagged elements
});
