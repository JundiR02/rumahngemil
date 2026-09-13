/* =====================================================================
   Rumah Ngemil — cart.js
   Floating order indicator, fly-to-cart feedback, the order drawer
   panel, and the Section 05 order summary. All driven by RN.store.
   ===================================================================== */
window.RN = window.RN || {};

RN.cart = (function () {
  "use strict";
  const D = RN.data;
  const idr = D.format.idr;

  const fab = document.querySelector("[data-cart-fab]");
  const fabCount = document.querySelector("[data-cart-count]");
  const summaryEl = document.querySelector("[data-order-summary]");

  /* ---------------------------- fly to cart -------------------------- */
  function fly(fromEl) {
    bump();
    if (!fromEl || (RN.motion && RN.motion.reduced)) return;
    const a = fromEl.getBoundingClientRect();
    const b = fab.getBoundingClientRect();
    const token = document.createElement("div");
    token.className = "fly-token";
    token.textContent = "🍪";
    token.style.left = a.left + a.width / 2 - 17 + "px";
    token.style.top = a.top + a.height / 2 - 17 + "px";
    document.body.appendChild(token);
    const dx = (b.left + b.width / 2) - (a.left + a.width / 2);
    const dy = (b.top + b.height / 2) - (a.top + a.height / 2);
    const anim = token.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(1.1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy}px) scale(.3)`, opacity: 0.2 },
      ],
      { duration: 620, easing: "cubic-bezier(.5,.05,.5,1)" }
    );
    anim.onfinish = () => token.remove();
  }

  function bump() {
    fab.classList.remove("is-bump");
    void fab.offsetWidth;
    fab.classList.add("is-bump");
  }

  /* ----------------------------- FAB sync --------------------------- */
  function renderFab(s) {
    const n = s.totals.count;
    fabCount.textContent = String(n);
    fab.hidden = n === 0;
    fab.setAttribute("aria-label", `Buka pesanan — ${n} item`);
  }

  fab.addEventListener("click", () => RN.panel.open("drawer"));

  /* --------------------------- DRAWER panel ------------------------- */
  RN.panel.register("drawer", function (_data, api) {
    const s0 = RN.store.getState();

    function linesHtml(s) {
      if (!s.items.length) {
        return `<div class="ordersummary__empty">
          <p>Belum ada camilan</p>
          <p>Ketuk gerai di ilustrasi atau buka menu untuk mulai memilih.</p>
          <button type="button" class="btn btn--primary" style="margin-top:1.2rem" data-open-menu>Buka menu</button>
        </div>`;
      }
      return s.items.map((it) => `
        <div class="drawer__line" data-key="${it.key}">
          <div class="drawer__thumb" aria-hidden="true">${RN.svg.food(it.shape)}</div>
          <div>
            <div class="drawer__nm">${it.name}</div>
            ${it.variantLabel ? `<div class="drawer__vr">${it.variantLabel}</div>` : ""}
            <div class="drawer__pr price">${idr(it.price * it.qty)}</div>
          </div>
          <div class="drawer__ctrls">
            <div class="qty" role="group" aria-label="Jumlah ${it.name}">
              <button type="button" class="qty__btn" data-dq="-1" aria-label="Kurangi">–</button>
              <span class="qty__val">${it.qty}</span>
              <button type="button" class="qty__btn" data-dq="1" aria-label="Tambah">+</button>
            </div>
            <button type="button" class="drawer__rm" data-rm aria-label="Hapus ${it.name}">Hapus</button>
          </div>
        </div>`).join("");
    }

    function optsHtml(s) {
      if (!s.items.length) return "";
      return `
        <div class="drawer__opts">
          <span class="field" style="margin-top:0"><span>Pengambilan</span></span>
          <div class="segmented" role="group" aria-label="Metode pengambilan" data-seg>
            <button type="button" data-ff="pickup" aria-pressed="${s.fulfillment === "pickup"}">Ambil sendiri</button>
            <button type="button" data-ff="delivery" aria-pressed="${s.fulfillment === "delivery"}">Diantar</button>
          </div>
          <label class="field">
            <span>Catatan untuk dapur</span>
            <textarea data-notes placeholder="Contoh: tolong dipisah, tanpa kacang, untuk jam 4 sore…">${s.notes || ""}</textarea>
          </label>
        </div>`;
    }

    function footHtml(s) {
      if (!s.items.length) return "";
      const t = s.totals;
      return `
        <div class="foot__row"><span>Subtotal</span><span>${idr(t.subtotal)}</span></div>
        ${t.fee ? `<div class="foot__row"><span>Ongkir</span><span>${idr(t.fee)}</span></div>` : ""}
        <div class="foot__row foot__total"><span>Total</span><span>${idr(t.grand)}</span></div>
        <button type="button" class="btn btn--primary btn--block" data-checkout>Lanjut ke Checkout</button>`;
    }

    return {
      variant: "drawer",
      eyebrow: "Pesananmu",
      title: "Keranjang Rumah Ngemil",
      body: `<div data-lines>${linesHtml(s0)}</div><div data-opts>${optsHtml(s0)}</div>`,
      foot: footHtml(s0),
      onMount(el) {
        const linesBox = el.querySelector("[data-lines]");
        const optsBox = el.querySelector("[data-opts]");
        const footBox = el.querySelector(".panel__foot");

        // line +/- and remove (delegated — survives innerHTML swaps)
        linesBox.addEventListener("click", (e) => {
          const row = e.target.closest(".drawer__line");
          const openMenu = e.target.closest("[data-open-menu]");
          if (openMenu) { api.close(); RN.panel.open("menu"); return; }
          if (!row) return;
          const key = row.dataset.key;
          const it = RN.store.getState().items.find((x) => x.key === key);
          if (e.target.closest("[data-rm]")) { RN.store.removeItem(key); return; }
          const dq = e.target.closest("[data-dq]");
          if (dq && it) RN.store.setQty(key, it.qty + (+dq.dataset.dq));
        });

        // options (rebuilt only when items appear/disappear — safe to delegate)
        optsBox.addEventListener("click", (e) => {
          const ff = e.target.closest("[data-ff]");
          if (ff) RN.store.setFulfillment(ff.dataset.ff);
        });
        optsBox.addEventListener("input", (e) => {
          if (e.target.matches("[data-notes]")) RN.store.setNotes(e.target.value);
        });

        if (footBox) footBox.addEventListener("click", (e) => {
          if (e.target.closest("[data-checkout]")) { api.close(); RN.panel.open("checkout"); }
        });

        let hadItems = s0.items.length > 0;
        api._unsub = RN.store.subscribe((s) => {
          linesBox.innerHTML = linesHtml(s);
          if (footBox) footBox.innerHTML = footHtml(s);
          const nowHasItems = s.items.length > 0;
          if (nowHasItems !== hadItems || !optsBox.children.length) {
            optsBox.innerHTML = optsHtml(s);
            hadItems = nowHasItems;
          } else {
            // just reflect the fulfillment toggle without nuking the textarea
            optsBox.querySelectorAll("[data-ff]").forEach((b) =>
              b.setAttribute("aria-pressed", String(b.dataset.ff === s.fulfillment)));
          }
        });
      },
      onClose() { if (api._unsub) api._unsub(); },
    };
  });

  /* ---------------------- Section 05: order summary ---------------- */
  function renderSummary(s) {
    if (!summaryEl) return;
    if (!s.items.length) {
      summaryEl.innerHTML = `
        <div class="ordersummary__empty">
          <p>Pesananmu masih kosong</p>
          <p>Setiap camilan yang kamu pilih akan tersimpan di sini — bisa dibuka lagi kapan saja.</p>
          <button type="button" class="btn btn--primary" style="margin-top:1.4rem" data-open-menu>Mulai memilih</button>
        </div>`;
    } else {
      const t = s.totals;
      summaryEl.innerHTML = `
        <div class="ordersummary__list">
          ${s.items.map((it) => `
            <div class="ordersummary__row">
              <div>
                <div class="ordersummary__name">${it.name}</div>
                <div class="ordersummary__meta">${it.qty} × ${idr(it.price)}${it.variantLabel ? " · " + it.variantLabel : ""}</div>
              </div>
              <div class="price">${idr(it.price * it.qty)}</div>
            </div>`).join("")}
        </div>
        <div class="ordersummary__foot">
          <div class="ordersummary__total">Total <span>${idr(t.grand)}</span></div>
          <div style="display:flex;gap:.6rem;flex-wrap:wrap">
            <button type="button" class="btn btn--ghost" data-open-drawer>Ubah pesanan</button>
            <button type="button" class="btn btn--primary" data-go-checkout>Lanjut ke Checkout</button>
          </div>
        </div>`;
    }
    summaryEl.querySelectorAll("[data-open-menu]").forEach((b) =>
      b.addEventListener("click", () => RN.panel.open("menu")));
    summaryEl.querySelectorAll("[data-open-drawer]").forEach((b) =>
      b.addEventListener("click", () => RN.panel.open("drawer")));
    summaryEl.querySelectorAll("[data-go-checkout]").forEach((b) =>
      b.addEventListener("click", () => RN.panel.open("checkout")));
  }

  function init() {
    RN.store.subscribe((s) => {
      renderFab(s);
      renderSummary(s);
    });
  }

  return { init, fly, bump };
})();
