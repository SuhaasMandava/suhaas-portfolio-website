/* ============================================================
   Suhaas Mandava, Portfolio
   Content data + a set of lightweight, vanilla interactive
   modules. Everything is transform/opacity based, rAF-batched,
   and disabled under prefers-reduced-motion or on touch devices.
   ============================================================ */

const GITHUB_USER = "SuhaasMandava";

// ---- Projects (featured carousel) --------------------------------
const projects = [
  {
    title: "This Portfolio Site",
    description:
      "The site you're on, designed and built from scratch with plain HTML, CSS, and vanilla JS. No frameworks, fully responsive, dark-mode-first, and open source.",
    tags: ["HTML", "CSS", "JavaScript"],
    repo: `https://github.com/${GITHUB_USER}/suhaas-portfolio-website`,
    demo: "",
  },
];

// ---- Skills ------------------------------------------------------
// A focused, honest set. Edit to match what you'd actually be comfortable being
// asked about, and add anything real that's missing.
const skillGroups = [
  { icon: "◆", title: "Languages", items: ["Python", "JavaScript", "Java", "HTML", "CSS"] },
  { icon: "▲", title: "Frontend",  items: ["React", "Tailwind CSS", "Responsive design"] },
  { icon: "●", title: "Backend",   items: ["Node.js", "Express", "SQLite", "REST APIs"] },
  { icon: "■", title: "Tools",     items: ["Git & GitHub", "VS Code", "Linux"] },
];

// ---- Experience --------------------------------------------------
// My learning journey so far. Real milestones only; add new ones as they happen.
const experience = [
  { range: "Late 2024", duration: "", org: "Started coding", role: "Wrote my first lines of code and got hooked" },
  { range: "Recently", duration: "", org: "Completed CS50", role: "Harvard's Intro to Computer Science" },
  { range: "Now", duration: "", org: "Geo IT Labs", role: "Working part-time", url: "https://geoitlabs.com", active: true },
  { range: "Now", duration: "", org: "AP Computer Science A", role: "Taking CS coursework in high school" },
  { range: "Next", duration: "", org: "Hackathons & internships", role: "Open to them (none yet) and looking" },
];

// ---- Typing effect roles -----------------------------------------
const typedRoles = ["Student Developer", "Self-Taught Coder", "Always Learning", "Aspiring AI Engineer"];

// ---- Icons -------------------------------------------------------
const iconGithub = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.19.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/></svg>`;
const iconArrow = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

// ---- Helpers -----------------------------------------------------
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
const reduceMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = () =>
  window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// ==================================================================
//  Content rendering
// ==================================================================
function renderProjects() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;
  const variants = ["", "feature--b"];
  const cards = projects.map((p, i) => {
    const variant = variants[i % variants.length];
    const tags = p.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("");
    const demoBtn =
      p.demo && p.demo !== "#"
        ? `<a class="feature__btn feature__btn--ghost" href="${escapeHtml(p.demo)}" target="_blank" rel="noopener noreferrer">Live ${iconArrow}</a>`
        : "";
    return `
      <article class="feature reveal ${variant}" data-tilt>
        <div class="feature__media"></div>
        <div class="feature__body">
          <h3 class="feature__title">${escapeHtml(p.title)}</h3>
          <p class="feature__desc">${escapeHtml(p.description)}</p>
          <div class="feature__tags">${tags}</div>
          <div class="feature__links">
            <a class="feature__btn" href="${escapeHtml(p.repo)}" target="_blank" rel="noopener noreferrer">${iconGithub} Code</a>
            ${demoBtn}
          </div>
        </div>
      </article>`;
  });
  cards.push(`
    <article class="feature feature--placeholder feature--muted reveal" data-tilt>
      <div class="feature__body">
        <h3 class="feature__title">More on the way</h3>
        <p class="feature__desc">I'm actively building. New projects will land here as I ship them, and I post them on GitHub.</p>
        <div class="feature__links">
          <a class="feature__btn" href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">${iconGithub} GitHub</a>
        </div>
      </div>
    </article>`);
  track.innerHTML = cards.join("");
}

function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;
  grid.innerHTML = skillGroups
    .map((g) => `
      <div class="skill-card reveal">
        <h3><span aria-hidden="true">${g.icon}</span> ${escapeHtml(g.title)}</h3>
        <div class="skill-card__items">${g.items.map((i) => `<span>${escapeHtml(i)}</span>`).join("")}</div>
      </div>`)
    .join("");
}

function renderExperience() {
  const list = document.getElementById("expList");
  if (!list) return;
  list.innerHTML = experience
    .map((e) => {
      const org = e.url
        ? `<a href="${escapeHtml(e.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.org)}</a>`
        : escapeHtml(e.org);
      return `
      <div class="exp__row reveal${e.active ? " exp__row--active" : ""}">
        <div class="exp__period">
          <span class="exp__range">${escapeHtml(e.range)}</span>
          ${e.duration ? `<span class="exp__dur">${escapeHtml(e.duration)}</span>` : ""}
        </div>
        <div class="exp__org">${org}</div>
        <div class="exp__role">${escapeHtml(e.role)}</div>
      </div>`;
    })
    .join("");
}

