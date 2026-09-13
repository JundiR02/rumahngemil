/* =====================================================================
   Rumah Ngemil — hero.js
   The interactive miniature world: pointer parallax, ambient motes,
   hotspot wiring, and the cinematic camera push toward the outlet.
   ===================================================================== */
window.RN = window.RN || {};

RN.hero = (function () {
  "use strict";

  const hero = document.querySelector(".hero");
  const stage = document.querySelector("[data-parallax-stage]");
  const scene = document.querySelector("[data-camera]");
  const motesBox = document.querySelector(".hero__motes");
  const hint = document.querySelector("[data-hero-hint]");

  let raf = 0;
  let tx = 0, ty = 0;      // target
  let cx = 0, cy = 0;      // current (eased)

  function reduced() { return !!(RN.motion && RN.motion.reduced); }

  /* --------------------------- parallax ---------------------------- */
  function onMove(e) {
    if (reduced()) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tx = Math.max(-0.5, Math.min(0.5, px));
    ty = Math.max(-0.5, Math.min(0.5, py));
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function onLeave() { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); }

  function tick() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    scene.style.setProperty("--px", cx.toFixed(4));
    scene.style.setProperty("--py", cy.toFixed(4));
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  }

  /* ----------------------------- motes ---------------------------- */
  function spawnMotes() {
    if (reduced() || !motesBox) return;
    const n = 9;
    for (let i = 0; i < n; i++) {
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

  /* --------------------------- camera ---------------------------- */
  function camera(on) {
    if (!hero) return;
    hero.classList.toggle("is-camera", !!on);
  }

  /* -------------------------- hotspots -------------------------- */
  function wireHotspots() {
    document.querySelectorAll("[data-hotspot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.dataset.hotspot; // menu | story | location
        if (kind === "menu") {
          // brief cinematic push, then open the sheet
          camera(true);
          const delay = reduced() ? 0 : 360;
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
    const dim = () => {
      if (done) return;
      done = true;
      hint.classList.add("is-dim");
    };
    window.addEventListener("scroll", () => { if (window.scrollY > 40) dim(); }, { passive: true });
    document.querySelectorAll("[data-hotspot]").forEach((b) =>
      b.addEventListener("pointerenter", dim, { once: true }));
    setTimeout(dim, 12000);
  }

  function init() {
    wireHotspots();
    wireHintFade();
    spawnMotes();
    if (!reduced()) {
      stage.addEventListener("pointermove", onMove, { passive: true });
      stage.addEventListener("pointerleave", onLeave, { passive: true });
    }
  }

  return { init, camera };
})();
