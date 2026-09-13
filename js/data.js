/* =====================================================================
   Rumah Ngemil — data.js
   Content lives here, separate from UI. Add products by extending
   RN.data.products; the menu is generated from this.

   Sourced from real photos/pricelist in aset/ where available (Risol,
   Macheese Mix, Big Bites Fries, brand contact). Where no price was
   visible in any photo, a reasonable market estimate is used — these
   are marked "(estimasi)" in code comments so they're easy to find
   and correct.
   ===================================================================== */
window.RN = window.RN || {};

RN.data = (function () {
  "use strict";

  const brand = {
    name: "Rumah Ngemil",
    tagline: "#semuaberawaldarirumah",
    motto: "Semua berawal dari rumah.",
    whatsapp: "0859-3018-3663",
    instagram: "rumah.ngemilbn",
    tiktok: "rumah.ngemilbn",
  };

  const categories = [
    { id: "cookies", label: "Cookies", blurb: "Dipanggang tiap pagi, lembut di dalam, sedikit crispy di luar." },
    { id: "cake",    label: "Cake & Puding", blurb: "Lembap, tidak terlalu manis — cocok dibagi berdua." },
    { id: "pastry",  label: "Risol",   blurb: "Digoreng garing, isian melimpah, dari resep pricelist harian kami." },
    { id: "gurih",   label: "Gurih",   blurb: "Camilan gurih yang bikin nagih, paling enak selagi hangat." },
    { id: "minuman", label: "Minuman", blurb: "Dikocok dan dituang segar sebelum dikirim." },
  ];

  /* price in rupiah (integer) */
  const products = [
    // -------- cookies (foto asli: aset/softcookies.jpeg) --------
    { id: "soft-cookies", name: "Soft Cookies Rumah Ngemil", category: "cookies", price: 12000, // estimasi
      image: "aset/menu/soft-cookies.jpg", focus: "50% 42%",
      badge: "Best Seller", featured: true,
      description: "Lembut di dalam, sedikit crispy di luar. Dipanggang segar setiap hari — pilih rasanya.",
      variants: [
        { id: "classic", label: "Classic" },
        { id: "choco-lumer", label: "Choco Lumer" },
        { id: "matcha", label: "Matcha" },
        { id: "dark-choco", label: "Dark Choco" },
        { id: "red-velvet", label: "Red Velvet" },
        { id: "cheese", label: "Cheese" },
        { id: "lotus", label: "Lotus Biscoff" },
      ] },

    // -------- cake & puding (foto asli) --------
    { id: "banana-choco-muffin", name: "Banana Choco Muffin", category: "cake", price: 15000, // estimasi
      image: "aset/menu/banana-choco-muffin.jpg", focus: "50% 46%",
      featured: true,
      description: "Muffin pisang cokelat dengan taburan almond panggang — lembap dan wangi pisang matang.",
      variants: [] },
    { id: "pudding-petite", name: "Puding Petite Choco Belgian x Red Velvet", category: "cake", price: 35000, // estimasi, box isi 4
      image: "aset/menu/pudding-petite.jpg", focus: "50% 42%",
      badge: "Box isi 4", featured: true,
      description: "Dua puding choco Belgian, dua red velvet, dengan choux hati dan cokelat premium di atasnya.",
      variants: [] },

    // -------- risol (harga asli dari pricelist 26 Agustus 2025) --------
    { id: "risol-coklat", name: "Risol Coklat", category: "pastry", price: 5000, shape: "risol",
      description: "Isian cokelat crunchy lumer dengan topping keju.",
      variants: [ { id: "pcs", label: "1 pcs", price: 5000 }, { id: "box5", label: "Box isi 5", price: 25000 } ] },
    { id: "risol-mayo", name: "Risol Mayo", category: "pastry", price: 5000, shape: "risol",
      description: "Racikan mayonaise dengan beef patty dan telur rebus.",
      variants: [ { id: "pcs", label: "1 pcs", price: 5000 }, { id: "box5", label: "Box isi 5", price: 25000 } ] },
    { id: "risol-sayur", name: "Risol Sayur", category: "pastry", price: 3000, shape: "risol",
      description: "Isian kentang, wortel, dan racikan saus creamy.",
      variants: [ { id: "pcs", label: "1 pcs", price: 3000 }, { id: "box5", label: "Box isi 5", price: 15000 } ] },
    { id: "risol-ayam", name: "Risol Ayam", category: "pastry", price: 5000, shape: "risol",
      featured: true,
      description: "Ayam suwir pedas dengan irisan daun jeruk. Tambahan saus sambal +Rp2.000.",
      variants: [ { id: "pcs", label: "1 pcs", price: 5000 }, { id: "box5", label: "Box isi 5", price: 25000 } ] },

    // -------- gurih (foto asli) --------
    { id: "macheese-mix", name: "Macheese Mix", category: "gurih", price: 23000,
      image: "aset/menu/macheese-mix.jpg", focus: "50% 40%",
      badge: "Best Seller", featured: true,
      description: "Creamy mac & cheese dengan ayam crispy dan kentang goreng keemasan — saus melimpah di setiap suap.",
      variants: [] },
    { id: "big-bites-fries", name: "Big Bites Fries & Chicken", category: "gurih", price: 25000,
      image: "aset/menu/big-bites-fries.jpg", focus: "50% 42%",
      description: "French fries dan mac elbow dengan ayam crispy, disiram saus keju dan BBQ.",
      variants: [] },

    // -------- minuman (foto asli) --------
    { id: "milk-series", name: "Susu Pelangi Rumah Ngemil", category: "minuman", price: 15000, // estimasi
      image: "aset/menu/milk-series.jpg", focus: "50% 38%",
      featured: true,
      description: "Susu segar dikocok dan dituang langsung sebelum dikirim — pilih rasanya.",
      variants: [
        { id: "stroberi", label: "Stroberi" },
        { id: "taro", label: "Taro" },
        { id: "pandan", label: "Pandan" },
        { id: "original", label: "Original" },
      ] },
    { id: "susu-kurma", name: "Susu Kurma", category: "minuman", price: 20000, // estimasi
      image: "aset/menu/susu-kurma.jpg", focus: "50% 44%",
      badge: "Energy Booster",
      description: "Susu kurma asli rasa cokelat, no sugar — energy booster harian. Botol 250 ml.",
      variants: [] },
  ];

  const location = {
    city: "Sidenreng, Rappang",
    region: "Sidenreng Rappang (Sidrap), Sulawesi Selatan",
    address: "Alamat lengkap dikirim via WhatsApp setelah pesanan dikonfirmasi.",
    hours: "Pre-order — respon WhatsApp setiap hari, 08.00–20.00 WITA",
    phone: "0859-3018-3663 (WhatsApp)",
    instagram: "@rumah.ngemilbn",
    tiktok: "@rumah.ngemilbn",
    mapsUrl: "https://maps.google.com/?q=Sidenreng+Rappang",
    story: [
      "Sidenreng Rappang — orang menyebutnya Sidrap — adalah tanah lumbung padi di Sulawesi Selatan, di antara dua danau: Sidenreng dan Tempe.",
      "Dapur kami ada di sekitar Sidrap, dibuka lewat pre-order supaya semua camilan sampai ke kamu selagi masih segar.",
      "Pesan lewat WhatsApp atau Instagram kami — nanti kami kabari alamat pengambilan atau jadwal antar.",
    ],
  };

  const story = {
    lead: ["Freshly made.", "Homemade.", "Made to be shared."],
    blocks: [
      { title: "Bahan yang jujur", body: "Mentega asli, telur segar, gula secukupnya. Kalau kami tidak mau memakannya di rumah, kami tidak menjualnya." },
      { title: "Proses rumahan", body: "Tidak ada lini produksi. Ada oven rumah tangga, timer, dan tangan yang sama yang membuat sarapan tadi pagi." },
      { title: "Cerita lokal", body: "Resep-resepnya campuran: kue kering warisan keluarga, risol gorengan pasar, dan rasa khas Sidrap." },
      { title: "Dibuat untuk dibagi", body: "Ukuran porsi kami pas untuk diedarkan di meja. Camilan paling enak saat ada teman yang menemani." },
    ],
    values: ["Tanpa pengawet", "Batch kecil", "Dibungkus tangan", "Bahan lokal", "Pre-order"],
  };

  const format = {
    idr(n) {
      return "Rp" + (n | 0).toLocaleString("id-ID");
    },
  };

  function productById(id) {
    return products.find((p) => p.id === id) || null;
  }
  function productsByCategory(cat) {
    return products.filter((p) => p.category === cat);
  }
  function featured() {
    return products.filter((p) => p.featured);
  }

  return {
    brand, categories, products, location, story, format,
    productById, productsByCategory, featured,
  };
})();
