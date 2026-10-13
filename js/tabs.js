/* =====================================================================
   Rumah Ngemil — tabs.js
   The app shell's bottom tab bar: shows/hides the five .view sections
   and builds the Pesanan tab's category tabs + product grid (the same
   markup/behaviour menu.js's floating "menu" panel used, just rendered
   permanently on the page instead of in an overlay — real data, from
   RN.data.products, not placeholders).
   ===================================================================== */
window.RN = window.RN || {};

RN.tabs = (function () {
  "use strict";
  const D = RN.data;
  const idr = D.format.idr;

  const tabsNav = document.querySelector("#tabs");
  const views = [...document.querySelectorAll(".view")];
  const buttons = tabsNav ? [...tabsNav.querySelectorAll("[data-tab]")] : [];

  function show(name) {
    let matched = false;
    views.forEach((v) => {
      const on = v.id === "view-" + name;
      v.hidden = !on;
      if (on) matched = true;
    });
    if (!matched) return; // unknown tab name — leave state as-is
    buttons.forEach((b) => {
      if (b.dataset.tab === name) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    if (RN.live) RN.live(`Tab ${name} dibuka`);
  }

  function wireTabBar() {
    buttons.forEach((b) => b.addEventListener("click", () => show(b.dataset.tab)));
  }

  /* -------------------------- Pesanan tab -------------------------- */
  function wirePesanan() {
    const cattabsBox = document.querySelector("[data-pesanan-cattabs]");
    const blurbEl = document.querySelector("[data-pesanan-blurb]");
    const gridBox = document.querySelector("[data-pesanan-grid]");
    if (!cattabsBox || !gridBox) return;

    let activeCat = D.categories[0].id;

    function grid(cat) {
      return D.productsByCategory(cat).map((p, i) => `
        <article class="prodcard" style="--i:${i}">
          ${p.badge ? `<span class="prodcard__badge">${p.badge}</span>` : ""}
          <button type="button" class="prodcard__art" data-open-product="${p.id}"
            aria-label="Lihat detail ${p.name}">${RN.media.art(p)}</button>
          <h3 class="prodcard__name">${p.name}</h3>
          <p class="prodcard__desc">${p.description}</p>
          <div class="prodcard__foot">
            <span class="price prodcard__price">${idr(p.price)}</span>
            <button type="button" class="prodcard__add" data-quick-add="${p.id}">
              <span aria-hidden="true">+</span> Tambah
            </button>
          </div>
        </article>`).join("");
    }

    function renderTabs() {
      cattabsBox.innerHTML = D.categories.map((c) => `
        <button type="button" class="cattab" role="tab"
          id="pesanan-tab-${c.id}" aria-controls="pesanan-grid"
          aria-selected="${c.id === activeCat}" data-cat="${c.id}">${c.label}</button>`).join("");
      cattabsBox.querySelectorAll("[data-cat]").forEach((tab) => {
        tab.addEventListener("click", () => {
          activeCat = tab.dataset.cat;
          renderTabs();
          renderGrid();
        });
      });
    }

    function renderGrid() {
      const cat = D.categories.find((c) => c.id === activeCat);
      blurbEl.textContent = cat.blurb;
      gridBox.setAttribute("aria-labelledby", "pesanan-tab-" + activeCat);
      gridBox.innerHTML = grid(activeCat);
      gridBox.querySelectorAll("[data-open-product]").forEach((b) =>
        b.addEventListener("click", () => RN.panel.open("product", { id: b.dataset.openProduct })));
      gridBox.querySelectorAll("[data-quick-add]").forEach((b) =>
        b.addEventListener("click", () => {
          const p = D.productById(b.dataset.quickAdd);
          const variant = p.variants && p.variants.length ? p.variants[0].id : null;
          RN.store.addItem(p, 1, variant);
          RN.cart.fly(b);
          if (RN.live) RN.live(`${p.name} ditambahkan ke pesanan`);
        }));
    }

    gridBox.id = "pesanan-grid";
    renderTabs();
    renderGrid();
  }

  function init() {
    wireTabBar();
    wirePesanan();
    show("ngemil");
  }

  return { init, show };
})();
