# Rumah Ngemil — Interactive Storytelling Landing Page

> **Semua berawal dari rumah.**

A premium, interactive papercut-diorama landing page + lightweight ecommerce flow
for *Rumah Ngemil*, a homemade snack outlet from Sidenreng, Rappang.

Built with **plain HTML + CSS + JavaScript** — no framework, no build step, no
runtime dependencies. Animation is CSS-transform / WAAPI only. Everything respects
`prefers-reduced-motion` and works without JavaScript for content.

## Run it

Just open `index.html` in a browser. (Google Fonts loads from the CDN when online;
there are system-serif / system-sans fallbacks otherwise.)

For a local server:

```
python -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html              semantic shell + static editorial sections + the map SVG
aset/
  hero.png              the papercut diorama (visual foundation of the hero)
  logo.jpg
styles/
  base.css              design tokens, reset, typography, buttons, reveal, grain
  hero.css              the interactive world: scene, hotspots, parallax, world-nav
  sections.css          the five storybook sections + footer
  panels.css            the ONE reusable panel shell + all its variants, cart FAB, confetti
js/
  data.js              all content (products, categories, location, story) — UI-free
  svg.js               tiny paper-cut illustrations per product shape (no image assets)
  state.js             the single store: cart, fulfilment, buyer, checkout — localStorage-backed
  panel.js             InteractivePanel: register(type) + open/close, focus-trap, stack, ESC
  menu.js              renderers: "menu" (paper sheet) and "product" (paper card)
  cart.js              FAB, fly-to-cart, "drawer" renderer, Section 05 summary
  checkout.js          renderer: "checkout" — immersive 5-step flow + paper confetti
  location.js          renderers: "location" (illustrated map) and "story" (editorial)
  hero.js              pointer parallax, ambient motes, hotspot wiring, camera push
  sections.js          Section 02 dishes, scroll reveals, nav active-state + auto-hide
  main.js              motion preference, a11y live region, boot order
```

## Interaction model (one system, varied patterns)

Every overlay is the same `RN.panel` shell with a variant class, so transitions
stay consistent while each pattern feels distinct:

| Trigger (in the illustration or a section)      | Pattern                              |
|------------------------------------------------|--------------------------------------|
| Outlet / "Lihat menu lengkap"                  | camera push → **paper sheet** rises  |
| A product                                      | **paper card** lifts with a rotation |
| "Fresh Homemade Happiness" seal / ✨ Tentang    | **editorial overlay**                |
| "Sidenreng, Rappang" sign / 📍 map pin          | **illustrated map panel**            |
| Cart FAB / 🛒 Pesanan                           | **side drawer** (bottom sheet on mobile) |
| "Lanjut ke Checkout"                           | **immersive full-bleed flow** (5 steps) |

## Adding products

Append to `RN.data.products` in `js/data.js`:

```js
{
  id: "cookie-matcha",
  name: "Cookie Matcha",
  category: "cookies",          // must match a categories[].id
  price: 27000,                  // integer rupiah
  shape: "cookie",              // key in js/svg.js (falls back to "cookie")
  description: "…",
  badge: "Baru",                // optional pill
  featured: true,                // optional — shows on the Section 02 table
  variants: [{ id: "reg", label: "Toples 12 pcs" }]
}
```

The menu, the table, and search-by-category all regenerate from data.

## Accessibility

- Every hotspot is a real `<button>` with a meaningful `aria-label`.
- Panels are `role="dialog" aria-modal`, focus-trapped, ESC-closable, focus restored on close.
- Live region announces menu changes, add-to-cart, and checkout step changes.
- Visible focus rings; semantic headings; sufficient contrast on the cream palette.
- Full `prefers-reduced-motion` support: parallax, camera, confetti, fly-to-cart,
  and reveal animations all disable; layout and flow are unchanged.
