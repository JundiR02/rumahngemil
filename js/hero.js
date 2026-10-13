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
  const pinsBox = document.querySelector("[data-pins]");
  const hint = document.querySelector("[data-hero-hint]");
  const tourCta = document.querySelector("[data-start-tour]");

  const HINT_WALK = "Gulir untuk mendekat ke booth kami";
  const HINT_EXPLORE = "Ketuk gerai, papan tanda, atau seal di dalam ilustrasi untuk menjelajah.";

  // pan targets — re-estimated by eye against the new single-image
  // diorama (replaced the old 13-layer version, whose POINTS/TOUR_STEPS
  // coordinates were pixel-measured from a reference prototype this one
  // doesn't have; these are approximate bounding-box centers, not exact)
  const HOME = { origin: "50% 50%", scale: 1 };
  const POINTS = {
    outlet: { origin: "52.1% 52%", scale: 1.8 },     // the whole tent + counter
    homemade: { origin: "70.7% 51.3%", scale: 2.3 }, // the blank round seal, right of the tent
    location: { origin: "25% 82%", scale: 2.6 },     // the blank sign near the bottom-left
  };

  const TOUR_STEPS = [
    { title: "Papan Lokasi", body: "Papan kayu Sidenreng, Rappang menyambut di pintu masuk. Dari rumah kami, untuk dibagi ke kamu.", point: POINTS.location, link: { label: "Lihat peta & jam buka", panel: "location" } },
    { title: "Banner Teman Ngemil", body: "Camilan favorit terpampang di banner. Lihat pilihannya, lalu melangkah ke meja.", point: { origin: "26% 58%", scale: 2.6 } },
    { title: "Papan Menu & Rak", body: "Papan menu di kiri dan kanan, toples berjajar di rak. Dipanggang dalam batch kecil setiap pagi dan dibungkus dengan tangan.", point: { origin: "49.4% 52.3%", scale: 2.5 } },
    { title: "Meja Kasir", body: "Pesan dan bayar di meja krem berlogo Rumah Ngemil, tempat cookies, cake, pastry, dan minuman disajikan.", point: { origin: "51% 62.5%", scale: 2.3 } },
    { title: "Fresh Homemade Happiness", body: "Papan bulat ini merangkum janji kami: segar, buatan rumah, dan bikin senang.", point: POINTS.homemade, link: { label: "Baca cerita lengkap", panel: "story" } },
    // pans home (overview) for a "there, you've seen it all" close, so
    // pinOrigin keeps the marker on the actual table/chairs instead of
    // wherever HOME's own overview origin happens to be
    { title: "Meja & Kursi Lipat", body: "Meja dan kursi lipat menunggu di depan tenda. Ngemil bareng, lalu bagi ke orang tersayang.", point: HOME, pinOrigin: "48.9% 69.4%", final: true },
  ];

  // numbered pins (1–6), one per tour stop, shown directly on the
  // illustration so a visitor can jump straight into any step —
  // mirrors the reference prototype's numbered spots
  const PINS = TOUR_STEPS.map((s, i) => ({ n: i + 1, label: s.title, origin: s.pinOrigin || s.point.origin }));

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
  // hotspot kind -> which tab it should open (the "menu"/"story"/"location"
  // panels they used to open now duplicate the Pesanan/Tentang/Rumah tabs,
  // so these jump to the tab instead of layering a panel on top of it)
  const HOTSPOT_TAB = { menu: "pesanan", story: "tentang", location: "rumah" };

  function wireHotspots() {
    document.querySelectorAll("[data-hotspot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.dataset.hotspot; // menu | story | location
        if (kind === "menu") panTo(POINTS.outlet);
        const delay = kind === "menu" && !reduced() ? 500 : 0;
        setTimeout(() => { if (RN.tabs) RN.tabs.show(HOTSPOT_TAB[kind] || kind); }, delay);
      });
    });
  }

  /* ----------------------------- pins ----------------------------- */
  /* numbered markers (1–6), one per tour stop, right on the illustration
     — a shortcut into any step without walking the whole sequence first */
  function spawnPins() {
    if (!pinsBox) return;
    PINS.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pin";
      btn.textContent = String(p.n);
      btn.setAttribute("aria-label", `Langkah ${p.n}: ${p.label}`);
      const [left, top] = p.origin.split(" ");
      btn.style.left = left;
      btn.style.top = top;
      btn.addEventListener("click", () => startTour(p.n - 1));
      pinsBox.appendChild(btn);
    });
  }

  /* -------------------------- swipe (touring) --------------------- */
  /* horizontal swipe steps through the tour while it's open; vertical
     page scroll stays native (touch-action: pan-y, set only while
     data-touring="true") so this never fights scrolling the rest of
     the page the way it would if touch-action were disabled outright */
  function wireSwipe() {
    let sx = 0, sy = 0, tracking = false;
    scene.addEventListener("pointerdown", (e) => {
      if (!touring || e.pointerType === "mouse") return;
      sx = e.clientX; sy = e.clientY; tracking = true;
    }, { passive: true });
    scene.addEventListener("pointerup", (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dy) < 70) {
        if (dx < 0) nextStep(); else prevStep();
      }
    }, { passive: true });
    scene.addEventListener("pointercancel", () => { tracking = false; }, { passive: true });
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

    const linkEl = tourCard.querySelector("[data-tc-link]");
    if (step.link) {
      linkEl.hidden = false;
      linkEl.textContent = step.link.label + " →";
      linkEl.onclick = (e) => { e.preventDefault(); endTour(false); if (RN.tabs) RN.tabs.show(HOTSPOT_TAB[step.link.panel] || step.link.panel); };
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

    if (step.final) { nextBtn.textContent = "Buka Menu"; nextBtn.onclick = () => { endTour(false); if (RN.tabs) RN.tabs.show("pesanan"); }; }
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

  function startTour(index) {
    if (touring || !hero) return;
    touring = true;
    tourIndex = clamp(index || 0, 0, TOUR_STEPS.length - 1);
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
    spawnPins();
    wireSwipe();

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

    if (tourCta) tourCta.addEventListener("click", () => startTour());
  }

  return { init, camera, panTo: (origin, scale) => panTo({ origin, scale }), panHome, startTour, endTour };
})();
