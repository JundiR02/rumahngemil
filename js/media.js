/* =====================================================================
   Rumah Ngemil — media.js
   Product art: a real photo when the product has one (cropped neatly
   via object-fit/object-position, not by editing the source file), or
   the generated paper-cut illustration as a fallback.
   ===================================================================== */
window.RN = window.RN || {};

RN.media = (function () {
  "use strict";

  function art(p) {
    if (p && p.image) {
      const pos = p.focus || "50% 45%";
      return (
        `<img src="${p.image}" alt="${escapeAttr(p.name || "")}" loading="lazy" ` +
        `decoding="async" style="object-position:${pos}" />`
      );
    }
    return RN.svg.food(p && p.shape);
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  return { art };
})();
