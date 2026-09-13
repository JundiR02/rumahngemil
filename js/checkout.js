/* =====================================================================
   Rumah Ngemil — checkout.js
   Immersive 5-step flow inside the shared panel shell (variant:
   "checkout"). Continues the story; ends warm and celebratory.
   ===================================================================== */
window.RN = window.RN || {};

(function () {
  "use strict";
  const D = RN.data;
  const idr = D.format.idr;

  const STEPS = ["Pesanan", "Data Pemesan", "Pengambilan", "Pembayaran", "Selesai"];

  RN.panel.register("checkout", function (_data, api) {
    let step = 0;

    /* --------------------------- step panes ------------------------- */
    function paneReview(s) {
      if (!s.items.length) {
        return `<div class="checkout__pane">
          <h3>Pesanan masih kosong</h3>
          <p>Pilih beberapa camilan dulu, lalu kembali ke sini.</p>
          <div class="checkout__nav">
            <button type="button" class="btn btn--primary" data-open-menu>Buka menu</button>
          </div>
        </div>`;
      }
      const t = s.totals;
      return `<div class="checkout__pane">
        <h3>Periksa pesananmu</h3>
        <div class="checkout__lines">
          ${s.items.map((it) => `
            <div class="checkout__line">
              <span><b>${it.qty}×</b> ${it.name}${it.variantLabel ? ` <span style="color:var(--ink-faint)">· ${it.variantLabel}</span>` : ""}</span>
              <span>${idr(it.price * it.qty)}</span>
            </div>`).join("")}
          <div class="checkout__line"><span>Subtotal</span><span>${idr(t.subtotal)}</span></div>
          ${t.fee ? `<div class="checkout__line"><span>Ongkir</span><span>${idr(t.fee)}</span></div>` : ""}
          <div class="checkout__line" style="font-family:var(--font-display);font-size:1.15rem">
            <span>Total</span><span>${idr(t.grand)}</span></div>
        </div>
        ${navRow({ next: "Lanjut" })}
      </div>`;
    }

    function paneBuyer(s) {
      const b = s.buyer;
      return `<div class="checkout__pane">
        <h3>Untuk siapa camilannya?</h3>
        <div class="checkout__grid">
          <label class="field field--wide" data-f="name">
            <span>Nama</span>
            <input type="text" name="name" autocomplete="name" value="${attr(b.name)}" required />
            <span class="field__err">Isi nama pemesan.</span>
          </label>
          <label class="field" data-f="phone">
            <span>Nomor WhatsApp</span>
            <input type="tel" name="phone" inputmode="tel" autocomplete="tel" value="${attr(b.phone)}" placeholder="08xx" required />
            <span class="field__err">Isi nomor yang bisa dihubungi.</span>
          </label>
          <label class="field" data-f="email">
            <span>Email <span style="text-transform:none;color:var(--ink-faint)">(opsional)</span></span>
            <input type="email" name="email" autocomplete="email" value="${attr(b.email)}" placeholder="nama@email.com" />
            <span class="field__err">Format email belum benar.</span>
          </label>
        </div>
        ${navRow({ next: "Lanjut", back: true })}
      </div>`;
    }

    function paneFulfil(s) {
      const b = s.buyer;
      const delivery = s.fulfillment === "delivery";
      return `<div class="checkout__pane">
        <h3>Diambil atau diantar?</h3>
        <div class="radiocard">
          <label>
            <input type="radio" name="ff" value="pickup" ${!delivery ? "checked" : ""} />
            <span><span class="rc__t">Ambil di rumah kami</span>
              <span class="rc__d">${D.location.address} · ${D.location.hours}</span></span>
          </label>
          <label>
            <input type="radio" name="ff" value="delivery" ${delivery ? "checked" : ""} />
            <span><span class="rc__t">Diantar ke alamatmu</span>
              <span class="rc__d">Dalam kota Sidrap · ongkir ${idr(s.totals.deliveryFee)}</span></span>
          </label>
        </div>
        <div class="checkout__grid" style="margin-top:1.2rem">
          <label class="field ${delivery ? "" : "sr-only"} field--wide" data-f="address" ${delivery ? "" : "aria-hidden=\"true\""}>
            <span>Alamat pengantaran</span>
            <textarea name="address">${attr(b.address)}</textarea>
            <span class="field__err">Isi alamat pengantaran.</span>
          </label>
          <label class="field field--wide" data-f="time">
            <span>Waktu ${delivery ? "diantar" : "diambil"}</span>
            <input type="text" name="time" value="${attr(b.time)}" placeholder="Contoh: hari ini jam 4 sore" />
          </label>
        </div>
        ${navRow({ next: "Lanjut", back: true })}
      </div>`;
    }

    function panePayment(s) {
      const opt = (v, t, d) => `
        <label>
          <input type="radio" name="pay" value="${v}" ${s.payment === v ? "checked" : ""} />
          <span><span class="rc__t">${t}</span><span class="rc__d">${d}</span></span>
        </label>`;
      return `<div class="checkout__pane">
        <h3>Cara pembayaran</h3>
        <div class="radiocard">
          ${opt("transfer", "Transfer bank", "Nomor rekening dikirim lewat WhatsApp setelah pesanan dibuat.")}
          ${opt("qris", "QRIS", "Scan & bayar dari aplikasi apa pun.")}
          ${opt("cod", "Bayar saat ambil / terima", "Tunai atau transfer langsung ke kami.")}
        </div>
        <p style="margin-top:1rem;color:var(--ink-soft);font-size:.88rem">
          Total dibayar: <b>${idr(s.totals.grand)}</b>
        </p>
        ${navRow({ next: "Buat pesanan", back: true })}
      </div>`;
    }

    function paneDone(s) {
      const pickup = s.fulfillment !== "delivery";
      return `<div class="checkout__pane checkout__done">
        <div class="checkout__done-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h3>Pesananmu sedang menuju rumah.</h3>
        <p>${pickup
          ? "Kami mulai siapkan sekarang. Nanti kami kabari lewat WhatsApp saat sudah bisa diambil."
          : "Kami mulai siapkan sekarang. Kurir akan mengabari saat berangkat ke alamatmu."}</p>
        <p style="font-family:var(--font-display);font-style:italic;color:var(--ink);margin-top:1rem">
          Pesananmu sudah siap dimulai.
        </p>
        <button type="button" class="btn btn--primary" data-finish>Kembali ke dunia Rumah Ngemil</button>
      </div>`;
    }

    function navRow({ next, back }) {
      return `<div class="checkout__nav">
        ${back ? `<button type="button" class="btn btn--ghost" data-back>Kembali</button>` : ""}
        <button type="button" class="btn btn--primary" data-next>${next}</button>
      </div>`;
    }

    /* ---------------------------- progress ------------------------- */
    function progressHtml() {
      return STEPS.map((label, i) => `
        <div class="checkout__step ${i < step ? "is-done" : ""} ${i === step ? "is-active" : ""}">
          <span class="checkout__step-bar"></span>
          <span class="checkout__step-label">${i + 1}. ${label}</span>
        </div>`).join("");
    }

    function paneFor(s) {
      switch (step) {
        case 0: return paneReview(s);
        case 1: return paneBuyer(s);
        case 2: return paneFulfil(s);
        case 3: return panePayment(s);
        case 4: return paneDone(s);
        default: return paneReview(s);
      }
    }

    /* ----------------------------- render ------------------------- */
    function render(el) {
      const s = RN.store.getState();
      el.querySelector("[data-progress]").innerHTML = progressHtml();
      el.querySelector("[data-pane]").innerHTML = paneFor(s);
      wire(el);
      const h = el.querySelector(".checkout__pane h3");
      if (h) { el.querySelector(".panel__body").scrollTop = 0; }
      RN.live(`Langkah ${step + 1} dari 5: ${STEPS[step]}`);
    }

    function validate(el) {
      const s = RN.store.getState();
      let ok = true;
      const fail = (name) => {
        const f = el.querySelector(`[data-f="${name}"]`);
        if (f) f.classList.add("field--err");
        ok = false;
      };
      el.querySelectorAll(".field--err").forEach((f) => f.classList.remove("field--err"));

      if (step === 0) return s.items.length > 0;
      if (step === 1) {
        if (!s.buyer.name.trim()) fail("name");
        if (!/\d{6,}/.test(s.buyer.phone)) fail("phone");
        if (s.buyer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.buyer.email)) fail("email");
      }
      if (step === 2) {
        if (s.fulfillment === "delivery" && !s.buyer.address.trim()) fail("address");
      }
      return ok;
    }

    function wire(el) {
      el.querySelectorAll("[data-open-menu]").forEach((b) =>
        b.addEventListener("click", () => { api.close(); RN.panel.open("menu"); }));

      el.querySelectorAll("input[name='name'],input[name='phone'],input[name='email'],input[name='time'],textarea[name='address']").forEach((inp) => {
        inp.addEventListener("input", () => {
          RN.store.setBuyer({ [inp.name]: inp.value });
        });
      });

      el.querySelectorAll("input[name='ff']").forEach((r) =>
        r.addEventListener("change", () => { RN.store.setFulfillment(r.value); render(el); }));
      el.querySelectorAll("input[name='pay']").forEach((r) =>
        r.addEventListener("change", () => RN.store.setPayment(r.value)));

      const back = el.querySelector("[data-back]");
      if (back) back.addEventListener("click", () => { step = Math.max(0, step - 1); render(el); });

      const next = el.querySelector("[data-next]");
      if (next) next.addEventListener("click", () => {
        if (!validate(el)) { RN.live("Ada isian yang belum lengkap."); return; }
        if (step === 3) {
          // order is "placed" — empty the basket, then show the warm close
          RN.store.clear();
          step = 4;
          render(el);
          celebrate();
          return;
        }
        step = Math.min(4, step + 1);
        render(el);
      });

      const finish = el.querySelector("[data-finish]");
      if (finish) finish.addEventListener("click", () => { step = 0; api.close(); });
    }

    return {
      variant: "checkout",
      raw: `
        <div class="panel__head">
          <div>
            <p class="panel__eyebrow">Checkout Rumah Ngemil</p>
            <h2 class="panel__title" id="__pt__">Sedikit lagi sampai rumah</h2>
          </div>
          <button type="button" class="panel__close" data-panel-close aria-label="Tutup checkout">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="checkout__progress" data-progress></div>
        <div class="panel__body"><div data-pane></div></div>`,
      onMount(el) {
        el.setAttribute("aria-labelledby", "__pt__");
        render(el);
      },
    };
  });

  /* ------------------------------ helpers ------------------------- */
  function attr(v) {
    return String(v == null ? "" : v).replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function celebrate() {
    if (RN.motion && RN.motion.reduced) return;
    const colors = ["#e3a89f", "#9db488", "#cf9b34", "#92c3c4", "#c1795b", "#f6ecda"];
    const wrap = document.createElement("div");
    wrap.className = "confetti";
    wrap.setAttribute("aria-hidden", "true");
    const n = 46;
    for (let i = 0; i < n; i++) {
      const bit = document.createElement("i");
      bit.style.left = Math.random() * 100 + "vw";
      bit.style.background = colors[i % colors.length];
      bit.style.setProperty("--cf-dur", (2.2 + Math.random() * 1.8).toFixed(2) + "s");
      bit.style.setProperty("--cf-delay", (Math.random() * 0.5).toFixed(2) + "s");
      bit.style.transform = `rotate(${Math.random() * 360}deg)`;
      if (i % 3 === 0) { bit.style.borderRadius = "50%"; }
      wrap.appendChild(bit);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 5200);
  }
})();
