/* =====================================================================
   Rumah Ngemil — sections.js
   Populates Section 02 (dishes on the paper table), fills the location
   facts, runs scroll reveals, nav active-state, and nav auto-hide.
   ===================================================================== */
window.RN = window.RN || {};

RN.sections = (function () {
  "use strict";
  const D = RN.data;
  const idr = D.format.idr;

  /* -------------------- Section 02: dishes on the table ------------ */
  function renderDishes() {
    const list = document.querySelector("[data-dish-list]");
    if (!list) return;
    const feat = D.featured().slice(0, 6);
    list.innerHTML = feat.map((p) => `
      <li>
        <button type="button" class="dish" data-open-product="${p.id}"
          aria-label="Lihat ${p.name}, ${idr(p.price)}">
          <span class="dish__art" aria-hidden="true">${RN.svg.food(p.shape)}</span>
          <span class="dish__label">${p.name}</span>
          <span class="dish__price">${idr(p.price)}</span>
        </button>
      </li>`).join("");
    list.querySelectorAll("[data-open-product]").forEach((b) =>
      b.addEventListener("click", () => RN.panel.open("product", { id: b.dataset.openProduct })));
  }

  /* --------------------------- location facts --------------------- */
  function fillPlace() {
    const L = D.location;
    const set = (sel, v) => { const el = document.querySelector(sel); if (el) el.textContent = v; };
    set("[data-place-address]", L.address);
    set("[data-place-hours]", L.hours);
    set("[data-place-phone]", L.phone);
  }

  /* ------------------------- generic openers --------------------- */
  function wireOpeners() {
    document.querySelectorAll("[data-open]").forEach((b) => {
      // skip ones already wired inside dynamic sections
      if (b.dataset.rnWired) return;
      b.dataset.rnWired = "1";
      b.addEventListener("click", () => RN.panel.open(b.dataset.open));
    });
  }

  /* --------------------------- scroll reveals ------------------- */
  function reveals() {
    const items = [...document.querySelectorAll(".reveal")];
    items.forEach((el) => {
      const d = el.dataset.revealDelay;
      if (d) el.style.setProperty("--reveal-d", d);
    });

    if ((RN.motion && RN.motion.reduced) || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    items.forEach((el) => io.observe(el));

    // safety net: anything already on screen must never stay invisible,
    // even if the observer's first callback is delayed or missed
    const sweep = () => items.forEach((el) => {
      if (el.classList.contains("is-in")) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.98 && r.bottom > 0) { el.classList.add("is-in"); io.unobserve(el); }
    });
    setTimeout(sweep, 900);
    addEventListener("scroll", sweep, { passive: true });
    addEventListener("load", () => setTimeout(sweep, 200));
  }

  /* ------------------ nav: active link + auto-hide -------------- */
  function nav() {
    const links = [...document.querySelectorAll(".worldnav__list a[data-nav]")];
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    if (map.size) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            const a = map.get(en.target);
            if (a) a.classList.add("is-active");
          }
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      map.forEach((_a, sec) => io.observe(sec));
    }

    // smooth-scroll for in-page links (respect reduced motion)
    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href").slice(1);
        const sec = document.getElementById(id);
        if (!sec) return;
        e.preventDefault();
        sec.scrollIntoView({ behavior: (RN.motion && RN.motion.reduced) ? "auto" : "smooth", block: "start" });
      });
    });

    // auto-hide the desktop pill on scroll-down, show on scroll-up
    const bar = document.querySelector(".worldnav");
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (window.matchMedia("(max-width: 860px)").matches) { bar.classList.remove("is-hidden"); return; }
      if (y > lastY && y > 240) bar.classList.add("is-hidden");
      else bar.classList.remove("is-hidden");
      lastY = y;
    }, { passive: true });
  }

  function init() {
    renderDishes();
    fillPlace();
    wireOpeners();
    reveals();
    nav();
  }

  return { init };
})();
