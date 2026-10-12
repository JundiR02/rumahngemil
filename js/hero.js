/* =====================================================================
   Rumah Ngemil — hero.js
   The interactive miniature world:
     - scroll "walk-up" — a tall track pins the booth in place while it
       scales from far-away to arrived (position: sticky + a CSS var,
       no scroll-jacking: native scrolling still drives everything)
     - pointer parallax + ambient motes
     - panTo()/panHome() — a shared pan/zoom used by both the quick
       "lihat menu" hotspot and the guided tour below
     - a guided walkthrough ("Mulai Tur Booth") that steps the camera
       through the booth's interactive points with a caption card
   ===================================================================== */
window.RN = window.RN || {};

RN.hero = (function () {
  "use strict";

  const hero = document.querySelector(".hero");
  const approachEl = document.querySelector("[data-approach]");
  const stage = document.querySelector("[data-parallax-stage]");
  const approachbox = document.querySelector("[data-approachbox]");
  const scene = document.querySelector("[data-camera]");
  const motesBox = document.querySelector(".hero__motes");
  const hint = document.querySelector("[data-hero-hint]");
  const tourCta = document.querySelector("[data-start-tour]");

  const HINT_WALK = "Gulir untuk mendekat ke booth kami";
  const HINT_EXPLORE = "Ketuk gerai, papan tanda, atau seal di dalam ilustrasi untuk menjelajah.";

  // pan targets, matched to each layer's own box in hero.css (.hero__layer--*)
  const HOME = { origin: "47% 42%", scale: 1 };
  const POINTS = {
    outlet: { origin: "49.5% 36.9%", scale: 1.3 },   // centered on the whole tent (.hero__layer--tent)
    homemade: { origin: "68.2% 38.4%", scale: 1.6 }, // the round seal (.hero__layer--sign)
    location: { origin: "21.4% 70.8%", scale: 1.45 }, // the wooden sign (.hero__layer--signwood)
  };

  // the 6 stops below mirror a standalone diorama prototype (same source
  // artwork, cut into layers) — titles/copy kept as written there, camera
  // points converted from its pixel coordinates into this scene's origin%.
  const TOUR_STEPS = [
    { title: "Papan Lokasi", body: "Papan kayu Sidenreng, Rappang menyambut di pintu masuk. Dari rumah kami, untuk dibagi ke kamu.", point: POINTS.location, link: { label: "Lihat peta & jam buka", panel: "location" } },
    { title: "Banner Teman Ngemil", body: "Camilan favorit terpampang di banner. Lihat pilihannya, lalu melangkah ke meja.", point: { origin: "29.4% 45.6%", scale: 1.3 } },
    { title: "Papan Menu & Rak", body: "Papan menu di kiri dan kanan, toples berjajar di rak. Dipanggang dalam batch kecil setiap pagi dan dibungkus dengan tangan.", point: { origin: "49.5% 39.4%", scale: 1.5 } },
    { title: "Meja Kasir", body: "Pesan dan bayar di meja krem berlogo Rumah Ngemil, tempat cookies, cake, pastry, dan minuman disajikan.", point: { origin: "49.6% 53.8%", scale: 1.4 } },
    { title: "Fresh Homemade Happiness", body: "Papan bulat ini merangkum janji kami: segar, buatan rumah, dan bikin senang.", point: POINTS.homemade, link: { label: "Baca cerita lengkap", panel: "story" } },
    { title: "Meja & Kursi Lipat", body: "Meja dan kursi lipat menunggu di depan tenda. Ngemil bareng, lalu bagi ke orang tersayang.", point: HOME, final: true },
  ];

  function reduced() { return !!(RN.motion && RN.motion.reduced); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* --------------------------- parallax ---------------------------- */
  let raf = 0;
  let tx = 0, ty = 0;
  let cx = 0, cy = 0;

  function onMove(e) {
    if (reduced()) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tx = clamp(px, -0.5, 0.5);
    ty = clamp(py, -0.5, 0.5);
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function onLeave() { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); }

  function tick() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    scene.style.setProperty("--px", cx.toFixed(4));
    scene.style.setProperty("--py", cy.toFixed(4));
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(tick);
    else raf = 0;
  }

  /* ----------------------------- motes ---------------------------- */
  function spawnMotes() {
    if (reduced() || !motesBox) return;
    for (let i = 0; i < 9; i++) {
      const m = document.createElement("span");
      m.className = "mote";
      m.style.left = (8 + Math.random() * 84) + "%";
      m.style.top = (30 + Math.random() * 55) + "%";
      m.style.setProperty("--mf", (16 + Math.random() * 16).toFixed(1) + "s");
      m.style.setProperty("--md", (-Math.random() * 20).toFixed(1) + "s");
      m.style.background = i % 2 ? "var(--sage-light)" : "var(--paper-2)";
      motesBox.appendChild(m);
    }
  }

  /* ------------------------ scroll "walk-up" ------------------------ */
  let approachTicking = false;
  let arrived = reduced(); // reduced-motion users start already "arrived"

  function onScroll() {
    if (reduced() || !approachEl || !approachbox) return;
    if (!approachTicking) { approachTicking = true; requestAnimationFrame(updateApproach); }
  }

  function updateApproach() {
    approachTicking = false;
    const rect = approachEl.getBoundingClientRect();
    const scrollable = approachEl.offsetHeight - window.innerHeight;
    const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 1;
    approachbox.style.setProperty("--approach", progress.toFixed(4));
    setArrived(progress >= 0.92 ? true : progress < 0.85 ? false : arrived);
  }

  function setArrived(v) {
    if (v === arrived) return;
    arrived = v;
    if (tourCta) tourCta.classList.toggle("is-visible", arrived);
    if (hint && !hint.classList.contains("is-dim")) hint.textContent = arrived ? HINT_EXPLORE : HINT_WALK;
  }

  /* ----------------------- pan / zoom (shared) ----------------------- */
  function panTo(point) {
    if (!scene || !hero) return;
    scene.style.transformOrigin = point.origin;
    scene.style.setProperty("--tour-scale", point.scale);
    hero.dataset.zoomed = point.scale > 1 ? "true" : "false";
  }
  function panHome() { panTo(HOME); }

  /** kept for panel.js, which calls this around the "menu" panel's lifecycle */
  function camera(on) { panTo(on ? POINTS.outlet : HOME); }

  /* -------------------------- hotspots -------------------------- */
  function wireHotspots() {
    document.querySelectorAll("[data-hotspot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.dataset.hotspot; // menu | story | location
        if (kind === "menu") {
          panTo(POINTS.outlet);
          const delay = reduced() ? 0 : 500;
          setTimeout(() => RN.panel.open("menu", { category: "cookies" }), delay);
        } else {
          RN.panel.open(kind);
        }
      });
    });
  }

  /* --------------------------- hint fade ------------------------- */
  function wireHintFade() {
    if (!hint) return;
    let done = false;
    const dim = () => { if (done) return; done = true; hint.classList.add("is-dim"); };
    document.querySelectorAll("[data-hotspot]").forEach((b) => b.addEventListener("pointerenter", dim, { once: true }));
    setTimeout(dim, 16000);
  }

  /* ----------------------------- tour ----------------------------- */
  let tourCard = null;
  let tourIndex = 0;
  let touring = false;

  function ensureTourCard() {
    if (tourCard) return tourCard;
    tourCard = document.createElement("div");
    tourCard.className = "tourcard";
    tourCard.setAttribute("role", "dialog");
    tourCard.setAttribute("aria-label", "Tur booth Rumah Ngemil");
    tourCard.innerHTML =
      '<button type="button" class="tourcard__close" data-tc-close aria-label="Tutup tur">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button>" +
      '<div class="tourcard__dots" data-tc-dots>' +
      TOUR_STEPS.map((s, i) => `<button type="button" class="tourcard__dot" data-tc-dot aria-label="Langkah ${i + 1}: ${s.title}"></button>`).join("") +
      "</div>" +
      '<p class="tourcard__eyebrow" data-tc-eyebrow></p>' +
      '<h3 class="tourcard__title" data-tc-title></h3>' +
      '<p class="tourcard__body" data-tc-body></p>' +
      '<a href="#" class="tourcard__link" data-tc-link hidden></a>' +
      '<p class="tourcard__maplabel">Posisi di denah booth</p>' +
      '<div class="tourcard__map" aria-hidden="true">' +
      '<span class="tourcard__map-zone tourcard__map-zone--outlet"></span>' +
      '<span class="tourcard__map-zone tourcard__map-zone--homemade"></span>' +
      '<span class="tourcard__map-zone tourcard__map-zone--location"></span>' +
      '<span class="tourcard__map-dot" data-tc-mapdot></span>' +
      "</div>" +
      '<div class="tourcard__nav">' +
      '<button type="button" class="btn btn--ghost" data-tc-back></button>' +
      '<button type="button" class="btn btn--primary" data-tc-next></button>' +
      "</div>";
    stage.appendChild(tourCard);
    tourCard.querySelector("[data-tc-close]").addEventListener("click", () => endTour());
    tourCard.querySelectorAll("[data-tc-dot]").forEach((dot, i) => dot.addEventListener("click", () => goToStep(i)));
    return tourCard;
  }

  function renderStep() {
    const step = TOUR_STEPS[tourIndex];
    panTo(step.point);

    tourCard.querySelector("[data-tc-eyebrow]").textContent = `Langkah ${tourIndex + 1} dari ${TOUR_STEPS.length}`;
    tourCard.querySelector("[data-tc-title]").textContent = step.title;
    tourCard.querySelector("[data-tc-body]").textContent = step.body;

    const mapDot = tourCard.querySelector("[data-tc-mapdot]");
    const [mapLeft, mapTop] = step.point.origin.split(" ").map(parseFloat);
    mapDot.style.left = mapLeft + "%";
    mapDot.style.top = mapTop + "%";

    const linkEl = tourCard.querySelector("[data-tc-link]");
    if (step.link) {
      linkEl.hidden = false;
      linkEl.textContent = step.link.label + " →";
      linkEl.onclick = (e) => { e.preventDefault(); endTour(false); RN.panel.open(step.link.panel); };
    } else {
      linkEl.hidden = true;
      linkEl.onclick = null;
    }

    tourCard.querySelectorAll("[data-tc-dot]").forEach((d, i) => d.classList.toggle("is-active", i === tourIndex));

    const backBtn = tourCard.querySelector("[data-tc-back]");
    const nextBtn = tourCard.querySelector("[data-tc-next]");
    if (tourIndex === 0) { backBtn.textContent = "Tutup"; backBtn.onclick = () => endTour(); }
    else if (step.final) { backBtn.textContent = "Selesai"; backBtn.onclick = () => endTour(); }
    else { backBtn.textContent = "Kembali"; backBtn.onclick = prevStep; }

    if (step.final) { nextBtn.textContent = "Buka Menu"; nextBtn.onclick = () => { endTour(false); RN.panel.open("menu"); }; }
    else { nextBtn.textContent = "Lanjut"; nextBtn.onclick = nextStep; }

    if (RN.live) RN.live(`Langkah ${tourIndex + 1} dari ${TOUR_STEPS.length}: ${step.title}`);
  }

  function nextStep() { if (tourIndex < TOUR_STEPS.length - 1) { tourIndex++; renderStep(); } }
  function prevStep() { if (tourIndex > 0) { tourIndex--; renderStep(); } }
  function goToStep(i) { const clamped = clamp(i, 0, TOUR_STEPS.length - 1); if (clamped !== tourIndex) { tourIndex = clamped; renderStep(); } }

  function onTourKey(e) {
    if (e.key === "Escape") { e.preventDefault(); endTour(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); nextStep(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prevStep(); }
  }

  function startTour() {
    if (touring || !hero) return;
    touring = true;
    tourIndex = 0;
    hero.dataset.touring = "true";
    ensureTourCard();
    renderStep();
    requestAnimationFrame(() => tourCard.classList.add("is-open"));
    document.addEventListener("keydown", onTourKey, true);
    requestAnimationFrame(() => {
      const closeBtn = tourCard.querySelector("[data-tc-close]");
      if (closeBtn) closeBtn.focus();
    });
  }

  function endTour(restoreFocus) {
    if (!touring) return;
    touring = false;
    hero.dataset.touring = "false";
    if (tourCard) tourCard.classList.remove("is-open");
    panHome();
    document.removeEventListener("keydown", onTourKey, true);
    if (restoreFocus !== false && tourCta) tourCta.focus();
  }

  function init() {
    wireHotspots();
    wireHintFade();
    spawnMotes();

    if (reduced()) {
      if (tourCta) tourCta.classList.add("is-visible");
      if (hint) hint.textContent = HINT_EXPLORE;
    } else {
      stage.addEventListener("pointermove", onMove, { passive: true });
      stage.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      updateApproach();
    }

    if (tourCta) tourCta.addEventListener("click", startTour);
  }

  return { init, camera, panTo: (origin, scale) => panTo({ origin, scale }), panHome, startTour, endTour };
})();