// ==================================================================
//  1. Custom cursor (dot + ring, eased follow)
// ==================================================================
function initCursor() {
  if (reduceMotion() || isTouch()) return;
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot is-hidden";
  ring.className = "cursor-ring is-hidden";
  document.body.append(dot, ring);
  document.body.classList.add("has-cursor");

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let visible = false;
  let raf = null;

  // The ring eases toward the cursor; the loop self-terminates once it has
  // caught up, so it isn't burning a frame every rAF while the mouse is idle.
  const animateRing = () => {
    rx = lerp(rx, mx, 0.2);
    ry = lerp(ry, my, 0.2);
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) {
      raf = requestAnimationFrame(animateRing);
    } else {
      raf = null;
    }
  };

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { visible = true; dot.classList.remove("is-hidden"); ring.classList.remove("is-hidden"); }
    // Dot tracks 1:1 (a single cheap transform write per event, no layout read).
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    if (!raf) raf = requestAnimationFrame(animateRing);
  }, { passive: true });

  window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) { dot.classList.add("is-hidden"); ring.classList.add("is-hidden"); visible = false; }
  });

  // Grow the ring over interactive targets.
  const interactive = "a, button, [data-magnetic], [data-tilt], .feature, .stat, .skill-card, input, textarea";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactive)) ring.classList.add("is-hover");
  }, { passive: true });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactive)) ring.classList.remove("is-hover");
  }, { passive: true });
}

// ==================================================================
//  2. Magnetic buttons (spring pull toward cursor)
// ==================================================================
function initMagnetic() {
  if (reduceMotion() || isTouch()) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null, rect = null;
    const strength = 0.35;
    const run = () => {
      cx = lerp(cx, tx, 0.2); cy = lerp(cy, ty, 0.2);
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) { raf = requestAnimationFrame(run); }
      else { el.style.transform = `translate(${tx}px, ${ty}px)`; raf = null; }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(run); };
    // Measure once on enter, not on every mousemove (getBoundingClientRect forces layout).
    el.addEventListener("mouseenter", () => { rect = el.getBoundingClientRect(); }, { passive: true });
    el.addEventListener("mousemove", (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      tx = (e.clientX - rect.left - rect.width / 2) * strength;
      ty = (e.clientY - rect.top - rect.height / 2) * strength;
      kick();
    }, { passive: true });
    el.addEventListener("mouseleave", () => { tx = 0; ty = 0; rect = null; kick(); }, { passive: true });
  });
}

// ==================================================================
//  3. Typing effect (type / erase / cycle roles)
// ==================================================================
function initTyping() {
  const el = document.getElementById("typeTarget");
  if (!el) return;
  if (reduceMotion()) { el.textContent = typedRoles[0]; return; }

  let role = 0, i = 0, deleting = false;
  const tick = () => {
    const word = typedRoles[role];
    el.textContent = word.slice(0, i);
    if (!deleting && i < word.length) { i++; setTimeout(tick, 70); }
    else if (!deleting && i === word.length) { deleting = true; setTimeout(tick, 1500); }
    else if (deleting && i > 0) { i--; setTimeout(tick, 35); }
    else { deleting = false; role = (role + 1) % typedRoles.length; setTimeout(tick, 350); }
  };
  el.textContent = "";
  setTimeout(tick, 500);
}

