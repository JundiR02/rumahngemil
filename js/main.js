/* =====================================================================
   Rumah Ngemil — main.js
   Bootstrap: motion preference, a11y live region, module init order.
   ===================================================================== */
window.RN = window.RN || {};

(function () {
  "use strict";

  /* --------------------- reduced-motion (live) -------------------- */
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  RN.motion = { reduced: mq.matches };
  const onMQ = (e) => { RN.motion.reduced = e.matches; };
  if (mq.addEventListener) mq.addEventListener("change", onMQ);
  else if (mq.addListener) mq.addListener(onMQ);

  /* ------------------------ a11y live region --------------------- */
  const liveEl = document.querySelector("[data-live]");
  let liveT = 0;
  RN.live = function (msg) {
    if (!liveEl) return;
    clearTimeout(liveT);
    liveEl.textContent = "";
    liveT = setTimeout(() => { liveEl.textContent = msg; }, 60);
  };

  /* ----------------------------- boot ---------------------------- */
  function boot() {
    try { RN.cart.init(); } catch (e) { console.error(e); }
    try { RN.hero.init(); } catch (e) { console.error(e); }
    try { RN.sections.init(); } catch (e) { console.error(e); }
    try { RN.tabs.init(); } catch (e) { console.error(e); }

    // Deep-link: #pesanan / #menu / #pesan opens straight into the
    // Pesanan tab instead of the scrolling page's old menu sheet
    const h = location.hash.replace("#", "");
    const TAB_ALIAS = { menu: "pesanan", pesan: "pesanan", pesanan: "pesanan", cerita: "cerita", rumah: "rumah", tentang: "tentang", ngemil: "ngemil" };
    if (TAB_ALIAS[h]) RN.tabs.show(TAB_ALIAS[h]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
