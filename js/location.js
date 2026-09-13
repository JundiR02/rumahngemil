/* =====================================================================
   Rumah Ngemil — location.js
   Panel renderers: "location" (illustrated map panel) and "story"
   (editorial overlay for the "Fresh Homemade Happiness" philosophy).
   ===================================================================== */
window.RN = window.RN || {};

(function () {
  "use strict";
  const D = RN.data;

  const MAP_SVG = `
    <svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Peta ilustratif Sidenreng Rappang: dapur Rumah Ngemil di antara sawah, sungai, dan Danau Sidenreng.">
      <rect width="480" height="340" fill="var(--kraft)"/>
      <g fill="var(--sage)" opacity="0.85">
        <path d="M-10 40q40-34 90 0t90 0 90-6 90 8 90-2v46q-45 10-90 2t-90 6-90-4-90 4-90-6Z"/>
      </g>
      <path d="M0 250q120-40 230 6t250-16V340H0Z" fill="var(--teal)"/>
      <path d="M0 254q120-40 230 6t250-16" fill="none" stroke="var(--teal-deep)" stroke-width="3" opacity=".5"/>
      <path d="M180 -10q26 90-20 150t20 210" fill="none" stroke="var(--teal)" stroke-width="16" stroke-linecap="round" opacity=".9"/>
      <path d="M150 150q40 8 66-2" fill="none" stroke="var(--kraft-deep)" stroke-width="8" stroke-linecap="round" opacity=".7"/>
      <g stroke="var(--kraft-deep)" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="1 12" opacity=".8">
        <path d="M60 300q120-40 150-110T340 70"/>
      </g>
      <g fill="var(--greenDark, #6e8b5b)" opacity=".9">
        <circle cx="300" cy="120" r="10"/><circle cx="330" cy="132" r="8"/><circle cx="360" cy="118" r="11"/>
      </g>
      <text x="330" y="300" font-family="Fraunces, serif" font-size="16" fill="var(--ink-soft)">Danau Sidenreng</text>
      <text x="40" y="34" font-family="Fraunces, serif" font-size="15" fill="var(--ink-soft)">sawah Sidrap</text>
      <text x="196" y="196" font-family="Fraunces, serif" font-size="13" fill="var(--ink-soft)">sungai</text>
      <!-- outlet marker -->
      <g transform="translate(150 150)">
        <path d="M0 0c0 12-12 18-12 30S0 46 0 46 12 42 12 30 0 12 0 0Z" fill="var(--accent)"/>
        <circle cx="0" cy="8" r="6" fill="var(--paper-2)"/>
      </g>
      <text x="112" y="140" font-family="Fraunces, serif" font-size="15" fill="var(--ink)" font-weight="600">Rumah Ngemil</text>
    </svg>`;

  /* --------------------------- LOCATION --------------------------- */
  RN.panel.register("location", function () {
    const L = D.location;
    return {
      variant: "location",
      eyebrow: "Rumah Kami",
      title: "Dari Sidenreng, Rappang",
      sub: "Peta ini digambar tangan — tekan tombol di bawah untuk membuka peta asli.",
      body: `
        <div class="locwrap">
          <div class="locwrap__map">${MAP_SVG}</div>
          <div>
            <div class="locstory">
              ${L.story.map((p) => `<p>${p}</p>`).join("")}
            </div>
            <dl class="locfacts">
              <dt>Wilayah</dt><dd>${L.region}</dd>
              <dt>Alamat</dt><dd>${L.address}</dd>
              <dt>Jam buka</dt><dd>${L.hours}</dd>
              <dt>Kontak</dt><dd>${L.phone}</dd>
              <dt>Media sosial</dt><dd>Instagram &amp; TikTok ${L.instagram}</dd>
            </dl>
            <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.2rem">
              <a class="btn btn--ghost" href="${L.mapsUrl}" target="_blank" rel="noopener">Buka di Google Maps</a>
              <button type="button" class="btn btn--primary" data-open-menu>Pesan dari sini</button>
            </div>
          </div>
        </div>`,
      onMount(el, api) {
        el.querySelectorAll("[data-open-menu]").forEach((b) =>
          b.addEventListener("click", () => { api.close(); RN.panel.open("menu"); }));
      },
    };
  });

  /* ----------------------------- STORY --------------------------- */
  RN.panel.register("story", function () {
    const S = D.story;
    return {
      variant: "story",
      eyebrow: "Fresh Homemade Happiness",
      title: "Kenapa selalu homemade",
      body: `
        <p class="storyover__lead">
          ${S.lead.map((l) => `<span>${l}</span>`).join("")}
        </p>
        <div class="storyover__grid">
          ${S.blocks.map((b) => `<div><h3>${b.title}</h3><p>${b.body}</p></div>`).join("")}
        </div>
        <ul class="storyover__values" aria-label="Nilai yang kami pegang">
          ${S.values.map((v) => `<li>${v}</li>`).join("")}
        </ul>
        <div style="margin-top:1.8rem">
          <button type="button" class="btn btn--primary" data-open-menu>Lihat yang kami buat</button>
        </div>`,
      onMount(el, api) {
        el.querySelectorAll("[data-open-menu]").forEach((b) =>
          b.addEventListener("click", () => { api.close(); RN.panel.open("menu"); }));
      },
    };
  });
})();