// ==================================================================
//  4. Scroll progress bar
// ==================================================================
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    bar.style.transform = `scaleX(${p})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

// ==================================================================
//  5. 3D tilt on cards (transform only, cursor-driven)
// ==================================================================
function initTilt() {
  if (reduceMotion() || isTouch()) return;
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const MAX = 9; // degrees
    let raf = null, rx = 0, ry = 0, rect = null;
    const apply = () => {
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      raf = null;
    };
    // Measure once on enter, not on every mousemove.
    el.addEventListener("mouseenter", () => { rect = el.getBoundingClientRect(); }, { passive: true });
    el.addEventListener("mousemove", (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      ry = px * MAX * 2;
      rx = -py * MAX * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    el.addEventListener("mouseleave", () => {
      rx = 0; ry = 0; rect = null;
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    }, { passive: true });
  });
}

// ==================================================================
//  6. Hero: interactive dot grid canvas + mouse-follow glow
// ==================================================================
function initHeroBackground() {
  const glow = document.getElementById("heroGlow");
  const canvas = document.getElementById("heroGrid");
  const hero = canvas ? canvas.closest(".hero") : null;
  if (!hero) return;

  // No canvas/glow motion under reduced-motion or on touch.
  if (reduceMotion() || isTouch() || !canvas.getContext) {
    if (canvas) canvas.style.display = "none";
    return;
  }

  // Cached geometry, refreshed only on resize/scroll, never per-mousemove
  // (getBoundingClientRect forces layout; keep it out of the hot path).
  let rect = hero.getBoundingClientRect();
  const refreshRect = () => { rect = hero.getBoundingClientRect(); };

  // ---- Mouse-follow gradient glow (eased; loop self-terminates when settled) ----
  let gx = 0, gy = 0, gtx = 0, gty = 0, graf = null;
  const glowLoop = () => {
    gx = lerp(gx, gtx, 0.1); gy = lerp(gy, gty, 0.1);
    if (glow) glow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0) translate(-50%, -50%)`;
    if (Math.abs(gtx - gx) > 0.5 || Math.abs(gty - gy) > 0.5) graf = requestAnimationFrame(glowLoop);
    else graf = null;
  };

  // ---- Interactive dot grid: draws ON DEMAND only ----
  // The dot appearance is a pure function of the pointer position, so there's
  // nothing to redraw while the pointer is still. We schedule at most one draw
  // per frame, and only in response to a mousemove/leave, so scrolling (no
  // mousemove) costs the canvas exactly zero.
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const GAP = 42, R = 1.3, INFL = 110;
  const accent = [36, 232, 138], violet = [160, 107, 255];
  let w = 0, h = 0, dots = [], mx = -9999, my = -9999, drawPending = false;

  const draw = () => {
    drawPending = false;
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      const near = 1 - Math.min(Math.hypot(d.x - mx, d.y - my) / INFL, 1);
      const r = R + near * 2.2;
      const a = 0.1 + near * 0.85;
      const c = near > 0.5 ? violet : accent;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, 6.2832);
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
      ctx.fill();
    }
  };
  const scheduleDraw = () => { if (!drawPending) { drawPending = true; requestAnimationFrame(draw); } };

  const build = () => {
    refreshRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (let y = GAP; y < h; y += GAP)
      for (let x = GAP; x < w; x += GAP) dots.push({ x, y });
    scheduleDraw();
  };

  // Single passive mousemove drives both the glow and the dot grid.
  hero.addEventListener("mousemove", (e) => {
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    gtx = mx - w / 2;          // drift from centre toward the pointer
    gty = my - h * 0.4;
    if (!graf) graf = requestAnimationFrame(glowLoop);
    scheduleDraw();
  }, { passive: true });
  hero.addEventListener("mouseleave", () => {
    mx = -9999; my = -9999;    // one final draw clears the influence
    gtx = 0; gty = 0;
    if (!graf) graf = requestAnimationFrame(glowLoop);
    scheduleDraw();
  }, { passive: true });

  build();
  window.addEventListener("resize", build, { passive: true });
  // Keep cached geometry correct while the hero scrolls (throttled + passive).
  let stick = false;
  window.addEventListener("scroll", () => {
    if (!stick) { stick = true; requestAnimationFrame(() => { refreshRect(); stick = false; }); }
  }, { passive: true });
}

