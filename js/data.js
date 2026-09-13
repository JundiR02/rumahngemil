/* =====================================================================
   Rumah Ngemil — data.js
   Content lives here, separate from UI. Add products by extending
   RN.data.products; the menu is generated from this.
   ===================================================================== */
window.RN = window.RN || {};

RN.data = (function () {
  "use strict";

  const brand = {
    name: "Rumah Ngemil",
    tagline: "#semuaberawaldarirumah",
    motto: "Semua berawal dari rumah.",
  };

  const categories = [
    { id: "cookies",  label: "Cookies",  blurb: "Dipanggang tiap pagi, renyah sampai gigitan terakhir." },
    { id: "cake",     label: "Cake",     blurb: "Lembut, tidak terlalu manis — resep meja keluarga." },
    { id: "pastry",   label: "Pastry",   blurb: "Berlapis, dilipat dengan sabar, dipanggang keemasan." },
    { id: "hampers",  label: "Hampers",  blurb: "Dirangkai untuk dibagikan dan dibawa pulang." },
    { id: "minuman",  label: "Minuman",  blurb: "Teman ngemil — diseduh dan dituang segar." },
  ];

  /* price in rupiah (integer) */
  const products = [
    // -------- cookies --------
    { id: "cookie-coklat", name: "Cookie Coklat", category: "cookies", price: 25000, shape: "choc-cookie",
      badge: "Favorit", featured: true,
      description: "Cookie mentega dengan potongan cokelat pekat, garing di tepi dan lumer di tengah.",
      variants: [ { id: "reg", label: "Toples 12 pcs" }, { id: "mini", label: "Pouch 6 pcs" } ] },
    { id: "cookie-oat", name: "Cookie Oat Kismis", category: "cookies", price: 26000, shape: "cookie",
      description: "Gandum utuh, kismis, sedikit kayu manis. Camilan yang terasa jujur.",
      variants: [ { id: "reg", label: "Toples 12 pcs" } ] },
    { id: "cookie-kacang", name: "Cookie Kacang", category: "cookies", price: 24000, shape: "cookie",
      description: "Selai kacang asli dengan taburan kacang tanah sangrai.",
      variants: [] },
    { id: "nastar", name: "Nastar Nanas", category: "cookies", price: 45000, shape: "nastar",
      badge: "Musiman", featured: true,
      description: "Selai nanas masak sendiri, kulit yang meleleh di mulut. Per toples 250 gram.",
      variants: [ { id: "250", label: "250 g" }, { id: "500", label: "500 g" } ] },

    // -------- cake --------
    { id: "cake-coklat", name: "Loaf Cake Coklat", category: "cake", price: 68000, shape: "cake-slice",
      featured: true,
      description: "Bolu cokelat padat dan pekat, dipanggang dalam loyang loaf. Untuk 6–8 potong.",
      variants: [ { id: "plain", label: "Polos" }, { id: "ganache", label: "Ganache" } ] },
    { id: "banana-bread", name: "Banana Bread", category: "cake", price: 55000, shape: "cake-slice",
      badge: "Best seller", featured: true,
      description: "Pisang matang, kenari, aroma vanila. Lembab dan mengenyangkan.",
      variants: [] },
    { id: "cake-pandan", name: "Cake Pandan Santan", category: "cake", price: 60000, shape: "cake-round",
      description: "Pandan asli dan santan segar. Wangi dapur rumah waktu sore.",
      variants: [] },

    // -------- pastry --------
    { id: "croissant", name: "Croissant Mentega", category: "pastry", price: 22000, shape: "croissant",
      featured: true,
      description: "Adonan berlapis dengan mentega Eropa, diistirahatkan semalam.",
      variants: [ { id: "plain", label: "Plain" }, { id: "coklat", label: "Isi cokelat" } ] },
    { id: "pain-choc", name: "Pain au Chocolat", category: "pastry", price: 26000, shape: "danish",
      description: "Dua batang cokelat di dalam pastry yang renyah berlapis.",
      variants: [] },
    { id: "cheese-roll", name: "Cheese Roll", category: "pastry", price: 24000, shape: "danish",
      description: "Gulungan pastry dengan krim keju gurih-manis.",
      variants: [] },

    // -------- hampers --------
    { id: "hampers-kecil", name: "Hampers Kecil", category: "hampers", price: 150000, shape: "hamper",
      description: "Satu toples cookies, dua pastry, dan kartu ucapan tulis tangan.",
      variants: [ { id: "netral", label: "Kemasan netral" }, { id: "lebaran", label: "Tema Lebaran" } ] },
    { id: "hampers-besar", name: "Hampers Berbagi", category: "hampers", price: 285000, shape: "hamper",
      badge: "Untuk keluarga",
      description: "Loaf cake, dua toples cookies, empat pastry, teh celup, dalam keranjang anyaman.",
      variants: [] },

    // -------- minuman --------
    { id: "kopi-susu", name: "Kopi Susu Rumah", category: "minuman", price: 20000, shape: "cup-cold",
      featured: true,
      description: "Espresso, gula aren, susu segar. Dingin dengan es batu.",
      variants: [ { id: "reg", label: "Regular" }, { id: "less", label: "Less sugar" } ] },
    { id: "teh-tarik", name: "Teh Tarik Hangat", category: "minuman", price: 18000, shape: "cup-hot",
      description: "Teh hitam pekat ditarik dengan susu. Disajikan hangat.",
      variants: [] },
    { id: "coklat-panas", name: "Cokelat Panas", category: "minuman", price: 22000, shape: "cup-hot",
      description: "Cokelat asli dilelehkan dengan susu, sedikit garam laut.",
      variants: [] },
    { id: "infused", name: "Infused Water Sereh", category: "minuman", price: 15000, shape: "bottle",
      description: "Sereh, jeruk nipis, dan madu. Menyegarkan tanpa berlebihan.",
      variants: [] },
  ];

  const location = {
    city: "Sidenreng, Rappang",
    region: "Sidenreng Rappang (Sidrap), Sulawesi Selatan",
    address: "Jl. Jenderal Sudirman No. 12, Pangkajene, Sidrap",
    hours: "Selasa–Minggu · 08.00–20.00 WITA (Senin libur)",
    phone: "+62 812-0000-0000 (WhatsApp)",
    mapsUrl: "https://maps.google.com/?q=Sidenreng+Rappang",
    story: [
      "Sidenreng Rappang — orang menyebutnya Sidrap — adalah tanah lumbung padi di Sulawesi Selatan, di antara dua danau: Sidenreng dan Tempe.",
      "Dapur kami ada di Pangkajene, ibu kota kabupaten. Bahan-bahan datang dari pasar pagi yang sama tempat nenek dulu berbelanja.",
      "Kalau lewat, mampir. Ada meja dan kursi lipat di depan, dan biasanya ada yang baru keluar dari oven.",
    ],
  };

  const story = {
    lead: ["Freshly made.", "Homemade.", "Made to be shared."],
    blocks: [
      { title: "Bahan yang jujur", body: "Mentega asli, telur segar dari peternak dekat, gula secukupnya. Kalau kami tidak mau memakannya di rumah, kami tidak menjualnya." },
      { title: "Proses rumahan", body: "Tidak ada lini produksi. Ada oven rumah tangga, timer, dan tangan yang sama yang membuat sarapan tadi pagi." },
      { title: "Cerita lokal", body: "Resep-resepnya campuran: kue kering warisan keluarga, roti yang dipelajari dari buku lama, dan rasa khas Sidrap." },
      { title: "Dibuat untuk dibagi", body: "Ukuran porsi kami pas untuk diedarkan di meja. Camilan paling enak saat ada teman yang menemani." },
    ],
    values: ["Tanpa pengawet", "Batch kecil", "Dibungkus tangan", "Bahan lokal", "Resep keluarga"],
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
