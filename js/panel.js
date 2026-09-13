/* =====================================================================
   Rumah Ngemil — panel.js
   ONE reusable interaction shell. Every section registers a renderer;
   opening a type builds the shared <.panel> with a type-specific class
   so each gets its own movement. Supports a small stack (menu -> product)
   so it never collapses into a single "modal" pattern.
   ===================================================================== */
window.RN = window.RN || {};

RN.panel = (function () {
  "use strict";

  const root = document.querySelector("[data-panel-root]");
  const renderers = Object.create(null);
  const stack = []; // { type, el, data, restoreFocus, onClose }
  let backdrop = null;

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function reduced() {
    return !!(RN.motion && RN.motion.reduced);
  }

  function register(type, fn) { renderers[type] = fn; }

  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
    document.body.style.overflow = on ? "hidden" : "";
  }

  function ensureBackdrop() {
    if (backdrop) return;
    const bd = document.createElement("div");
    bd.className = "panel-backdrop";
    bd.addEventListener("click", () => {
      const top = stack[stack.length - 1];
      if (top && top.type !== "checkout") close();
    });
    backdrop = bd;
    root.appendChild(bd);
    requestAnimationFrame(() => { if (bd.isConnected) bd.classList.add("is-open"); });
  }

  function removeBackdrop() {
    if (!backdrop) return;
    const b = backdrop;
    backdrop = null;
    b.classList.remove("is-open");
    afterTransition(b, () => b.remove());
  }

  function afterTransition(el, done) {
    if (reduced()) { done(); return; }
    let called = false;
    const fin = () => { if (called) return; called = true; el.removeEventListener("transitionend", fin); done(); };
    el.addEventListener("transitionend", fin);
    setTimeout(fin, 460);
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    const top = stack[stack.length - 1];
    if (!top) return;
    const nodes = [...top.el.querySelectorAll(FOCUSABLE)].filter(
      (n) => n.getClientRects().length > 0
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      const top = stack[stack.length - 1];
      if (top) { e.preventDefault(); close(); }
    } else {
      trapFocus(e);
    }
  }

  function headMarkup(cfg) {
    const eyebrow = cfg.eyebrow ? `<p class="panel__eyebrow">${cfg.eyebrow}</p>` : "";
    const sub = cfg.sub ? `<p class="panel__sub">${cfg.sub}</p>` : "";
    return `
      <div class="panel__head">
        <div>
          ${eyebrow}
          <h2 class="panel__title" id="${cfg.titleId}">${cfg.title || ""}</h2>
          ${sub}
        </div>
        <button type="button" class="panel__close" data-panel-close aria-label="Tutup">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>`;
  }

  /**
   * open(type, data)
   *  - type: registered renderer key
   *  - data: passed to the renderer
   * renderer(data, api) -> {
   *     variant: css suffix (defaults to type),
   *     sheetEdge: bool, eyebrow, title, sub,
   *     body: html string (goes inside .panel__body) OR
   *     raw: html string (full control inside .panel, no default body wrapper),
   *     onMount(el, api), onClose()
   *  }
   *  api = { close, open, refresh, setBusy, data }
   */
  function open(type, data) {
    const renderer = renderers[type];
    if (!renderer) { console.warn("No panel renderer:", type); return; }

    ensureBackdrop();

    const titleId = "panel-title-" + Math.random().toString(36).slice(2, 8);
    const api = {
      close,
      open,
      data,
      refresh: () => rerender(entry),
      setBusy: (b) => entry.el.setAttribute("aria-busy", b ? "true" : "false"),
    };

    const cfg = renderer(data, api) || {};
    const variant = cfg.variant || type;

    const el = document.createElement("div");
    el.className = "panel panel--" + variant + (cfg.sheetEdge ? " panel--sheet-edge" : "");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", titleId);

    cfg.titleId = titleId;
    el.innerHTML = cfg.raw != null
      ? cfg.raw
      : headMarkup(cfg) + `<div class="panel__body">${cfg.body || ""}</div>` +
        (cfg.foot ? `<div class="panel__foot">${cfg.foot}</div>` : "");

    root.appendChild(el);

    const entry = { type, el, data, cfg, renderer, api, restoreFocus: document.activeElement };
    stack.push(entry);

    el.querySelectorAll("[data-panel-close]").forEach((b) =>
      b.addEventListener("click", () => close())
    );

    if (stack.length === 1) {
      document.addEventListener("keydown", onKeydown, true);
      lockScroll(true);
    }

    requestAnimationFrame(() => {
      if (!el.isConnected) return;
      el.classList.add("is-open");
      const focusTarget =
        el.querySelector("[data-autofocus]") ||
        el.querySelector(FOCUSABLE);
      if (focusTarget) focusTarget.focus();
    });

    if (typeof cfg.onMount === "function") cfg.onMount(el, api);
    entry.onClose = cfg.onClose;

    if (RN.hero && type === "menu") RN.hero.camera(true);
    return api;
  }

  function rerender(entry) {
    const cfg = entry.renderer(entry.data, entry.api) || {};
    cfg.titleId = entry.el.getAttribute("aria-labelledby");
    const wasOpen = entry.el.classList.contains("is-open");
    entry.el.innerHTML = cfg.raw != null
      ? cfg.raw
      : headMarkup(cfg) + `<div class="panel__body">${cfg.body || ""}</div>` +
        (cfg.foot ? `<div class="panel__foot">${cfg.foot}</div>` : "");
    if (wasOpen) entry.el.classList.add("is-open");
    entry.el.querySelectorAll("[data-panel-close]").forEach((b) =>
      b.addEventListener("click", () => close())
    );
    entry.cfg = cfg;
    if (typeof cfg.onMount === "function") cfg.onMount(entry.el, entry.api);
  }

  function close() {
    const entry = stack.pop();
    if (!entry) return;

    if (typeof entry.onClose === "function") {
      try { entry.onClose(); } catch (e) { console.error(e); }
    }

    entry.el.classList.remove("is-open");
    entry.el.setAttribute("aria-hidden", "true");
    afterTransition(entry.el, () => entry.el.remove());

    if (stack.length === 0) {
      document.removeEventListener("keydown", onKeydown, true);
      lockScroll(false);
      removeBackdrop();
      if (RN.hero) RN.hero.camera(false);
    }

    const back = entry.restoreFocus;
    if (back && typeof back.focus === "function") {
      requestAnimationFrame(() => back.focus());
    }
  }

  function closeAll() {
    while (stack.length) close();
  }

  function isOpen(type) {
    return type
      ? stack.some((s) => s.type === type)
      : stack.length > 0;
  }

  return { register, open, close, closeAll, isOpen };
})();
