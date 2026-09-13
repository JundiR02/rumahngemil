/* =====================================================================
   Rumah Ngemil — svg.js
   Tiny paper-cut illustrations for each product shape. Self-contained,
   no image assets. Every shape returns an <svg> string on a 120x120 box
   with a soft cast shadow so it reads as a paper object on a surface.
   ===================================================================== */
window.RN = window.RN || {};

RN.svg = (function () {
  "use strict";

  // warm palette pulled from the diorama
  const C = {
    dough: "#e7c9a0", doughDark: "#d3ab7c",
    choc: "#6b4429", chocDark: "#4e2f1b",
    cream: "#f6ecda", kraft: "#d9bf98", kraftDark: "#bb9d72",
    pink: "#e3a89f", rose: "#e6b8c2",
    green: "#9db488", greenDark: "#6e8b5b",
    teal: "#92c3c4", tealDark: "#6ea7a8",
    berry: "#b5654a", gold: "#cf9b34",
    ink: "#3a2a1b",
  };

  const shadow =
    '<ellipse cx="60" cy="104" rx="34" ry="7" fill="#3a2a1b" opacity="0.14"/>';

  function wrap(inner) {
    return (
      '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img">' +
      shadow +
      inner +
      "</svg>"
    );
  }

  const shapes = {
    "cookie": () =>
      '<g transform="rotate(-4 60 58)">' +
      '<circle cx="60" cy="58" r="36" fill="' + C.dough + '"/>' +
      '<circle cx="60" cy="58" r="36" fill="none" stroke="' + C.doughDark + '" stroke-width="3"/>' +
      '<circle cx="48" cy="50" r="4" fill="' + C.choc + '"/>' +
      '<circle cx="68" cy="46" r="3.5" fill="' + C.choc + '"/>' +
      '<circle cx="72" cy="66" r="4.5" fill="' + C.choc + '"/>' +
      '<circle cx="52" cy="70" r="3" fill="' + C.choc + '"/>' +
      '<circle cx="59" cy="58" r="3" fill="' + C.choc + '"/>' +
      "</g>",

    "choc-cookie": () =>
      '<g transform="rotate(3 60 58)">' +
      '<circle cx="60" cy="58" r="37" fill="' + C.dough + '"/>' +
      '<path d="M60 21a37 37 0 0 1 0 74Z" fill="' + C.doughDark + '" opacity="0.5"/>' +
      '<circle cx="46" cy="48" r="6" fill="' + C.chocDark + '"/>' +
      '<circle cx="70" cy="44" r="5" fill="' + C.chocDark + '"/>' +
      '<circle cx="76" cy="64" r="6" fill="' + C.chocDark + '"/>' +
      '<circle cx="52" cy="72" r="5" fill="' + C.chocDark + '"/>' +
      '<circle cx="62" cy="58" r="4.5" fill="' + C.chocDark + '"/>' +
      "</g>",

    "nastar": () =>
      '<g transform="rotate(-2 60 60)">' +
      '<circle cx="60" cy="62" r="32" fill="' + C.gold + '"/>' +
      '<circle cx="60" cy="62" r="32" fill="none" stroke="#b9871f" stroke-width="3"/>' +
      '<circle cx="60" cy="58" r="9" fill="' + C.berry + '"/>' +
      '<path d="M60 40c4 4 4 8 0 12-4-4-4-8 0-12Z" fill="' + C.greenDark + '"/>' +
      "</g>",

    "risol": () =>
      '<g transform="rotate(-8 60 62)">' +
      '<ellipse cx="60" cy="72" rx="35" ry="15" fill="' + C.doughDark + '"/>' +
      '<rect x="25" y="40" width="70" height="34" rx="17" fill="' + C.dough + '"/>' +
      '<path d="M40 44c14-6 30-6 44 2" stroke="' + C.doughDark + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="30" cy="57" rx="9" ry="15" fill="' + C.choc + '"/>' +
      '<ellipse cx="30" cy="57" rx="5" ry="10" fill="' + C.chocDark + '"/>' +
      "</g>",

    "cake-slice": () =>
      '<g transform="translate(24 26)">' +
      '<path d="M6 40 L60 20 L66 24 L66 62 L6 68 Z" fill="' + C.dough + '"/>' +
      '<path d="M6 40 L60 20 L66 24 L6 44 Z" fill="' + C.cream + '"/>' +
      '<path d="M6 44 L66 24 L66 34 L6 54 Z" fill="' + C.choc + '"/>' +
      '<path d="M6 54 L66 34 L66 44 L6 64 Z" fill="' + C.dough + '"/>' +
      '<circle cx="52" cy="16" r="6" fill="' + C.berry + '"/>' +
      "</g>",

    "cake-round": () =>
      '<g transform="translate(20 34)">' +
      '<ellipse cx="40" cy="14" rx="40" ry="12" fill="' + C.green + '"/>' +
      '<path d="M0 14 v30 a40 12 0 0 0 80 0 V14" fill="' + C.dough + '"/>' +
      '<path d="M0 14 a40 12 0 0 0 80 0 v6 a40 12 0 0 1 -80 0Z" fill="' + C.greenDark + '"/>' +
      '<circle cx="40" cy="12" r="5" fill="' + C.rose + '"/>' +
      "</g>",

    "croissant": () =>
      '<g transform="rotate(-6 60 60)">' +
      '<path d="M22 74c6-30 34-46 62-40-10 6-16 14-16 24 0 8-8 14-16 14 0 8-8 12-16 10-8-2-14-4-14-8Z" fill="' + C.dough + '"/>' +
      '<path d="M30 66c8-16 24-26 44-26" fill="none" stroke="' + C.doughDark + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M40 74c6-12 18-20 34-22" fill="none" stroke="' + C.doughDark + '" stroke-width="3" stroke-linecap="round"/>' +
      "</g>",

    "danish": () =>
      '<g transform="rotate(4 60 60)">' +
      '<rect x="26" y="34" width="68" height="50" rx="10" fill="' + C.dough + '"/>' +
      '<rect x="26" y="34" width="68" height="50" rx="10" fill="none" stroke="' + C.doughDark + '" stroke-width="3"/>' +
      '<path d="M40 34v50M60 34v50M80 34v50" stroke="' + C.doughDark + '" stroke-width="3"/>' +
      '<path d="M34 52c8 6 12 6 20 0M66 66c8 6 12 6 20 0" stroke="' + C.chocDark + '" stroke-width="5" stroke-linecap="round"/>' +
      "</g>",

    "hamper": () =>
      '<g transform="translate(22 24)">' +
      '<path d="M4 40 h68 v34 a6 6 0 0 1 -6 6 H10 a6 6 0 0 1 -6 -6 Z" fill="' + C.kraft + '"/>' +
      '<path d="M4 40 h68 v10 H4Z" fill="' + C.kraftDark + '"/>' +
      '<rect x="0" y="34" width="76" height="10" rx="4" fill="' + C.kraftDark + '"/>' +
      '<path d="M20 34c0-14 36-14 36 0" fill="none" stroke="' + C.kraftDark + '" stroke-width="4"/>' +
      '<circle cx="24" cy="24" r="7" fill="' + C.dough + '"/>' +
      '<rect x="40" y="16" width="14" height="16" rx="3" fill="' + C.choc + '"/>' +
      '<path d="M38 40 l0 40 M52 40 l0 40" stroke="' + C.pink + '" stroke-width="4"/>' +
      "</g>",

    "cup-cold": () =>
      '<g transform="translate(34 22)">' +
      '<path d="M6 12 h40 l-5 62 a6 6 0 0 1 -6 5 H17 a6 6 0 0 1 -6 -5 Z" fill="' + C.cream + '" opacity="0.9"/>' +
      '<path d="M8 30 h36 l-3 40 a5 5 0 0 1 -5 4 H16 a5 5 0 0 1 -5 -4 Z" fill="' + C.dough + '"/>' +
      '<rect x="2" y="6" width="48" height="9" rx="4" fill="' + C.doughDark + '"/>' +
      '<rect x="30" y="-8" width="6" height="24" rx="3" fill="' + C.ink + '" opacity="0.5"/>' +
      "</g>",

    "cup-hot": () =>
      '<g transform="translate(30 30)">' +
      '<path d="M6 16 h44 v30 a22 22 0 0 1 -44 0 Z" fill="' + C.cream + '"/>' +
      '<path d="M50 22 a12 12 0 0 1 0 22" fill="none" stroke="' + C.doughDark + '" stroke-width="5"/>' +
      '<ellipse cx="28" cy="16" rx="22" ry="7" fill="' + C.choc + '"/>' +
      '<path d="M20 2c-3 4 3 7 0 11M32 0c-3 4 3 7 0 11" stroke="' + C.doughDark + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      "</g>",

    "bottle": () =>
      '<g transform="translate(42 16)">' +
      '<rect x="12" y="0" width="12" height="12" rx="2" fill="' + C.greenDark + '"/>' +
      '<path d="M8 12 h20 v10 l6 10 v44 a6 6 0 0 1 -6 6 H8 a6 6 0 0 1 -6 -6 V32 l6 -10 Z" fill="' + C.teal + '" opacity="0.85"/>' +
      '<rect x="4" y="44" width="28" height="18" fill="' + C.cream + '" opacity="0.8"/>' +
      '<circle cx="18" cy="40" r="4" fill="' + C.gold + '"/>' +
      "</g>",
  };

  function food(shape) {
    const fn = shapes[shape] || shapes.cookie;
    return wrap(fn());
  }

  return { food, palette: C };
})();
