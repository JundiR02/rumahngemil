/* =====================================================================
   Rumah Ngemil — state.js
   One central store. Everything (cart FAB, drawer, order section,
   checkout) subscribes here. No duplicated state logic elsewhere.
   ===================================================================== */
window.RN = window.RN || {};

RN.store = (function () {
  "use strict";

  const KEY = "rn_order_v1";
  const DELIVERY_FEE = 12000;

  const state = {
    items: [],          // { key, id, name, price, shape, variant, variantLabel, qty }
    fulfillment: "pickup", // 'pickup' | 'delivery'
    notes: "",
    buyer: { name: "", phone: "", email: "", address: "", time: "" },
    payment: "transfer",
    checkoutStep: 0,
  };

  const subs = new Set();

  /* ---------------------------- persistence ---------------------------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && Array.isArray(saved.items)) {
        state.items = saved.items;
        state.fulfillment = saved.fulfillment || "pickup";
        state.notes = saved.notes || "";
      }
    } catch (e) { /* storage blocked / corrupt — start empty */ }
  }
  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        items: state.items,
        fulfillment: state.fulfillment,
        notes: state.notes,
      }));
    } catch (e) { /* ignore */ }
  }

  /* ------------------------------ emit -------------------------------- */
  function emit() {
    persist();
    const snap = getState();
    subs.forEach((fn) => {
      try { fn(snap); } catch (e) { console.error(e); }
    });
  }

  function keyFor(id, variant) { return id + "::" + (variant || ""); }

  /* ------------------------------ getters ---------------------------- */
  function getState() {
    return {
      items: state.items.map((i) => ({ ...i })),
      fulfillment: state.fulfillment,
      notes: state.notes,
      buyer: { ...state.buyer },
      payment: state.payment,
      checkoutStep: state.checkoutStep,
      totals: totals(),
    };
  }

  function totals() {
    const count = state.items.reduce((n, i) => n + i.qty, 0);
    const subtotal = state.items.reduce((n, i) => n + i.qty * i.price, 0);
    const fee = state.fulfillment === "delivery" && count > 0 ? DELIVERY_FEE : 0;
    return { count, subtotal, fee, grand: subtotal + fee, deliveryFee: DELIVERY_FEE };
  }

  /* ------------------------------ actions --------------------------- */
  function addItem(product, qty, variant) {
    qty = Math.max(1, qty | 0 || 1);
    const v = variant || null;
    const vObj = v && product.variants ? product.variants.find((x) => x.id === v) : null;
    const vLabel = vObj ? vObj.label || "" : "";
    // a variant may carry its own price (e.g. per-piece vs. per-box);
    // falls back to the product's base price otherwise
    const unitPrice = vObj && typeof vObj.price === "number" ? vObj.price : product.price;
    const key = keyFor(product.id, v);
    const found = state.items.find((i) => i.key === key);
    if (found) {
      found.qty = Math.min(99, found.qty + qty);
    } else {
      state.items.push({
        key, id: product.id, name: product.name, price: unitPrice,
        shape: product.shape, image: product.image || null, focus: product.focus || null,
        variant: v, variantLabel: vLabel, qty,
      });
    }
    emit();
  }

  function setQty(key, qty) {
    const it = state.items.find((i) => i.key === key);
    if (!it) return;
    qty = qty | 0;
    if (qty <= 0) { removeItem(key); return; }
    it.qty = Math.min(99, qty);
    emit();
  }

  function removeItem(key) {
    state.items = state.items.filter((i) => i.key !== key);
    emit();
  }

  function setFulfillment(v) { state.fulfillment = v === "delivery" ? "delivery" : "pickup"; emit(); }
  function setNotes(v) { state.notes = String(v || ""); emit(); }
  function setBuyer(patch) { Object.assign(state.buyer, patch || {}); emit(); }
  function setPayment(v) { state.payment = v; emit(); }
  function setCheckoutStep(n) { state.checkoutStep = Math.max(0, Math.min(4, n | 0)); emit(); }

  function clear() {
    state.items = [];
    state.notes = "";
    state.buyer = { name: "", phone: "", email: "", address: "", time: "" };
    state.checkoutStep = 0;
    emit();
  }

  function subscribe(fn) {
    subs.add(fn);
    try { fn(getState()); } catch (e) { console.error(e); }
    return () => subs.delete(fn);
  }

  load();

  return {
    getState, subscribe,
    addItem, setQty, removeItem,
    setFulfillment, setNotes, setBuyer, setPayment, setCheckoutStep,
    clear,
  };
})();