// ==================================================================
//  Hero background video (deferred load, muted loop; respects motion)
// ==================================================================
function initHeroVideo() {
  const video = document.getElementById("heroVideo");
  if (!video) return;
  const source = video.querySelector("source[data-src]");
  if (!source) return;

  // Fade the video in only once the first frame has actually decoded.
  video.addEventListener("loadeddata", () => video.classList.add("is-ready"), { once: true });

  let loaded = false;
  const loadVideo = () => {
    if (loaded) return;
    loaded = true;
    source.src = source.dataset.src;
    video.load();
  };

  // Reduced motion: load a single static frame and leave it paused (never autoplay).
  if (reduceMotion()) { loadVideo(); return; }

  // Otherwise defer the ~3MB fetch until the page has loaded and the main thread
  // is idle, then play, so it never competes with first paint.
  const start = () => {
    loadVideo();
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {}); // ignore autoplay rejections
  };
  const idle = (fn) =>
    "requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 300);
  if (document.readyState === "complete") idle(start);
  else window.addEventListener("load", () => idle(start), { once: true });
}

// ==================================================================
//  7. Count-up stat numbers (on scroll into view)
// ==================================================================
function initCounters() {
  // Only animate numeric stats; static ones (e.g. "2024", "∞") have no data-count.
  const nums = document.querySelectorAll(".stat__num[data-count]");
  if (!nums.length) return;
  const run = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (reduceMotion()) { el.textContent = target + suffix; return; }
    const dur = 1400;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = clamp((ts - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);   // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); } });
  }, { threshold: 0.5 });
  nums.forEach((n) => obs.observe(n));
}

// ==================================================================
//  9. Smooth scrolling: NATIVE.
//  The old JS wheel-hijack (preventDefault + window.scrollTo lerp) caused
//  trackpad lag by fighting native momentum on the main thread. It's gone.
//  Anchor jumps / back-to-top use CSS `scroll-behavior: smooth` (styles.css),
//  which the browser runs off the main thread. Regular wheel/trackpad
//  scrolling is now 100% native.
// ==================================================================

// ==================================================================
//  10. Scrollspy active nav indicator (sliding gradient underline)
// ==================================================================
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav__links a[data-nav]"));
  const indicator = document.getElementById("navIndicator");
  const linksWrap = document.getElementById("navLinks");
  if (!links.length || !indicator || !linksWrap) return;

  const byId = {};
  links.forEach((l) => { byId[l.dataset.nav] = l; });
  const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);

  const moveTo = (link) => {
    links.forEach((l) => l.classList.toggle("active", l === link));
    if (window.matchMedia("(max-width: 680px)").matches) { indicator.classList.remove("is-active"); return; }
    const wrapRect = linksWrap.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    linksWrap.style.setProperty("--nav-ind-x", `${r.left - wrapRect.left}px`);
    linksWrap.style.setProperty("--nav-ind-w", `${r.width}px`);
    indicator.classList.add("is-active");
  };

  let currentId = null;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting && en.target.id !== currentId) {
        currentId = en.target.id;
        if (byId[currentId]) moveTo(byId[currentId]);
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach((s) => obs.observe(s));

  // Reposition on resize so the underline tracks link movement.
  window.addEventListener("resize", () => {
    const active = links.find((l) => l.classList.contains("active"));
    if (active) moveTo(active);
  }, { passive: true });
}

// ==================================================================
//  Mobile nav, reveal, carousel, back-to-top
//  (No theme logic: the site is permanently dark. There is no toggle,
//   no prefers-color-scheme detection, and no stored preference.)
// ==================================================================
function initNav() {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  const nav = document.getElementById("nav");
  if (!burger || !links || !nav) return;
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
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initReveal() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("visible")); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => observer.observe(el));
}

function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const prev = document.getElementById("carouselPrev");
  const next = document.getElementById("carouselNext");
  if (!track || !prev || !next) return;
  const step = () => {
    const card = track.querySelector(".feature");
    return card ? card.getBoundingClientRect().width + 22 : track.clientWidth * 0.8;
  };
  const update = () => {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  const behavior = () => (reduceMotion() ? "auto" : "smooth");
  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: behavior() }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: behavior() }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" }));
}

// ==================================================================
//  Boot
// ==================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Content first, so the interactive modules can bind to rendered nodes.
  renderProjects();
  renderSkills();
  renderExperience();

  initNav();
  initReveal();
  initCarousel();
  initBackToTop();

  initTyping();          // 3
  initScrollProgress();  // 4
  initCounters();        // 8
  initScrollSpy();       // 10
  initHeroVideo();       // background video (deferred)
  initHeroBackground();  // 7
  initTilt();            // 5
  initMagnetic();        // 2
  initCursor();          // 1
  // 9 (smooth scroll) is now native (see note above); no JS needed.
});
