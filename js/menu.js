/* =====================================================================
   Rumah Ngemil — menu.js
   Panel renderers: "menu" (paper sheet with category tabs + product grid)
   and "product" (paper card that lifts with a slight rotation).
   ===================================================================== */
window.RN = window.RN || {};

(function () {
  "use strict";
  const D = RN.data;
  const idr = D.format.idr;

  /* --------------------------- MENU renderer ------------------------- */
  RN.panel.register("menu", function (data, api) {
    let activeCat = (data && data.category) || "cookies";

    function grid(cat) {
      const items = D.productsByCategory(cat);
      return items.map((p, i) => `
        <article class="prodcard" style="--i:${i}">
          ${p.badge ? `<span class="prodcard__badge">${p.badge}</span>` : ""}
          <button type="button" class="prodcard__art" data-open-product="${p.id}"
            aria-label="Lihat detail ${p.name}">${RN.svg.food(p.shape)}</button>
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

    function body() {
      const tabs = D.categories.map((c) => `
        <button type="button" class="cattab" role="tab"
          id="tab-${c.id}" aria-controls="catpanel"
          aria-selected="${c.id === activeCat}" data-cat="${c.id}">
          ${c.label}
        </button>`).join("");
      const cat = D.categories.find((c) => c.id === activeCat);
      return `
        <div class="cattabs" role="tablist" aria-label="Kategori camilan">${tabs}</div>
        <p class="cattab__blurb" data-blurb>${cat.blurb}</p>
        <div class="prodgrid" id="catpanel" role="tabpanel" aria-labelledby="tab-${activeCat}" data-grid>
          ${grid(activeCat)}
        </div>`;
    }

    return {
      variant: "menu",
      sheetEdge: true,
      eyebrow: "Menu Rumah Ngemil",
      title: "Silakan, lihat yang kami buat",
      sub: "Dipilih dari data — tambah kategori kapan saja.",
      body: body(),
      onMount(el) {
        const grfx = el.querySelector("[data-grid]");
        const blurb = el.querySelector("[data-blurb]");

        el.querySelectorAll("[data-cat]").forEach((tab) => {
          tab.addEventListener("click", () => {
            activeCat = tab.dataset.cat;
            el.querySelectorAll("[data-cat]").forEach((t) =>
              t.setAttribute("aria-selected", String(t === tab)));
            const c = D.categories.find((x) => x.id === activeCat);
            blurb.textContent = c.blurb;
            grfx.setAttribute("aria-labelledby", "tab-" + activeCat);
            grfx.innerHTML = grid(activeCat);
            wireGrid(el);
            RN.live(`Menampilkan ${c.label}, ${D.productsByCategory(activeCat).length} produk`);
          });
        });
        wireGrid(el);
      },
    };

    function wireGrid(el) {
      el.querySelectorAll("[data-open-product]").forEach((b) =>
        b.addEventListener("click", () =>
          RN.panel.open("product", { id: b.dataset.openProduct })));
      el.querySelectorAll("[data-quick-add]").forEach((b) =>
        b.addEventListener("click", () => {
          const p = D.productById(b.dataset.quickAdd);
          const variant = p.variants && p.variants.length ? p.variants[0].id : null;
          RN.store.addItem(p, 1, variant);
          RN.cart.fly(b);
          RN.live(`${p.name} ditambahkan ke pesanan`);
        }));
    }
  });

  /* -------------------------- PRODUCT renderer --------------------- */
  RN.panel.register("product", function (data) {
    const p = D.productById(data && data.id);
    if (!p) return { title: "Produk tidak ditemukan", body: "<p>Maaf, produk ini tidak tersedia.</p>" };

    let qty = 1;
    let variant = p.variants && p.variants.length ? p.variants[0].id : null;

    const variantHtml = p.variants && p.variants.length
      ? `<div class="proddetail__variants" role="group" aria-label="Pilihan">
          ${p.variants.map((v) => `
            <button type="button" class="variant-chip" data-variant="${v.id}"
              aria-pressed="${v.id === variant}">${v.label}</button>`).join("")}
        </div>`
      : "";

    return {
      variant: "product",
      eyebrow: D.categories.find((c) => c.id === p.category).label + " · Kartu produk",
      title: p.name,
      body: `
        <div class="proddetail">
          <div class="proddetail__art">${RN.svg.food(p.shape)}</div>
          <div class="proddetail__info">
            <p class="proddetail__desc">${p.description}</p>
            <p class="price proddetail__price" data-price>${idr(p.price)}</p>
            ${variantHtml}
            <div class="proddetail__row">
              <div class="qty" role="group" aria-label="Jumlah">
                <button type="button" class="qty__btn" data-q="-1" aria-label="Kurangi">–</button>
                <span class="qty__val" data-qval aria-live="polite">1</span>
                <button type="button" class="qty__btn" data-q="1" aria-label="Tambah">+</button>
              </div>
              <button type="button" class="btn btn--primary proddetail__cta" data-add data-autofocus>
                Tambah ke Pesanan
              </button>
            </div>
          </div>
        </div>`,
      onMount(el, api) {
        const qval = el.querySelector("[data-qval]");
        const priceEl = el.querySelector("[data-price]");
        const cta = el.querySelector("[data-add]");

        function syncPrice() { priceEl.textContent = idr(p.price * qty); }

        el.querySelectorAll("[data-q]").forEach((b) =>
          b.addEventListener("click", () => {
            qty = Math.max(1, Math.min(99, qty + (+b.dataset.q)));
            qval.textContent = String(qty);
            syncPrice();
          }));

        el.querySelectorAll("[data-variant]").forEach((b) =>
          b.addEventListener("click", () => {
            variant = b.dataset.variant;
            el.querySelectorAll("[data-variant]").forEach((x) =>
              x.setAttribute("aria-pressed", String(x === b)));
          }));

        cta.addEventListener("click", () => {
          RN.store.addItem(p, qty, variant);
          RN.cart.fly(cta);
          cta.classList.add("is-added");
          cta.textContent = "Ditambahkan ✓";
          RN.live(`${qty} ${p.name} ditambahkan ke pesanan`);
          setTimeout(() => api.close(), 620);
        });
      },
    };
  });
})();
