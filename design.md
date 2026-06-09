# KKN HUB — Jawara Obira: Design Documentation

> **Tema Visual:** Retro Heritage (Oceanic)
> **Stack:** HTML + Tailwind CSS (CDN) + Material Symbols Outlined + Google Fonts
> **Bahasa:** Indonesia (konten), English (beberapa label admin)

---

## Daftar Halaman

| No | Halaman | Deskripsi Singkat |
|----|---------|-------------------|
| 1 | [Home](#1-home) | Landing page utama arsip digital desa |
| 2 | [Berita](#2-berita) | Halaman daftar & arsip berita |
| 3 | [Berita Detail](#3-berita-detail) | Halaman artikel berita penuh |
| 4 | [Budaya](#4-budaya) | Katalog warisan budaya pesisir |
| 5 | [UMKM](#5-umkm) | Direktori usaha mikro & kerajinan lokal |
| 6 | [Profil](#6-profil) | Peta interaktif & demografi desa |
| 7 | [TOGA](#7-toga) | Repositori tanaman obat keluarga |
| 8 | [KKN Hub](#8-kkn-hub) | Portal pusat navigasi KKN |
| 9 | [Jurnal KKN](#9-jurnal-kkn) | Kalender harian & dispatch lapangan |
| 10 | [Fauna](#10-fauna) | Katalog keanekaragaman hayati |
| 11 | [Admin](#11-admin) | Dashboard manajemen arsip |
| 12 | [Login](#12-login) | Halaman autentikasi |

---

## Design System Global

### Palet Warna

Semua halaman menggunakan palet warna yang konsisten melalui Tailwind custom config:

```js
"colors": {
  "background":              "#fef9f2",  // Kertas tua (aged paper)
  "surface":                 "#fef9f2",
  "surface-container-low":   "#f8f3ec",
  "surface-container":       "#f2ede6",
  "surface-container-high":  "#ece7e1",
  "surface-container-highest":"#e6e2db",
  "surface-dim":             "#ded9d3",

  "primary":                 "#006689",  // Biru laut dalam
  "primary-container":       "#51b8ea",  // Biru langit/highlight
  "primary-fixed":           "#c3e8ff",
  "on-primary":              "#ffffff",
  "on-primary-container":    "#004661",

  "secondary":               "#5e5e5e",
  "secondary-container":     "#e2e2e2",

  "tertiary":                "#ac3231",  // Merah tua (aksen bahaya/penting)
  "tertiary-container":      "#ff8d86",
  "tertiary-fixed":          "#ffdad7",

  "on-surface":              "#1d1c18",  // Teks utama (hampir hitam)
  "on-surface-variant":      "#3e484e",  // Teks sekunder
  "outline":                 "#6f787f",
  "outline-variant":         "#bec8d0",

  "error":                   "#ba1a1a",
  "error-container":         "#ffdad6"
}
```

### Tipografi

```js
"fontFamily": {
  "display-lg":   ["Libre Caslon Text"],  // Heading besar, serif, kesan arsip
  "headline-lg":  ["Libre Caslon Text"],
  "headline-md":  ["Libre Caslon Text"],
  "body-lg":      ["Work Sans"],          // Body teks, sans-serif bersih
  "body-md":      ["Work Sans"],
  "label-md":     ["Work Sans"]           // Label, badge, nav
}

"fontSize": {
  "display-lg":          ["48px",  { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
  "headline-lg":         ["32px",  { lineHeight: "1.2", fontWeight: "700" }],
  "headline-lg-mobile":  ["28px",  { lineHeight: "1.2", fontWeight: "700" }],
  "headline-md":         ["24px",  { lineHeight: "1.3", fontWeight: "600" }],
  "body-lg":             ["18px",  { lineHeight: "1.6", fontWeight: "400" }],
  "body-md":             ["16px",  { lineHeight: "1.6", fontWeight: "400" }],
  "label-md":            ["14px",  { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }]
}
```

### Spacing & Border Radius

```js
"spacing": {
  "base":         "8px",
  "hard-shadow":  "6px",
  "margin":       "32px",
  "border-width": "3px",
  "gutter":       "24px"
}

"borderRadius": {
  "DEFAULT": "0.75rem",  // Bervariasi sedikit per halaman
  "lg":      "0.75rem",
  "xl":      "0.75rem",
  "full":    "9999px"
}
```

### Efek Hard Shadow (Neo-Brutalist)

Ciri khas visual utama seluruh halaman:

```css
/* Default hard shadow */
.hard-shadow {
  box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
}

/* Hover: geser naik-kiri + shadow lebih besar */
.hard-shadow-hover:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
}

/* Klik/aktif: geser turun-kanan (kesan ditekan) */
.press-effect:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px 0px rgba(0, 0, 0, 1);
}
```

### Tekstur Latar (Background Texture)

Setiap halaman menggunakan satu dari beberapa opsi tekstur kertas:

```css
/* Opsi 1 — P6 texture (Berita, Admin) */
background-image: url("https://www.transparenttextures.com/patterns/p6.png");

/* Opsi 2 — Natural Paper (Profil, KKN Hub, Jurnal) */
background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");

/* Opsi 3 — Cream Paper (Jurnal KKN) */
background-image: url("https://www.transparenttextures.com/patterns/cream-paper.png");

/* Opsi 4 — Parchment (TOGA) */
background-image: url("https://www.transparenttextures.com/patterns/parchment.png");

/* Opsi 5 — Aged Paper (UMKM) */
background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
```

### Top Navigation Bar (Komponen Bersama)

Semua halaman memiliki navbar sticky dengan struktur identik:

```html
<nav class="bg-background border-b-[3px] border-on-surface sticky top-0 z-50">
  <div class="flex flex-col md:flex-row justify-between items-center
              w-full px-margin py-4 max-w-screen-2xl mx-auto">

    <!-- Logo -->
    <span class="font-display-lg text-display-lg font-bold text-on-surface
                 border-b-4 border-primary-container">
      KKN HUB
    </span>

    <!-- Nav Links (halaman aktif ditandai border-b-4 border-primary-container) -->
    <div class="hidden md:flex items-center gap-8 font-label-md text-label-md">
      <a class="text-on-surface-variant font-medium hover:text-primary
                transition-colors hover:-translate-y-0.5 hover:-translate-x-0.5"
         href="#">Home</a>
      <a class="text-on-surface font-bold border-b-4 border-primary-container pb-1"
         href="#">Berita</a>  <!-- Contoh: halaman aktif -->
      <!-- ... dst -->
    </div>

    <!-- CTA Button -->
    <button class="bg-primary-container px-6 py-2 border-[3px] border-on-surface
                   rounded-xl font-label-md hard-shadow">
      Daftar Sekarang
    </button>
  </div>
</nav>
```

### Footer (Komponen Bersama)

```html
<footer class="bg-surface-container-highest border-t-[3px] border-on-surface py-16">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter
              px-margin w-full max-w-screen-2xl mx-auto">

    <!-- Kolom Kiri: Deskripsi -->
    <div class="flex flex-col gap-6">
      <span class="font-headline-md text-headline-md font-bold uppercase tracking-tighter">
        KKN HUB ARCHIVAL
      </span>
      <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
        Deskripsi singkat visi & misi...
      </p>
      <p class="font-label-md text-label-md opacity-70">
        © 2024 ARCHIVAL COMMUNITY PRESS. ALL RIGHTS RESERVED.
      </p>
    </div>

    <!-- Kolom Kanan: Links -->
    <div class="grid grid-cols-2 gap-8">
      <div class="flex flex-col gap-4">
        <h6 class="font-label-md font-bold border-b-2 border-primary-container w-max">
          NAVIGASI
        </h6>
        <ul>
          <li><a href="#" class="text-on-surface-variant hover:text-primary">Archives</a></li>
          <!-- ... dst -->
        </ul>
      </div>
    </div>

  </div>
</footer>
```

### Oceanic Divider / Dekoratif

Elemen dekoratif maritim yang muncul di beberapa halaman:

```html
<!-- Divider ikonik dengan opacity rendah -->
<section class="py-12 flex justify-center opacity-40">
  <div class="flex items-center gap-12 text-primary">
    <span class="material-symbols-outlined !text-6xl"
          style="font-variation-settings: 'FILL' 1;">sailing</span>
    <span class="material-symbols-outlined !text-6xl"
          style="font-variation-settings: 'FILL' 1;">waves</span>
    <span class="material-symbols-outlined !text-6xl"
          style="font-variation-settings: 'FILL' 1;">anchor</span>
  </div>
</section>
```

---

## 1. Home

**File:** `home.html`
**Deskripsi:** Landing page utama sebagai pintu masuk arsip digital Jawara Obira. Menampilkan hero storytelling, profil desa, cerita komunitas, dan call-for-papers.

### Struktur Layout

```
[Navbar]
[Hero: 8-col konten + 4-col sidebar sorotan]
[Bento Grid: Profil Desa + 2 Story Card]
[Call for Papers Section]
[Newsletter Strip]
[Footer]
```

### Hero Section

```html
<section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-24 relative">

  <!-- Konten Utama: 8 kolom -->
  <div class="lg:col-span-8 border-[3px] border-on-surface bg-aged-paper
              p-8 relative overflow-hidden rounded-xl hard-shadow">
    <div class="relative z-10">
      <h1 class="font-display-lg text-display-lg text-on-surface mb-6 uppercase tracking-tighter">
        Memori Kolektif <br/>
        <span class="text-primary-container">Jawara Obira</span>
      </h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8">
        Deskripsi singkat arsip digital...
      </p>
      <div class="flex flex-wrap gap-4">
        <button class="bg-primary-container border-[3px] border-on-surface
                       px-8 py-3 font-bold rounded-xl hard-shadow
                       hover:-translate-x-1 hover:-translate-y-1 transition-all">
          Jelajahi Arsip
        </button>
        <button class="bg-surface-container-high border-[3px] border-on-surface
                       px-8 py-3 font-bold rounded-xl hover:bg-surface-variant">
          Lihat Video Dokumenter
        </button>
      </div>
    </div>

    <!-- Gambar dekoratif background opacity 20% -->
    <div class="absolute -bottom-10 -right-10 opacity-20 w-80 h-80 pointer-events-none">
      <img src="..." alt="" class="w-full h-full object-contain" />
    </div>
  </div>

  <!-- Sidebar: 4 kolom — Sorotan Hari Ini -->
  <div class="lg:col-span-4 border-[3px] border-on-surface bg-primary-container
              p-6 flex flex-col justify-between rounded-xl hard-shadow">
    <div>
      <h2 class="font-headline-md text-headline-md text-on-primary-container mb-4
                 font-bold border-b-2 border-on-surface pb-2">
        Sorotan Hari Ini
      </h2>
      <ul class="space-y-4">
        <li class="flex gap-4 items-start group cursor-pointer">
          <span class="material-symbols-outlined">history_edu</span>
          <div>
            <h3 class="font-bold underline group-hover:text-on-surface transition-colors">
              Manifesto Nelayan Obira 1942
            </h3>
            <p class="text-sm">Dokumen sejarah perlawanan lokal.</p>
          </div>
        </li>
        <!-- item ke-2 dst -->
      </ul>
    </div>
    <div class="mt-8 border-t-2 border-on-surface pt-4 italic text-sm">
      "Arsip adalah jendela menuju jati diri bangsa..."
    </div>
  </div>

</section>
```

### Bento Grid: Profil & Cerita

```html
<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-24">

  <!-- Profil Desa: span 2 kolom -->
  <div class="md:col-span-2 lg:col-span-2 border-[3px] border-on-surface
              bg-surface-container-high p-8 rounded-xl hard-shadow flex flex-col justify-between">
    <div>
      <div class="flex justify-between items-start mb-6">
        <h2 class="font-headline-lg text-headline-lg uppercase border-b-4 border-primary-container">
          Profil Desa
        </h2>
        <span class="material-symbols-outlined text-4xl">location_on</span>
      </div>
      <!-- Foto desa dengan grayscale + hover color -->
      <div class="mb-6 h-48 border-[2px] border-on-surface rounded-lg
                  grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <p class="font-body-md text-body-md mb-6">Deskripsi desa...</p>
    </div>
    <a class="font-bold underline flex items-center gap-2 group" href="#">
      Baca Selengkapnya
      <span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">
        arrow_forward
      </span>
    </a>
  </div>

  <!-- Story Card 1: Quote -->
  <div class="border-[3px] border-on-surface bg-aged-paper p-6 rounded-xl hard-shadow flex flex-col">
    <div class="mb-4 text-primary-container">
      <span class="material-symbols-outlined text-5xl" style="font-variation-settings: 'FILL' 1;">
        format_quote
      </span>
    </div>
    <h3 class="font-headline-md text-headline-md mb-4">Kisah Sang Penjaga Mercusuar</h3>
    <p class="text-sm mb-6 flex-grow">"Quote dari tokoh desa..." — Bapak Yusuf.</p>
    <div class="pt-4 border-t-[2px] border-on-surface flex items-center gap-3">
      <div class="w-10 h-10 rounded-full border-2 border-on-surface overflow-hidden">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <span class="font-label-md text-label-md">Cerita Rakyat</span>
    </div>
  </div>

  <!-- Story Card 2: UMKM Teaser -->
  <div class="border-[3px] border-on-surface bg-primary-container p-6 rounded-xl hard-shadow flex flex-col">
    <div class="h-32 border-[2px] border-on-surface rounded-lg mb-4 overflow-hidden">
      <img src="..." class="w-full h-full object-cover" />
    </div>
    <h3 class="font-headline-md text-headline-md mb-2">Tenun Ikat Obira</h3>
    <p class="text-sm mb-6 flex-grow">Deskripsi singkat...</p>
    <div class="flex justify-end">
      <button class="bg-on-surface text-background px-4 py-1
                     font-bold text-xs uppercase tracking-widest rounded">
        Eksplor UMKM
      </button>
    </div>
  </div>

</section>
```

### Call for Papers Section

```html
<section class="border-[3px] border-on-surface bg-surface-container-lowest
                p-12 rounded-xl hard-shadow mb-24 relative overflow-hidden">
  <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
    <div>
      <span class="inline-block bg-tertiary-container border-[2px] border-on-surface
                   px-3 py-1 font-bold text-xs mb-4 uppercase tracking-widest rounded">
        Akademik &amp; Riset
      </span>
      <h2 class="font-display-lg text-display-lg mb-6 tracking-tighter">
        Call for Papers: <br/>
        <span class="underline decoration-primary-container decoration-8">Simposium Budaya</span>
      </h2>
      <p class="font-body-lg text-body-lg mb-8">Deskripsi undangan...</p>
      <div class="space-y-4 mb-8">
        <div class="flex items-center gap-4">
          <span class="material-symbols-outlined bg-primary-container
                       border-[2px] border-on-surface p-2 rounded-lg">event</span>
          <span class="font-bold">Deadline: 15 Agustus 2024</span>
        </div>
      </div>
      <button class="bg-primary-container border-[3px] border-on-surface
                     px-10 py-4 font-bold text-xl rounded-xl hard-shadow
                     hover:-translate-x-1 hover:-translate-y-1 transition-all">
        Unduh Panduan Penulisan
      </button>
    </div>

    <!-- Gambar mesin ketik rotasi 3deg -->
    <div class="hidden lg:block">
      <div class="aspect-square border-[3px] border-on-surface bg-aged-paper
                  p-4 rotate-3 rounded-xl hard-shadow relative">
        <div class="absolute -top-6 -left-6 bg-tertiary text-on-tertiary
                    px-4 py-2 border-[2px] border-on-surface font-bold text-sm -rotate-6 rounded">
          URGENT
        </div>
        <img src="..." class="w-full h-full object-cover border-[2px] border-on-surface rounded-lg" />
      </div>
    </div>
  </div>

  <!-- Dekorasi background icon raksasa opacity 10% -->
  <div class="absolute -right-20 bottom-0 opacity-10 pointer-events-none">
    <span class="material-symbols-outlined text-[30rem]"
          style="font-variation-settings: 'FILL' 1;">auto_stories</span>
  </div>
</section>
```

### Newsletter Strip

```html
<section class="bg-on-surface text-background p-10 rounded-xl
                flex flex-col md:flex-row justify-between items-center gap-8">
  <div class="text-center md:text-left">
    <h2 class="font-headline-lg text-headline-lg mb-2">Ikuti Jejak Kami</h2>
    <p class="opacity-80">Dapatkan update bulanan...</p>
  </div>
  <div class="flex w-full md:w-auto gap-4">
    <input type="email"
           placeholder="Alamat Email Anda"
           class="bg-background text-on-surface border-[3px] border-primary-container
                  px-6 py-3 w-full md:w-80 rounded-xl focus:ring-4
                  focus:ring-primary-container outline-none font-bold" />
    <button class="bg-primary-container text-on-primary-container
                   px-8 py-3 font-bold rounded-xl hover:bg-primary transition-colors whitespace-nowrap">
      Langganan
    </button>
  </div>
</section>
```

### JavaScript

```js
// Micro-interaction: tombol terasa "ditekan"
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mousedown', () => {
    button.classList.add('translate-x-1', 'translate-y-1', 'shadow-none');
  });
  button.addEventListener('mouseup', () => {
    button.classList.remove('translate-x-1', 'translate-y-1', 'shadow-none');
  });
  button.addEventListener('mouseleave', () => {
    button.classList.remove('translate-x-1', 'translate-y-1', 'shadow-none');
  });
});

// Parallax sederhana untuk ikon dekoratif
window.addEventListener('scroll', () => {
  const scrollPos = window.pageYOffset;
  const maritimeIcon = document.querySelector('.absolute.opacity-10 span');
  if (maritimeIcon) {
    maritimeIcon.style.transform =
      `translateY(${scrollPos * 0.1}px) rotate(${scrollPos * 0.05}deg)`;
  }
});
```

---

## 2. Berita

**File:** `berita.html`
**Deskripsi:** Halaman daftar berita dengan layout featured + grid arsip. Gambar card menggunakan efek grayscale yang hilang saat hover.

### Struktur Layout

```
[Navbar]
[Header: Judul halaman + Edisi badge]
[Berita Terkini: 8-col featured + 4-col stack]
[Direktori Berita: 3-col grid + load more]
[Oceanic Divider]
[Footer]
```

### Header Halaman

```html
<header class="mb-12 border-b-[3px] border-on-surface pb-8
               flex flex-col md:flex-row justify-between items-end gap-6">
  <div class="max-w-2xl">
    <h1 class="font-display-lg text-display-lg mb-4">Berita - Jawara Obira</h1>
    <p class="font-body-lg text-body-lg text-on-surface-variant">
      Arsip berita dan catatan perjalanan pengabdian masyarakat...
    </p>
  </div>
  <div class="flex items-center bg-background border-2 border-on-surface
              rounded-xl px-4 py-2 hard-shadow">
    <span class="material-symbols-outlined mr-2">calendar_today</span>
    <span class="font-label-md text-label-md">EDISI MEI 2024</span>
  </div>
</header>
```

### Berita Terkini (Featured Layout)

```html
<section class="mb-16">
  <div class="flex items-center mb-6">
    <h2 class="font-headline-lg text-headline-lg border-l-8 border-primary-container pl-4">
      Berita Terkini
    </h2>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

    <!-- Card Utama: 8 kolom, gambar fullwidth dengan hover zoom + colorize -->
    <div class="lg:col-span-8 group">
      <div class="bg-background border-[3px] border-on-surface rounded-xl
                  overflow-hidden hard-shadow transition-all duration-300
                  group-hover:-translate-y-1 group-hover:-translate-x-1
                  group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        <div class="relative h-96 overflow-hidden">
          <img src="..."
               class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div class="absolute top-4 left-4">
            <span class="bg-primary-container text-on-primary-container
                         px-4 py-1 border-2 border-on-surface rounded-lg
                         font-label-md text-label-md">UTAMA</span>
          </div>
        </div>

        <div class="p-8 border-t-[3px] border-on-surface">
          <div class="flex items-center gap-4 mb-4 text-on-surface-variant font-label-md text-label-md">
            <span>24 MEI 2024</span>
            <span class="w-2 h-2 bg-primary-container rounded-full"></span>
            <span>LIPUTAN KHUSUS</span>
          </div>
          <h3 class="font-display-lg text-headline-lg mb-4 group-hover:text-primary transition-colors">
            Menapak Jejak Pesisir: Restorasi Ekosistem Mangrove...
          </h3>
          <p class="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3">
            Program kolaborasi KKN HUB...
          </p>
          <a class="inline-flex items-center gap-2 font-label-md text-label-md
                    text-primary font-bold group/link" href="#">
            BACA SELENGKAPNYA
            <span class="material-symbols-outlined transition-transform
                         group-hover/link:translate-x-1">arrow_forward</span>
          </a>
        </div>

      </div>
    </div>

    <!-- Secondary Stack: 4 kolom, 2 kartu kecil -->
    <div class="lg:col-span-4 flex flex-col gap-gutter">

      <div class="bg-surface-container border-[3px] border-on-surface rounded-xl
                  p-6 hard-shadow flex flex-col justify-between h-1/2 group
                  hover:-translate-y-1 transition-all">
        <div>
          <span class="text-primary font-bold font-label-md text-label-md mb-2 block tracking-widest">
            BUDAYA
          </span>
          <h4 class="font-headline-md text-headline-md mb-3 group-hover:text-primary">
            Festival Obira: Merayakan Warisan Bahari
          </h4>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">
          Kemeriahan parade kapal hias...
        </p>
      </div>

      <!-- Card UMKM (identik strukturnya) -->
      <div class="bg-surface-container border-[3px] border-on-surface rounded-xl
                  p-6 hard-shadow flex flex-col justify-between h-1/2 group
                  hover:-translate-y-1 transition-all">
        <div>
          <span class="text-primary font-bold font-label-md text-label-md mb-2 block tracking-widest">
            UMKM
          </span>
          <h4 class="font-headline-md text-headline-md mb-3 group-hover:text-primary">
            Digitalisasi Produk Kerajinan Kerang
          </h4>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">...</p>
      </div>

    </div>

  </div>
</section>
```

### Grid Direktori Berita

```html
<section class="mb-16">
  <!-- Header + view toggle -->
  <div class="flex items-center justify-between mb-8 border-b-2 border-on-surface pb-4">
    <h2 class="font-headline-lg text-headline-lg">Direktori Berita</h2>
    <div class="flex gap-2">
      <button class="p-2 border-2 border-on-surface rounded-lg bg-background
                     hover:bg-primary-container transition-colors">
        <span class="material-symbols-outlined">grid_view</span>
      </button>
      <button class="p-2 border-2 border-on-surface rounded-lg bg-background
                     hover:bg-primary-container transition-colors">
        <span class="material-symbols-outlined">view_list</span>
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">

    <!-- News Card: gambar grayscale → berwarna saat hover -->
    <div class="border-[3px] border-on-surface rounded-xl bg-background
                flex flex-col group transition-all duration-300
                hover:shadow-[10px_10px_0px_0px_#51b8ea] overflow-hidden">

      <!-- Gambar + Badge kategori pojok kanan bawah -->
      <div class="h-56 overflow-hidden border-b-[3px] border-on-surface relative">
        <img src="..."
             class="w-full h-full object-cover grayscale group-hover:grayscale-0
                    transition-all duration-500" />
        <div class="absolute bottom-0 right-0 bg-on-surface text-background
                    px-3 py-1 font-label-md text-label-md">UMKM</div>
      </div>

      <!-- Konten -->
      <div class="p-6 flex-grow">
        <p class="font-label-md text-label-md text-on-surface-variant mb-2">18 MEI 2024</p>
        <h5 class="font-headline-md text-headline-md mb-4 leading-tight
                   group-hover:text-primary transition-colors">
          Ekspor Perdana Produk Olahan Ikan Asap Obira...
        </h5>
        <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3">
          Langkah besar bagi koperasi nelayan...
        </p>
      </div>

      <!-- Footer card -->
      <div class="p-6 pt-0 mt-auto">
        <hr class="border-on-surface/10 mb-4" />
        <div class="flex justify-between items-center">
          <span class="text-primary font-bold font-label-md">Jawara Obira</span>
          <span class="material-symbols-outlined text-primary
                       group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>

    </div>
    <!-- Ulangi untuk card ke-2 dan ke-3 -->

  </div>

  <!-- Load More Button -->
  <div class="mt-12 flex justify-center">
    <button class="px-8 py-4 bg-background border-[3px] border-on-surface rounded-xl
                   font-headline-md text-headline-md hard-shadow hard-shadow-hover
                   transition-all flex items-center gap-3">
      MUAT BERITA LAINNYA
      <span class="material-symbols-outlined">refresh</span>
    </button>
  </div>
</section>
```

### JavaScript

```js
// Micro-interaction hard shadow pada tombol
document.querySelectorAll('.hard-shadow-hover').forEach(button => {
  button.addEventListener('mousedown', () => {
    button.style.transform = 'translate(2px, 2px)';
    button.style.boxShadow = '2px 2px 0px 0px rgba(0, 0, 0, 1)';
  });
  button.addEventListener('mouseup', () => {
    button.style.transform = 'translate(-2px, -2px)';
    button.style.boxShadow = '8px 8px 0px 0px rgba(0, 0, 0, 1)';
  });
});
```

---

## 3. Berita Detail

**File:** `berita-detail.html`
**Deskripsi:** Halaman artikel penuh dengan drop-cap, blockquote bergaya arsip, grid foto in-article, tag, share bar, dan newsletter CTA.

### Struktur Layout

```
[Navbar]
[Breadcrumb]
[Article Header: kategori + tanggal + judul]
  [Metadata block: penulis + lokasi + kategori]
  [Featured image + keterangan fig]
  [Konten body: drop-cap, blockquote, grid foto 2-col]
  [Tags]
  [Share bar + Download PDF button]
[Newsletter CTA]
[Footer]
```

### Breadcrumb

```html
<nav class="mb-8 flex items-center gap-2 font-label-md text-label-md
            uppercase tracking-widest text-on-surface-variant">
  <span>Arsip Digital</span>
  <span class="material-symbols-outlined text-[16px]">chevron_right</span>
  <span>Warta Desa</span>
  <span class="material-symbols-outlined text-[16px]">chevron_right</span>
  <span class="text-primary font-bold">Detail Berita</span>
</nav>
```

### Header Artikel

```html
<article class="bg-surface-container-low border-[3px] border-on-surface
                p-8 md:p-12 rounded-xl hard-shadow mb-12 relative overflow-hidden">

  <!-- Icon dekoratif background -->
  <div class="absolute top-0 right-0 p-4 opacity-10">
    <span class="material-symbols-outlined text-[120px]"
          style="font-variation-settings: 'FILL' 1;">sailing</span>
  </div>

  <!-- Badge + tanggal -->
  <div class="flex flex-wrap items-center gap-4 mb-6">
    <span class="bg-primary-container text-on-primary-container px-4 py-1
                 border border-on-surface rounded font-label-md text-label-md
                 font-bold uppercase tracking-tighter">Budaya</span>
    <span class="text-on-surface-variant font-label-md text-label-md">
      Diterbitkan: 24 Oktober 1945 / 2024
    </span>
  </div>

  <!-- Judul -->
  <h1 class="font-headline-lg text-headline-lg md:text-display-lg
             text-on-surface mb-8 leading-tight">
    Jawara Obira: Menelusuri Jejak Maritim di Pesisir Utara
  </h1>

  <!-- Metadata 3-kolom -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6
              border-y-2 border-on-surface py-6 mb-10">
    <!-- Penulis -->
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 border-2 border-on-surface rounded-full overflow-hidden shrink-0">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <div>
        <p class="font-label-md text-label-md text-on-surface-variant">Penulis</p>
        <p class="font-body-md font-bold">Raden Mas Wijaya</p>
      </div>
    </div>
    <!-- Lokasi -->
    <div class="flex items-center gap-3">
      <span class="material-symbols-outlined text-primary text-[32px]">location_on</span>
      <div>
        <p class="font-label-md text-label-md text-on-surface-variant">Lokasi</p>
        <p class="font-body-md font-bold">Desa Obira, Maluku Utara</p>
      </div>
    </div>
    <!-- Kategori -->
    <div class="flex items-center gap-3">
      <span class="material-symbols-outlined text-primary text-[32px]">history_edu</span>
      <div>
        <p class="font-label-md text-label-md text-on-surface-variant">Kategori</p>
        <p class="font-body-md font-bold">Warisan Budaya</p>
      </div>
    </div>
  </div>

  <!-- Featured Image + keterangan -->
  <div class="mb-10 group cursor-crosshair">
    <div class="border-[3px] border-on-surface hard-shadow rounded-xl
                overflow-hidden relative">
      <img src="..."
           class="w-full h-[450px] object-cover grayscale hover:grayscale-0
                  transition-all duration-700" />
      <div class="absolute bottom-4 right-4 bg-background border-2 border-on-surface
                  px-3 py-1 font-label-md text-[12px] uppercase rounded">
        Fig. 1. Pelabuhan Tua Obira (Sekitar 1920-an/Restorasi)
      </div>
    </div>
  </div>

  <!-- Body Konten dengan Drop Cap -->
  <div class="font-body-lg text-body-lg space-y-6 leading-relaxed text-on-surface-variant
              selection:bg-primary-container selection:text-on-primary-container">

    <!-- Paragraf pertama dengan drop-cap -->
    <p class="first-letter:text-7xl first-letter:font-headline-lg
              first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:text-primary">
      Di balik deburan ombak...
    </p>

    <p>Paragraf lanjutan...</p>

    <!-- Blockquote bergaya arsip -->
    <div class="my-10 p-8 border-l-8 border-primary bg-surface-container-high
                italic font-headline-md text-headline-md text-on-surface rounded-r-xl">
      "Lautan bukan untuk ditakuti, melainkan untuk diajak bicara..."
      <footer class="mt-4 font-label-md text-label-md font-normal not-italic">
        — Pepatah Kuno Masyarakat Obira
      </footer>
    </div>

    <!-- Sub-heading dalam artikel -->
    <h3 class="font-headline-md text-headline-md text-on-surface mt-10 mb-4
               border-b-2 border-on-surface pb-2 inline-block">
      Teknik Navigasi Astronomi
    </h3>

    <!-- Grid foto 2-kolom in-article -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
      <div class="border-[2px] border-on-surface p-4 bg-surface-container-lowest
                  rounded-xl hard-shadow">
        <img src="..." class="w-full h-48 object-cover mb-4 border border-on-surface rounded-lg" />
        <p class="font-label-md text-[12px] text-center uppercase tracking-wider">
          Artefak: Kompas Perunggu Abad-18
        </p>
      </div>
      <div class="border-[2px] border-on-surface p-4 bg-surface-container-lowest
                  rounded-xl hard-shadow">
        <img src="..." class="w-full h-48 object-cover mb-4 border border-on-surface rounded-lg" />
        <p class="font-label-md text-[12px] text-center uppercase tracking-wider">
          Kegiatan: Konservasi Terumbu Karang
        </p>
      </div>
    </div>

  </div>

  <!-- Tags -->
  <div class="mt-16 pt-8 border-t-[3px] border-on-surface flex flex-wrap gap-3">
    <span class="px-4 py-1 border-2 border-on-surface bg-secondary-container rounded-lg
                 font-label-md text-label-md font-bold uppercase
                 hover:bg-primary-container cursor-pointer transition-colors">
      #Maritim
    </span>
    <!-- tag lainnya -->
  </div>

  <!-- Share Bar -->
  <div class="mt-12 flex flex-col md:flex-row items-center justify-between gap-6
              bg-surface-container p-6 border-2 border-on-surface rounded-xl">
    <div class="flex items-center gap-4">
      <span class="font-bold uppercase font-label-md text-label-md">Bagikan Dokumen:</span>
      <div class="flex gap-2">
        <button class="w-10 h-10 border-2 border-on-surface rounded-lg flex items-center
                       justify-center bg-background hover:bg-primary-container transition-all">
          <span class="material-symbols-outlined text-[20px]">share</span>
        </button>
        <!-- tombol print, mail -->
      </div>
    </div>
    <button class="bg-primary text-on-primary px-8 py-3 border-[3px] border-on-surface
                   rounded-xl hard-shadow btn-hover flex items-center gap-2
                   font-bold uppercase tracking-widest text-label-md">
      <span class="material-symbols-outlined">download</span>
      Unduh Arsip PDF
    </button>
  </div>

</article>
```

### JavaScript

```js
// Parallax ringan pada gambar featured saat scroll
window.addEventListener('scroll', () => {
  const featuredImg = document.querySelector('img[alt="Obira Coast"]');
  if (featuredImg) {
    featuredImg.style.transform = `translateY(${window.pageYOffset * 0.05}px)`;
  }
});

// Letter-spacing saat hover pada elemen interaktif
const interactiveElements = document.querySelectorAll('button, a, input');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => { el.style.letterSpacing = '0.1em'; });
  el.addEventListener('mouseleave', () => { el.style.letterSpacing = ''; });
});
```

---

## 4. Budaya

**File:** `budaya.html`
**Deskripsi:** Katalog warisan budaya dengan hero foto "scrapbook" bertekstur, filter kategori, bento grid konten, blockquote legenda, dan form newsletter.

### CSS Khusus

```css
/* Tekstur dotted background */
body {
  background-color: #fef9f2;
  background-image: radial-gradient(#e6e2db 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Efek foto miring seperti scrapbook */
.scrapbook-rotate-left  { transform: rotate(-1.5deg); }
.scrapbook-rotate-right { transform: rotate(1.5deg); }
```

### Struktur Layout

```
[Navbar]
[Hero: 7-col teks + 5-col foto scrapbook]
[Filter Kategori Bar]
[Culture Bento Grid]
  [Large Feature Card: horizontal 8-col]
  [Side Card: anyam 4-col]
  [Scrapbook Row: 3-col foto miring + 6-col quote + 3-col ikon]
[Newsletter CTA]
[Footer]
```

### Hero Section

```html
<section class="mb-16">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">

    <!-- Teks: 7 kolom -->
    <div class="lg:col-span-7">
      <div class="inline-block bg-primary-container brutalist-border rounded-xl
                  px-4 py-1 mb-6 font-label-md uppercase tracking-widest hard-shadow-sm">
        Katalog Budaya Nusantara
      </div>
      <h1 class="font-display-lg text-display-lg md:text-[64px] mb-6 leading-tight uppercase">
        Budaya - <span class="text-primary underline decoration-4 underline-offset-8">
          Jawara Obira
        </span>
      </h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8">
        Menelusuri jejak-jejak peradaban maritim...
      </p>
      <button class="brutalist-border rounded-xl bg-on-surface text-background
                     px-8 py-4 font-label-md font-bold hard-shadow hover:-translate-y-1 transition-all">
        Eksplorasi Katalog
      </button>
    </div>

    <!-- Foto Scrapbook: 5 kolom -->
    <div class="lg:col-span-5 relative">
      <div class="brutalist-border rounded-xl bg-surface-container-high p-4
                  scrapbook-rotate-right hard-shadow relative z-10 overflow-hidden">
        <img src="..."
             class="w-full aspect-[4/5] object-cover brutalist-border rounded-lg
                    grayscale hover:grayscale-0 transition-all duration-700" />
        <div class="pt-4 border-t-2 border-on-surface mt-4">
          <p class="font-label-md italic text-center text-on-surface-variant">
            Arsip Maritim #042 - Tradisi Kapal Obira
          </p>
        </div>
      </div>
      <!-- Kotak dekoratif dengan ikon layar perahu -->
      <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-container
                  brutalist-border rounded-xl -z-10 hard-shadow-sm
                  flex items-center justify-center">
        <span class="material-symbols-outlined text-[64px]"
              style="font-variation-settings: 'FILL' 1;">sailing</span>
      </div>
    </div>

  </div>
</section>
```

### Filter Bar

```html
<section class="mb-12">
  <div class="flex flex-wrap gap-4 items-center border-y-[3px] border-on-surface py-6">
    <span class="font-label-md uppercase font-bold mr-4">Kategori:</span>
    <!-- Tombol aktif: bg-primary-container -->
    <button class="bg-primary-container brutalist-border rounded-xl px-6 py-2
                   font-label-md font-bold transition-all hover:-translate-y-1">
      Semua Budaya
    </button>
    <!-- Tombol pasif: bg-surface-container-low -->
    <button class="bg-surface-container-low brutalist-border rounded-xl px-6 py-2
                   font-label-md hover:bg-primary-container transition-all">
      Seni Tari
    </button>
    <!-- Tradisi Lisan, Ritus Bahari, Kriya Tangan -->
  </div>
</section>
```

### Bento Grid Budaya

```html
<section class="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-20">

  <!-- Card Feature Besar: 8 kolom, layout horizontal -->
  <div class="md:col-span-8 group">
    <article class="h-full brutalist-border rounded-xl bg-surface-container-low
                    overflow-hidden hard-shadow relative flex flex-col md:flex-row">
      <!-- Gambar kiri: grayscale hilang saat hover group -->
      <div class="md:w-1/2 relative overflow-hidden">
        <img src="..."
             class="w-full h-full object-cover grayscale group-hover:grayscale-0
                    group-hover:scale-105 transition-all duration-700" />
      </div>
      <!-- Konten kanan -->
      <div class="md:w-1/2 p-8 flex flex-col justify-center">
        <div class="flex gap-2 mb-4">
          <span class="bg-primary-container border-[1px] border-on-surface rounded-md
                       px-2 py-1 text-[10px] font-bold uppercase">Ritual Utama</span>
          <span class="bg-surface-container-highest border-[1px] border-on-surface rounded-md
                       px-2 py-1 text-[10px] font-bold uppercase">Heritage</span>
        </div>
        <h2 class="font-headline-lg text-headline-lg mb-4 group-hover:text-primary transition-colors">
          Tari Topeng Samudra
        </h2>
        <p class="font-body-md text-on-surface-variant mb-6">Deskripsi...</p>
        <a class="font-label-md font-bold underline decoration-2 underline-offset-4
                  flex items-center gap-2 group-hover:gap-4 transition-all" href="#">
          Baca Selengkapnya
          <span class="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </article>
  </div>

  <!-- Card Kriya: 4 kolom -->
  <div class="md:col-span-4 group">
    <article class="h-full brutalist-border rounded-xl bg-white p-6 hard-shadow flex flex-col">
      <div class="mb-6 overflow-hidden brutalist-border rounded-xl">
        <img src="..."
             class="w-full aspect-video object-cover group-hover:scale-110 transition-all duration-500" />
      </div>
      <h3 class="font-headline-md text-headline-md mb-2">Kriya Anyam Pesisir</h3>
      <p class="font-body-md text-on-surface-variant mb-4">Deskripsi...</p>
      <div class="mt-auto pt-4 border-t-2 border-on-surface flex justify-between items-center">
        <span class="font-label-md italic">Oleh: Komunitas Obira</span>
        <span class="material-symbols-outlined">favorite</span>
      </div>
    </article>
  </div>

  <!-- Baris Scrapbook: 3 + 6 + 3 kolom -->

  <!-- Foto miring kiri: 3 kolom -->
  <div class="md:col-span-3 group">
    <div class="brutalist-border rounded-xl bg-surface-container-high p-4
                scrapbook-rotate-left hard-shadow-sm hover:rotate-0 transition-all">
      <img src="..."
           class="w-full aspect-square object-cover mb-4 rounded-lg grayscale" />
      <h4 class="font-headline-md text-headline-md text-center">Sang Maestro</h4>
    </div>
  </div>

  <!-- Blockquote utama: 6 kolom -->
  <div class="md:col-span-6 group">
    <article class="brutalist-border rounded-xl bg-primary-container p-8 hard-shadow
                    h-full flex flex-col justify-center text-on-primary-container">
      <span class="material-symbols-outlined text-4xl mb-4"
            style="font-variation-settings: 'FILL' 1;">auto_stories</span>
      <h2 class="font-display-lg text-[32px] mb-4 uppercase leading-none">
        Hikayat Pelaut Tua
      </h2>
      <p class="font-body-lg mb-6 leading-relaxed">
        "Lautan tidak pernah berbohong. Ia menyimpan rahasia kita..."
      </p>
      <div class="flex items-center gap-4">
        <div class="h-1 w-20 bg-on-primary-container"></div>
        <span class="font-label-md font-bold uppercase tracking-tighter">Legenda Rakyat</span>
      </div>
    </article>
  </div>

  <!-- Ikon filosofi: 3 kolom -->
  <div class="md:col-span-3 group">
    <div class="brutalist-border rounded-xl bg-white p-4 scrapbook-rotate-right
                hard-shadow-sm hover:rotate-0 transition-all flex flex-col h-full">
      <div class="flex-grow flex items-center justify-center
                  bg-secondary-container brutalist-border rounded-lg mb-4">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant">waves</span>
      </div>
      <div class="text-center">
        <h4 class="font-headline-md text-headline-md mb-2">Simbol Laut</h4>
        <p class="font-label-md italic">Filosofi 'Obira'</p>
      </div>
    </div>
  </div>

</section>
```

---

## 5. UMKM

**File:** `umkm.html`
**Deskripsi:** Direktori usaha lokal dengan search bar, bento grid dengan featured artisan card besar, dan kartu produk per kategori.

### CSS Khusus

```css
.oceanic-texture {
  background-image: url("https://www.transparenttextures.com/patterns/aged-paper.png");
}
```

### Search & Filter Bar

```html
<div class="mb-12 flex flex-col md:flex-row gap-gutter items-stretch">
  <!-- Search input dengan ikon -->
  <div class="flex-grow relative">
    <input type="text"
           placeholder="Search by craft, name, or product..."
           class="w-full bg-surface-container-low border-[3px] border-on-surface
                  p-4 pl-12 font-body-md focus:outline-none rounded-xl
                  hard-shadow-hover transition-all" />
    <span class="material-symbols-outlined absolute left-4 top-1/2
                 -translate-y-1/2 text-on-surface-variant">search</span>
  </div>
  <button class="bg-surface-container-high border-[3px] border-on-surface
                 px-8 py-4 font-label-md font-bold rounded-xl hard-shadow
                 hover:bg-surface-dim transition-all flex items-center gap-2">
    <span class="material-symbols-outlined">filter_list</span>
    Filters
  </button>
</div>
```

### Featured Artisan Card (8 kolom)

```html
<div class="md:col-span-8 bg-surface-container border-[3px] border-on-surface
            rounded-xl relative overflow-hidden flex flex-col
            hard-shadow-hover transition-all group">

  <!-- Gambar header: zoom saat hover group -->
  <div class="aspect-video w-full relative overflow-hidden border-b-[3px] border-on-surface">
    <img src="..."
         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    <div class="absolute top-4 left-4 bg-primary-container text-on-primary-container
                px-3 py-1 border-2 border-on-surface rounded-md font-label-md font-bold uppercase">
      Featured Artisan
    </div>
  </div>

  <!-- Konten -->
  <div class="p-8">
    <div class="flex justify-between items-start mb-4">
      <h2 class="font-headline-lg text-headline-lg">Anyaman Bambu Pak RT</h2>
      <span class="bg-green-100 text-green-800 px-3 py-1 border-[1px] border-on-surface
                   rounded-md font-label-md text-label-md">Open Now</span>
    </div>
    <p class="font-body-md text-body-md mb-6 text-on-surface-variant">
      Deskripsi pengrajin...
    </p>
    <div class="flex flex-wrap gap-2 mb-8">
      <span class="bg-surface-container-highest px-3 py-1 border-[1px] border-on-surface
                   rounded-md font-label-md text-label-md">Handicraft</span>
      <!-- tag lainnya -->
    </div>
    <button class="w-fit bg-primary-container text-on-primary-container
                   border-[3px] border-on-surface px-6 py-3 font-label-md font-bold
                   rounded-xl hard-shadow hover:-translate-y-1 transition-all">
      View Full Profile
    </button>
  </div>
</div>
```

### Standard Product Card (4 kolom)

```html
<div class="md:col-span-4 bg-surface-container-low border-[3px] border-on-surface
            rounded-xl hard-shadow-hover transition-all flex flex-col overflow-hidden">
  <div class="h-48 border-b-[3px] border-on-surface">
    <img src="..." class="w-full h-full object-cover" />
  </div>
  <div class="p-6 flex-grow">
    <!-- Ikon + label kategori -->
    <div class="flex items-center gap-2 mb-2 text-primary">
      <span class="material-symbols-outlined text-[20px]">coffee</span>
      <span class="font-label-md text-label-md font-bold uppercase">Kuliner</span>
    </div>
    <h3 class="font-headline-md text-headline-md mb-2">Kopi Obira Heritage</h3>
    <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3">
      Deskripsi produk...
    </p>
  </div>
  <!-- Footer card: rating + link -->
  <div class="p-6 border-t-[2px] border-on-surface flex justify-between items-center">
    <span class="font-label-md text-label-md font-bold">5.0 ★</span>
    <button class="text-primary font-bold font-label-md text-label-md hover:underline">
      Explore
    </button>
  </div>
</div>
```

### JavaScript

```js
// Hard shadow interaktif pada kartu
document.querySelectorAll('.hard-shadow-hover').forEach(card => {
  card.addEventListener('mousedown', () => {
    card.style.transform = 'translate(2px, 2px)';
    card.style.boxShadow = '2px 2px 0px 0px rgba(0,0,0,1)';
  });
  card.addEventListener('mouseup', () => {
    card.style.transform = 'translate(-2px, -2px)';
    card.style.boxShadow = '8px 8px 0px 0px rgba(0,0,0,1)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)';
  });
});

// Search bar focus: animasi geser + shadow biru
const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener('focus', () => {
  searchInput.parentElement.style.transform = 'translate(-4px, -4px)';
  searchInput.style.boxShadow = '10px 10px 0px 0px #51B8EA';
});
searchInput.addEventListener('blur', () => {
  searchInput.parentElement.style.transform = '';
  searchInput.style.boxShadow = '';
});
```

---

## 6. Profil

**File:** `profil.html`
**Deskripsi:** Halaman profil desa dengan peta interaktif bergaya vintage (gambar + marker tooltip), statistik demografi, dan section potensi strategis.

### Struktur Layout

```
[Navbar + search input]
[Hero Header: judul + deskripsi]
[Konten Utama: 8-col peta + 4-col stats]
  [Peta Interaktif dengan marker & legenda]
  [Demografi Card]
  [Mata Pencaharian Card]
  [Iklim & Geografi Card]
[Potensi Strategis: 3-col grid]
[CTA Kontribusi Peta]
[Footer]
[FAB: add_location]
```

### Peta Interaktif

```html
<section class="lg:col-span-8">
  <div class="bg-surface-container-low border-[3px] border-on-surface
              hard-shadow overflow-hidden relative group rounded-xl">

    <!-- Header peta -->
    <div class="p-6 border-b-[2px] border-on-surface flex justify-between
                items-center bg-white">
      <h2 class="font-headline-md text-headline-md flex items-center gap-2">
        <span class="material-symbols-outlined">map</span>
        Peta Interaktif
      </h2>
      <div class="flex gap-2">
        <button class="w-10 h-10 border-[2px] border-on-surface flex items-center
                       justify-center hover:bg-primary-container transition-colors rounded-lg">
          <span class="material-symbols-outlined">zoom_in</span>
        </button>
        <button class="w-10 h-10 border-[2px] border-on-surface flex items-center
                       justify-center hover:bg-primary-container transition-colors rounded-lg">
          <span class="material-symbols-outlined">zoom_out</span>
        </button>
      </div>
    </div>

    <!-- Canvas peta: gambar vintage dengan overlay biru -->
    <div class="h-[500px] bg-[#e6e2db] relative overflow-hidden cursor-crosshair">
      <img src="..."
           class="w-full h-full object-cover grayscale contrast-125 opacity-80 mix-blend-multiply" />

      <!-- Marker 1: animasi bounce -->
      <div class="absolute top-1/4 left-1/3 group/pin">
        <div class="w-8 h-8 bg-primary-container border-[2px] border-on-surface
                    rounded-full flex items-center justify-center animate-bounce
                    hard-shadow cursor-pointer">
          <span class="material-symbols-outlined text-sm"
                style="font-variation-settings: 'FILL' 1;">location_on</span>
        </div>
        <!-- Tooltip hover -->
        <div class="absolute top-10 left-0 bg-white border-[2px] border-on-surface
                    p-2 whitespace-nowrap opacity-0 group-hover/pin:opacity-100
                    transition-opacity font-label-md text-label-md hard-shadow-sm z-10 rounded-lg">
          Dermaga Utama Obira
        </div>
      </div>

      <!-- Marker 2: animasi pulse -->
      <div class="absolute bottom-1/3 right-1/4 group/pin">
        <div class="w-8 h-8 bg-primary-container border-[2px] border-on-surface
                    rounded-full flex items-center justify-center animate-pulse
                    hard-shadow-sm cursor-pointer">
          <span class="material-symbols-outlined text-sm"
                style="font-variation-settings: 'FILL' 1;">tsunami</span>
        </div>
        <div class="absolute top-10 left-0 bg-white border-[2px] border-on-surface
                    p-2 whitespace-nowrap opacity-0 group-hover/pin:opacity-100
                    transition-opacity font-label-md text-label-md hard-shadow-sm z-10 rounded-lg">
          Kawasan Konservasi Mangrove
        </div>
      </div>

      <!-- Legenda pojok kiri bawah -->
      <div class="absolute bottom-6 left-6 bg-white border-[3px] border-on-surface
                  p-4 hard-shadow-sm rounded-xl">
        <h3 class="font-bold border-b-[1px] border-on-surface mb-2 font-label-md">Legenda Peta</h3>
        <ul class="space-y-1">
          <li class="flex items-center gap-2 font-label-md text-label-md">
            <span class="w-4 h-4 bg-primary-container border-[1px] border-on-surface rounded-sm"></span>
            Titik Utama
          </li>
          <li class="flex items-center gap-2 font-label-md text-label-md">
            <span class="w-4 h-4 bg-[#51B8EA] opacity-40 border-[1px] border-on-surface rounded-sm"></span>
            Wilayah Perairan
          </li>
          <li class="flex items-center gap-2 font-label-md text-label-md">
            <span class="w-4 h-1 bg-on-surface"></span>
            Batas Administrasi
          </li>
        </ul>
      </div>
    </div>

  </div>
</section>
```

### Kartu Demografi

```html
<div class="bg-surface-container-high border-[3px] border-on-surface
            p-6 hard-shadow hover-shift transition-all rounded-xl">
  <div class="flex items-center gap-3 mb-4">
    <div class="p-2 bg-primary-container border-[2px] border-on-surface rounded-lg">
      <span class="material-symbols-outlined">groups</span>
    </div>
    <h3 class="font-headline-md text-headline-md">Demografi</h3>
  </div>

  <!-- Progress bar -->
  <div class="flex justify-between font-label-md text-label-md mb-1">
    <span>Total Penduduk</span>
    <span class="font-bold">4,281 Jiwa</span>
  </div>
  <div class="h-4 bg-white border-[2px] border-on-surface relative rounded-full overflow-hidden">
    <div class="absolute left-0 top-0 h-full bg-primary-container
                border-r-[2px] border-on-surface" style="width: 65%;"></div>
  </div>

  <!-- Laki-laki / Perempuan -->
  <div class="grid grid-cols-2 gap-4 mt-4">
    <div class="p-3 bg-white border-[2px] border-on-surface rounded-xl">
      <p class="text-xs uppercase font-bold text-on-surface-variant">Laki-laki</p>
      <p class="font-headline-md text-headline-md">52%</p>
    </div>
    <div class="p-3 bg-white border-[2px] border-on-surface rounded-xl">
      <p class="text-xs uppercase font-bold text-on-surface-variant">Perempuan</p>
      <p class="font-headline-md text-headline-md">48%</p>
    </div>
  </div>
</div>
```

### Floating Action Button (FAB)

```html
<button class="fixed bottom-8 right-8 w-16 h-16 bg-primary-container
               border-[3px] border-on-surface rounded-full flex items-center
               justify-center hard-shadow hover-shift transition-all z-50 group">
  <span class="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform"
        style="font-variation-settings: 'FILL' 1;">add_location</span>
</button>
```

---

## 7. TOGA

**File:** `toga.html`
**Deskripsi:** Repositori tanaman obat keluarga dengan layout dua panel — daftar kartu tanaman di sidebar kiri dan detail panel di kanan. Kartu aktif menggunakan `active-card` class.

### CSS Khusus

```css
body {
  background-image: url("https://www.transparenttextures.com/patterns/parchment.png");
}

.hard-shadow-sm { box-shadow: 3px 3px 0px 0px rgba(0,0,0,1); }

/* Kartu yang sedang aktif/terpilih */
.active-card {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
}

/* Background panel detail dengan gradien biru transparan */
.oceanic-accent {
  background: linear-gradient(135deg, rgba(81, 184, 234, 0.1) 0%, rgba(255,255,255,0) 100%);
}
```

### Struktur Layout: Dua Panel

```html
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter min-h-[800px]">

  <!-- Panel Kiri: Sidebar daftar tanaman (4 kolom) -->
  <aside class="lg:col-span-4 space-y-6">

    <!-- Filter chip -->
    <div class="rounded-xl neo-border bg-surface-container p-6 hard-shadow-sm mb-8">
      <h2 class="font-headline-md text-headline-md mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined">filter_list</span> Filter Arsip
      </h2>
      <div class="flex flex-wrap gap-2">
        <span class="bg-primary-container px-3 py-1 rounded-full neo-border
                     text-xs font-bold uppercase cursor-pointer">Semua</span>
        <span class="bg-background px-3 py-1 rounded-full neo-border
                     text-xs font-bold uppercase cursor-pointer
                     hover:bg-primary-container transition-colors">Rimpang</span>
        <!-- Daun, Buah -->
      </div>
    </div>

    <!-- Daftar kartu tanaman, scrollable -->
    <div class="space-y-4 overflow-y-auto max-h-[700px] pr-2">

      <!-- Kartu Aktif (class: active-card) -->
      <div class="rounded-xl neo-border bg-white p-4 active-card transition-all
                  cursor-pointer group relative overflow-hidden">
        <!-- Badge nomor katalog pojok kanan atas -->
        <div class="absolute top-0 right-0 bg-primary-container px-3 py-1
                    border-l-2 border-b-2 border-on-surface rounded-bl-xl">
          <span class="text-xs font-bold">R-001</span>
        </div>
        <div class="flex gap-4 items-center">
          <div class="w-20 h-20 bg-surface-container-high rounded-lg neo-border
                      overflow-hidden shrink-0">
            <img src="..." class="w-full h-full object-cover" />
          </div>
          <div>
            <h3 class="font-headline-md text-lg font-bold group-hover:text-primary transition-colors">
              Jahe Merah
            </h3>
            <p class="text-sm font-label-md italic text-on-surface-variant">
              Zingiber officinale var. Rubrum
            </p>
            <span class="inline-block mt-2 text-xs bg-tertiary-fixed px-2 py-0.5
                         rounded-full neo-border font-bold">STAMINA</span>
          </div>
        </div>
      </div>

      <!-- Kartu Non-Aktif (class: hard-shadow-sm + hover) -->
      <div class="rounded-xl neo-border bg-white p-4 hard-shadow-sm
                  hover:-translate-y-1 hover:-translate-x-1
                  hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                  transition-all cursor-pointer group relative">
        <!-- Identik strukturnya, nomor badge: bg-surface-container-highest -->
      </div>

    </div>
  </aside>

  <!-- Panel Kanan: Detail (8 kolom) -->
  <article class="lg:col-span-8">
    <div class="rounded-xl neo-border bg-white p-8 hard-shadow oceanic-accent min-h-full">

      <!-- Foto + Identitas -->
      <div class="flex flex-col md:flex-row gap-8 mb-10">
        <!-- Foto dengan rotasi 1deg (kesan arsip) -->
        <div class="w-full md:w-1/3 shrink-0">
          <div class="rounded-xl neo-border p-2 bg-background hard-shadow-sm rotate-1">
            <img src="..."
                 class="w-full aspect-square object-cover rounded-lg" />
          </div>
        </div>
        <!-- Info -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <span class="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">
              Katalog No: R-001
            </span>
            <span class="material-symbols-outlined text-on-surface-variant cursor-pointer
                         hover:text-primary">bookmark_border</span>
          </div>
          <h2 class="font-display-lg text-display-lg mb-2">Jahe Merah</h2>
          <p class="font-headline-md text-headline-md text-on-surface-variant italic mb-6">
            Zingiber officinale var. Rubrum
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 border-2 border-on-surface bg-surface-container rounded-lg">
              <p class="text-xs font-bold uppercase mb-1">Habitat Utama</p>
              <p class="font-body-md">Tanah Tropis Lembab</p>
            </div>
            <div class="p-3 border-2 border-on-surface bg-surface-container rounded-lg">
              <p class="text-xs font-bold uppercase mb-1">Karakteristik</p>
              <p class="font-body-md">Rhizoma Merah, Rasa Pedas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Konten: 2 kolom — Manfaat + Resep -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Manfaat Kesehatan -->
        <section>
          <h4 class="font-headline-md text-headline-md border-b-[3px] border-on-surface mb-4 pb-2">
            Manfaat Kesehatan
          </h4>
          <ul class="space-y-4">
            <li class="flex gap-4">
              <span class="material-symbols-outlined text-primary">check_circle</span>
              <p class="font-body-md">
                <strong>Meningkatkan Imunitas:</strong> Kandungan gingerol yang tinggi...
              </p>
            </li>
          </ul>
        </section>

        <!-- Resep Tradisional -->
        <section>
          <h4 class="font-headline-md text-headline-md border-b-[3px] border-on-surface mb-4 pb-2">
            Resep Tradisional
          </h4>
          <div class="bg-primary-container p-6 rounded-xl neo-border hard-shadow-sm">
            <h5 class="font-bold mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined">local_drink</span> Wedang Jahe Merah
            </h5>
            <p class="text-sm mb-4">Minuman penghangat tubuh...</p>
            <div class="space-y-2 text-sm font-body-md border-t border-on-surface pt-4">
              <p><strong>1.</strong> Cuci bersih dan memarkan 2 rimpang jahe merah.</p>
              <p><strong>2.</strong> Rebus dengan 500ml air hingga mendidih.</p>
              <!-- langkah 3 & 4 -->
            </div>
          </div>
        </section>
      </div>

    </div>
  </article>

</div>
```

### Floating Action Button

```html
<button class="fixed bottom-8 right-8 bg-primary text-on-primary w-16 h-16 rounded-full
               neo-border hard-shadow flex items-center justify-center
               group hover:scale-110 transition-transform" id="add-to-archive">
  <span class="material-symbols-outlined text-3xl">add</span>
  <!-- Tooltip kiri -->
  <span class="absolute right-20 bg-black text-white px-3 py-1 rounded-lg text-xs
               font-bold whitespace-nowrap opacity-0 group-hover:opacity-100
               transition-opacity pointer-events-none">KONTRIBUSI DATA</span>
</button>
```

### JavaScript

```js
// Klik kartu di sidebar → aktifkan, fade panel kanan
document.querySelectorAll('aside .neo-border').forEach(card => {
  if (card.classList.contains('cursor-pointer')) {
    card.addEventListener('click', function() {
      // Reset semua
      document.querySelectorAll('aside .neo-border').forEach(c => {
        c.classList.remove('active-card');
        c.classList.add('hard-shadow-sm');
      });
      // Aktifkan yang diklik
      this.classList.add('active-card');
      this.classList.remove('hard-shadow-sm');
      // Animasi fade panel detail
      const mainDisplay = document.querySelector('article > div');
      mainDisplay.style.opacity = '0.5';
      setTimeout(() => { mainDisplay.style.opacity = '1'; }, 150);
    });
  }
});
```

---

## 8. KKN Hub

**File:** `kkn-hub.html`
**Deskripsi:** Portal pusat navigasi dengan hero besar, bento grid navigasi (tim, jurnal, hasil, status), dan showcase kerajinan UMKM.

### CSS Khusus

```css
.hover-lift:hover {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
}

/* Gradien radial untuk overlay oceanic */
.ocean-engraving-overlay {
  mask-image: radial-gradient(circle at center, transparent 30%, black 100%);
  opacity: 0.1;
}
```

### Hero Section

```html
<section class="mb-16 relative overflow-hidden border-[3px] border-on-surface
                bg-surface-container p-8 md:p-16 rounded-xl">

  <!-- Overlay dekoratif -->
  <div class="absolute inset-0 ocean-engraving-overlay pointer-events-none"></div>

  <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    <!-- Teks -->
    <div class="space-y-6">
      <div class="inline-block bg-primary-container text-on-surface font-label-md
                  px-4 py-1 border-[1px] border-on-surface uppercase tracking-widest rounded-lg">
        Official Archive
      </div>
      <h1 class="font-display-lg text-display-lg text-on-surface leading-none">
        KKN Hub - <br/>
        <span class="text-primary italic">Jawara Obira</span>
      </h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
        The central digital gateway...
      </p>
      <button class="bg-primary-container text-on-surface font-bold px-8 py-4
                     border-[3px] border-on-surface rounded-xl hard-shadow
                     hover-lift flex items-center gap-2">
        <span class="material-symbols-outlined"
              style="font-variation-settings: 'FILL' 1;">explore</span>
        Explore Map
      </button>
    </div>

    <!-- Gambar dengan hard shadow + label overlay -->
    <div class="relative">
      <div class="border-[3px] border-on-surface rounded-xl hard-shadow
                  bg-background overflow-hidden aspect-[4/3]">
        <img src="..."
             class="w-full h-full object-cover grayscale hover:grayscale-0
                    transition-all duration-700" />
      </div>
      <div class="absolute -bottom-4 -left-4 bg-primary-container border-[3px]
                  border-on-surface px-6 py-3 font-headline-md hard-shadow rounded-lg">
        Impact: Phase I
      </div>
    </div>

  </div>
</section>
```

### Bento Navigation Grid

```html
<section class="mb-16">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">

    <!-- 01 Team Card: 4 kolom -->
    <div class="md:col-span-4 border-[3px] border-on-surface bg-surface-container-high
                p-8 rounded-xl hover-lift hard-shadow transition-all group flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start mb-12">
          <span class="material-symbols-outlined text-5xl text-primary"
                style="font-variation-settings: 'FILL' 1;">groups</span>
          <span class="font-label-md text-on-surface-variant">01 / TEAM</span>
        </div>
        <h3 class="font-headline-lg text-headline-lg mb-4">The Collective</h3>
        <p class="font-body-md text-on-surface-variant mb-6">
          Meet the visionaries, researchers...
        </p>
      </div>
      <a class="flex items-center gap-2 font-bold group-hover:text-primary" href="#">
        View Directory
        <span class="material-symbols-outlined">arrow_right_alt</span>
      </a>
    </div>

    <!-- 02 Journal Card: 8 kolom, layout dua kolom di dalamnya -->
    <div class="md:col-span-8 border-[3px] border-on-surface bg-background
                p-8 rounded-xl hover-lift hard-shadow transition-all group overflow-hidden relative">
      <div class="relative z-10 flex flex-col md:flex-row h-full gap-8">
        <!-- Teks -->
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-12">
              <span class="material-symbols-outlined text-5xl text-primary"
                    style="font-variation-settings: 'FILL' 1;">auto_stories</span>
              <span class="font-label-md text-on-surface-variant">02 / JOURNAL</span>
            </div>
            <h3 class="font-display-lg text-display-lg mb-4">Expedition Log</h3>
            <p class="font-body-lg text-on-surface-variant mb-6">
              Daily dispatches, field notes...
            </p>
          </div>
          <div class="flex gap-4">
            <span class="px-3 py-1 border border-on-surface font-label-md
                         bg-surface-container rounded-lg">Culture</span>
            <span class="px-3 py-1 border border-on-surface font-label-md
                         bg-surface-container rounded-lg">Ecology</span>
          </div>
        </div>
        <!-- Gambar kanan -->
        <div class="flex-1">
          <div class="border-[2px] border-on-surface h-full min-h-[240px] rounded-lg overflow-hidden">
            <img src="..." class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <!-- 03 Impact Matrix: 7 kolom, bg biru gelap -->
    <div class="md:col-span-7 border-[3px] border-on-surface bg-primary text-on-primary
                p-8 rounded-xl hover-lift hard-shadow transition-all group">
      <div class="flex justify-between items-start mb-12">
        <span class="material-symbols-outlined text-5xl text-primary-container"
              style="font-variation-settings: 'FILL' 1;">analytics</span>
        <span class="font-label-md opacity-70">03 / RESULTS</span>
      </div>
      <h3 class="font-display-lg text-display-lg mb-4">The Impact Matrix</h3>
      <p class="font-body-lg mb-8 opacity-90">Quantifying the socio-economic evolution...</p>
      <button class="bg-primary-container text-on-surface font-bold px-6 py-3
                     border-[2px] border-on-surface rounded-xl hover:bg-white transition-colors">
        Download Report
      </button>
    </div>

    <!-- 04 Status: 5 kolom, centered -->
    <div class="md:col-span-5 border-[3px] border-on-surface bg-surface-container-highest
                p-8 rounded-xl hover-lift hard-shadow transition-all group
                flex flex-col justify-center items-center text-center">
      <div class="w-24 h-24 rounded-full border-[3px] border-on-surface
                  flex items-center justify-center mb-6 bg-primary-container">
        <span class="material-symbols-outlined text-4xl">water_drop</span>
      </div>
      <h4 class="font-headline-md text-headline-md mb-2 uppercase tracking-tighter">
        Oceanic Pulse
      </h4>
      <p class="font-label-md text-on-surface-variant">Live Expedition Status: Active</p>
      <!-- Animated dots -->
      <div class="mt-6 flex gap-2">
        <div class="w-3 h-3 bg-primary animate-ping rounded-full"></div>
        <div class="w-3 h-3 bg-primary rounded-full"></div>
        <div class="w-3 h-3 bg-primary rounded-full"></div>
      </div>
    </div>

  </div>
</section>
```

---

## 9. Jurnal KKN

**File:** `jurnal-kkn.html`
**Deskripsi:** Halaman log harian dengan sidebar statistik dan kalender grid interaktif (7 kolom) serta daftar dispatch terbaru.

### CSS Khusus

```css
/* Grid kalender 7 kolom */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.neo-border { border: 3px solid #1d1c18; }

/* Variasi tekstur untuk sidebar */
.textured-paper {
  background-image: url("https://www.transparenttextures.com/patterns/rebel.png");
}
```

### Sidebar: Statistik Program

```html
<aside class="lg:col-span-4 space-y-gutter">

  <!-- Catatan Unggulan -->
  <div class="neo-border bg-surface-container-high p-6 hard-shadow textured-paper rounded-xl">
    <div class="border-b-2 border-on-surface pb-2 mb-4 flex justify-between items-center">
      <h3 class="font-headline-md text-headline-md uppercase">Catatan Unggulan</h3>
      <span class="material-symbols-outlined text-primary">anchor</span>
    </div>
    <img src="..." class="w-full h-48 object-cover neo-border mb-4 grayscale rounded-lg" />
    <p class="font-label-md text-label-md text-primary font-bold mb-2">MINGGU 2 • BUDAYA MARITIM</p>
    <h4 class="font-headline-md text-headline-md mb-2">Restorasi Kapal Tradisional</h4>
    <p class="font-body-md text-body-md text-on-surface-variant mb-4">Deskripsi singkat...</p>
    <button class="w-full py-2 bg-primary-container neo-border font-bold
                   uppercase tracking-widest press-effect hard-shadow-sm rounded-lg">
      Baca Selengkapnya
    </button>
  </div>

  <!-- Statistik numerik -->
  <div class="neo-border bg-background p-6 hard-shadow rounded-xl">
    <h3 class="font-headline-md text-headline-md border-b-2 border-on-surface pb-2 mb-4">
      Statistik Program
    </h3>
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="font-label-md text-label-md">HARI BERJALAN</span>
        <span class="font-headline-md text-headline-md">18 / 30</span>
      </div>
      <!-- Progress bar -->
      <div class="w-full h-4 bg-surface-container-highest neo-border overflow-hidden rounded-full">
        <div class="h-full bg-primary-container rounded-full" style="width: 60%"></div>
      </div>
      <!-- Items lainnya -->
    </div>
  </div>

</aside>
```

### Kalender Grid Interaktif

```html
<div class="lg:col-span-8">
  <div class="neo-border bg-white hard-shadow rounded-xl overflow-hidden">

    <!-- Controls navigasi bulan -->
    <div class="flex items-center justify-between p-6 border-b-[3px] border-on-surface
                bg-surface-container-low">
      <button class="p-2 neo-border hover:bg-primary-container transition-colors
                     press-effect rounded-lg">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
      <h2 class="font-headline-lg text-headline-lg uppercase tracking-tight">AGUSTUS 2024</h2>
      <button class="p-2 neo-border hover:bg-primary-container transition-colors
                     press-effect rounded-lg">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    </div>

    <!-- Header hari (Sen–Min) -->
    <div class="calendar-grid border-b-[3px] border-on-surface">
      <div class="p-4 border-r-[3px] border-on-surface text-center font-bold
                  bg-surface-dim uppercase font-label-md text-label-md">Min</div>
      <!-- Sen, Sel, Rab, Kam, Jum, Sab -->
    </div>

    <!-- Isi kalender -->
    <div class="calendar-grid">

      <!-- Sel tidak aktif (opacity 50%) -->
      <div class="min-h-[120px] p-2 border-r-[3px] border-b-[3px] border-on-surface
                  bg-surface-container-highest opacity-50"></div>

      <!-- Sel aktif: hover bg + klik ring -->
      <div class="min-h-[120px] p-2 border-r-[3px] border-b-[3px] border-on-surface
                  group hover:bg-surface-container-low transition-colors cursor-pointer">
        <span class="font-bold text-headline-md font-headline-md">1</span>
      </div>

      <!-- Sel dengan event label -->
      <div class="min-h-[120px] p-2 border-r-[3px] border-b-[3px] border-on-surface
                  group hover:bg-surface-container-low transition-colors cursor-pointer">
        <span class="font-bold text-headline-md font-headline-md">2</span>
        <div class="mt-2 text-[10px] uppercase font-bold leading-tight text-primary">
          Branding UMKM
        </div>
      </div>

      <!-- Sel featured: bg primary-container + badge putih + bintang -->
      <div class="min-h-[120px] p-2 border-r-[3px] border-b-[3px] border-on-surface
                  bg-primary-container relative group cursor-pointer">
        <span class="font-bold text-headline-md font-headline-md">15</span>
        <div class="mt-2 p-1 bg-white neo-border text-[9px] uppercase
                    font-extrabold leading-tight shadow-sm rounded">
          Lokakarya Budaya
        </div>
        <div class="absolute bottom-2 right-2">
          <span class="material-symbols-outlined text-on-primary-container text-lg"
                style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
      </div>

    </div>
  </div>
</div>
```

### JavaScript

```js
// Klik hari kalender: highlight ring + log
document.querySelectorAll('.calendar-grid div').forEach(day => {
  day.addEventListener('click', function() {
    if (this.classList.contains('group')) {
      document.querySelectorAll('.calendar-grid div')
        .forEach(d => d.classList.remove('ring-4', 'ring-primary-container', 'ring-inset'));
      this.classList.add('ring-4', 'ring-primary-container', 'ring-inset');
    }
  });
});
```

---

## 10. Fauna

**File:** `fauna.html`
**Deskripsi:** Katalog keanekaragaman hayati dengan kursor crosshair, filter spesies, bento grid kartu fauna, dan statistik biodiversitas.

### CSS Khusus

```css
/* Kursor custom crosshair SVG inline */
body {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line></svg>'), auto;
}
```

### Bento Grid Fauna

```html
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">

  <!-- Card Feature Besar: 8 kolom -->
  <article class="md:col-span-8 group border-[3px] border-on-surface bg-surface-container
                  overflow-hidden rounded-xl hard-shadow-primary hover-hard-shadow transition-all">
    <div class="relative h-96 overflow-hidden border-b-[3px] border-on-surface">
      <!-- Gambar grayscale → berwarna saat hover group -->
      <img src="..."
           class="w-full h-full object-cover grayscale group-hover:grayscale-0
                  transition-all duration-500 scale-105 group-hover:scale-100" />
      <div class="absolute top-4 left-4 flex gap-2">
        <span class="bg-tertiary text-white border-2 border-on-surface px-3 py-1
                     font-label-md font-bold uppercase rounded-lg">Critically Endangered</span>
        <span class="bg-primary-container text-on-surface border-2 border-on-surface
                     px-3 py-1 font-label-md font-bold uppercase rounded-lg">Endemic</span>
      </div>
    </div>
    <div class="p-8">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="font-headline-lg text-headline-lg mb-1">Obi Woodcock</h3>
          <p class="font-body-md text-on-surface-variant italic">Scolopax rochussenii</p>
        </div>
        <div class="text-right">
          <p class="font-label-md text-primary font-bold">CATALOG NO.</p>
          <p class="font-headline-md font-bold">#OB-001</p>
        </div>
      </div>
      <p class="font-body-md text-on-surface mb-6 line-clamp-3">Deskripsi spesies...</p>
      <div class="flex items-center gap-6 pt-6 border-t-2 border-on-surface border-dashed">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">location_on</span>
          <span class="font-label-md uppercase">Obi Mountain Range</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">visibility</span>
          <span class="font-label-md uppercase">Rare Sighting</span>
        </div>
      </div>
    </div>
  </article>

  <!-- Card Kecil Status 1: 4 kolom -->
  <article class="md:col-span-4 border-[3px] border-on-surface bg-white
                  rounded-xl hard-shadow-primary hover-hard-shadow transition-all group">
    <div class="aspect-square overflow-hidden border-b-[3px] border-on-surface">
      <!-- sepia ringan, hilang saat hover -->
      <img src="..."
           class="w-full h-full object-cover filter sepia-[0.3] group-hover:sepia-0
                  transition-all duration-300" />
    </div>
    <div class="p-6">
      <!-- Badge warna kuning untuk Vulnerable -->
      <span class="bg-[#facc15] text-on-surface border-2 border-on-surface px-2 py-0.5
                   font-label-md font-bold uppercase mb-3 inline-block rounded-lg">
        Vulnerable
      </span>
      <h3 class="font-headline-md text-headline-md mb-2">Golden Birdwing</h3>
      <p class="font-body-md text-on-surface-variant line-clamp-2">Deskripsi singkat...</p>
    </div>
  </article>

  <!-- Card Marine (bg biru gelap): 8 kolom, layout horizontal -->
  <article class="md:col-span-8 border-[3px] border-on-surface bg-primary text-on-primary
                  overflow-hidden rounded-xl hard-shadow-primary hover-hard-shadow
                  transition-all flex flex-col md:flex-row group">
    <div class="md:w-1/2 h-64 md:h-auto overflow-hidden">
      <img src="..."
           class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
    </div>
    <div class="p-8 md:w-1/2 flex flex-col justify-center">
      <span class="bg-primary-container text-on-primary-container border-2 border-on-surface
                   px-2 py-0.5 font-label-md font-bold uppercase mb-4 self-start rounded-lg">
        Protected
      </span>
      <h3 class="font-headline-lg text-headline-lg mb-4">Oceanic Dugong</h3>
      <p class="font-body-md mb-6 text-primary-fixed">Deskripsi dugong...</p>
      <a class="inline-flex items-center gap-2 font-label-md font-bold hover:underline" href="#">
        READ MARINE LOGS
        <span class="material-symbols-outlined">arrow_right_alt</span>
      </a>
    </div>
  </article>

</div>
```

### Statistik Biodiversitas

```html
<section class="mt-24 grid grid-cols-1 md:grid-cols-4 gap-gutter border-[3px] border-on-surface
                bg-surface-container-high p-8 rounded-xl
                shadow-[6px_6px_0px_0px_rgba(81,184,234,1)]">
  <!-- Shadow biru (bukan hitam) — satu-satunya di seluruh proyek -->

  <div class="md:col-span-4 mb-4">
    <h2 class="font-headline-lg text-headline-lg border-b-2 border-on-surface inline-block pb-1">
      Biodiversity Indices
    </h2>
  </div>

  <div class="flex flex-col items-center p-6 border-2 border-on-surface bg-background rounded-xl">
    <span class="font-display-lg text-display-lg text-primary">12</span>
    <span class="font-label-md uppercase font-bold text-center">Endemic Bird Species</span>
  </div>
  <!-- Kolom: 4 Critically Endangered (text-tertiary), 84 Reef Fish, 250+ Documented -->
</section>
```

---

## 11. Admin

**File:** `admin.html`
**Deskripsi:** Dashboard manajemen internal dengan sidebar navigasi, bento stats, tabel akuisisi arsip terbaru, dan panel notifikasi sistem.

### Struktur Layout

```
[Header sticky: logo "Admin - Jawara Obira" + notif + avatar]
[Body: flex row]
  [Sidebar: 20/64px, navigasi + health indicator]
  [Main: stats bento 4-col + tabel + kolom sekunder]
[Footer]
```

### Sidebar

```html
<aside class="w-20 md:w-64 brutalist-border-r bg-background flex flex-col pt-8">
  <nav class="flex flex-col gap-2 px-4">

    <!-- Item aktif: bg primary-container + hard-shadow -->
    <a class="flex items-center gap-4 p-3 brutalist-border bg-primary-container
              text-on-surface hard-shadow-primary font-bold transition-all rounded-xl" href="#">
      <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
        dashboard
      </span>
      <span class="hidden md:block font-label-md text-label-md uppercase tracking-wider">
        Dashboard
      </span>
    </a>

    <!-- Item non-aktif -->
    <a class="flex items-center gap-4 p-3 hover:bg-surface-container-high
              transition-colors group rounded-xl" href="#">
      <span class="material-symbols-outlined group-hover:text-primary transition-colors">
        history_edu
      </span>
      <span class="hidden md:block font-label-md text-label-md text-on-surface-variant
                   group-hover:text-on-surface uppercase">Archives</span>
    </a>

    <!-- Divider -->
    <div class="my-4 border-t-2 border-on-surface-variant opacity-20"></div>

    <!-- Settings -->
    <a class="flex items-center gap-4 p-3 hover:bg-surface-container-high
              transition-colors group rounded-xl" href="#">
      <span class="material-symbols-outlined group-hover:text-primary transition-colors">
        settings
      </span>
      <span class="hidden md:block font-label-md text-label-md text-on-surface-variant
                   group-hover:text-on-surface uppercase">Settings</span>
    </a>
  </nav>

  <!-- Health indicator pojok bawah -->
  <div class="mt-auto p-4 md:p-8">
    <div class="brutalist-border p-4 bg-surface-container-high hidden md:block rounded-xl">
      <p class="font-label-md text-xs text-on-surface-variant uppercase mb-2">System Health</p>
      <div class="w-full bg-surface-dim h-2 brutalist-border overflow-hidden rounded-full">
        <div class="bg-primary-container h-full w-[85%]"></div>
      </div>
      <p class="text-[10px] mt-2 font-bold">STABLE AS OF 08:00 UTC</p>
    </div>
  </div>
</aside>
```

### Bento Stats (4 kolom)

```html
<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-gutter">

  <!-- Setiap stat card: icon besar background opacity 5% -->
  <div class="brutalist-border p-6 bg-surface-container-lowest hard-shadow-primary
              flex flex-col gap-4 relative overflow-hidden group rounded-xl">
    <div class="flex justify-between items-start z-10">
      <span class="material-symbols-outlined text-primary text-4xl"
            style="font-variation-settings: 'FILL' 1;">menu_book</span>
      <span class="text-primary font-bold">+12%</span>
    </div>
    <div class="z-10">
      <h3 class="text-3xl font-display-lg font-bold">1,284</h3>
      <p class="font-label-md text-label-md text-on-surface-variant uppercase tracking-tighter">
        Archived Documents
      </p>
    </div>
    <!-- Icon dekoratif background -->
    <div class="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
      <span class="material-symbols-outlined text-[120px]">history_edu</span>
    </div>
  </div>

  <!-- Repeat untuk: 42 Active Expeditions, 8502 Contributors, 98.9% Data Integrity -->

</div>
```

### Tabel Arsip

```html
<div class="brutalist-border bg-surface overflow-hidden rounded-xl">
  <div class="p-4 bg-surface-container brutalist-border-b flex flex-col sm:flex-row
              justify-between items-center gap-4">
    <h2 class="font-headline-md text-headline-md uppercase">Recent Acquisitions</h2>
    <!-- Search input -->
    <div class="relative w-full sm:w-64">
      <input type="text" placeholder="Search archives..."
             class="w-full brutalist-border bg-background py-1 px-3 text-sm
                    focus:ring-0 focus:border-primary transition-all rounded-xl" />
      <span class="material-symbols-outlined absolute right-3 top-1.5
                   text-on-surface-variant scale-75">search</span>
    </div>
  </div>

  <table class="w-full text-left">
    <thead class="bg-surface-container-high border-b-2 border-on-surface">
      <tr>
        <th class="px-6 py-4 font-label-md text-label-md uppercase">Ref ID</th>
        <th class="px-6 py-4 font-label-md text-label-md uppercase">Subject</th>
        <th class="px-6 py-4 font-label-md text-label-md uppercase">Date</th>
        <th class="px-6 py-4 font-label-md text-label-md uppercase">Status</th>
        <th class="px-6 py-4 font-label-md text-label-md uppercase">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y-2 divide-on-surface-variant/10">
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-6 py-4 font-bold">KKN-442-A</td>
        <td class="px-6 py-4">Maritime Charts of Obira Islands</td>
        <td class="px-6 py-4">Oct 24, 2024</td>
        <td class="px-6 py-4">
          <!-- Status badge: bg-primary-fixed = Verified, bg-tertiary-fixed = Pending,
                             bg-error-container = Flagged -->
          <span class="inline-block px-2 py-1 bg-primary-fixed brutalist-border
                       text-[10px] font-bold uppercase rounded-lg">Verified</span>
        </td>
        <td class="px-6 py-4">
          <button class="text-primary hover:underline font-bold uppercase text-xs">View</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="p-4 bg-surface-container-high text-center">
    <button class="font-label-md text-label-md text-primary uppercase hover:underline">
      View Full Archive Registry
    </button>
  </div>
</div>
```

### JavaScript

```js
// Hard shadow interaktif pada tombol admin
document.querySelectorAll('.hard-shadow-hover').forEach(button => {
  button.addEventListener('mousedown', () => {
    button.style.transform = 'translate(2px, 2px)';
    button.style.boxShadow = '2px 2px 0px 0px rgba(0,0,0,1)';
  });
  button.addEventListener('mouseup', () => {
    button.style.transform = 'translate(-2px, -2px)';
    button.style.boxShadow = '8px 8px 0px 0px rgba(0,0,0,1)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
    button.style.boxShadow = '';
  });
});

// Simulasi pulse data live setiap 5 detik
setInterval(() => {
  const statusBadge = document.querySelector('.bg-primary-container.h-full');
  if (statusBadge) {
    statusBadge.classList.add('opacity-50');
    setTimeout(() => statusBadge.classList.remove('opacity-50'), 200);
  }
}, 5000);
```

---

## 12. Login

**File:** `login.html`
**Deskripsi:** Halaman autentikasi minimalis dengan form terpusat, efek focus pada input, dan status server di footer form.

### CSS Khusus

```css
body {
  background-color: #fef9f2;
  background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
}

/* Gradien biru sangat transparan sebagai overlay body */
.oceanic-gradient {
  background: linear-gradient(135deg,
    rgba(81, 184, 234, 0.1) 0%,
    rgba(0, 102, 137, 0.1) 100%);
}

/* Focus input: border menebal + shadow biru */
.input-focus:focus {
  outline: none;
  border-width: 4px;
  box-shadow: 6px 6px 0px 0px #51b8ea;
}
```

### Form Login

```html
<main class="w-full max-w-md">
  <div class="bg-background border-[3px] border-on-surface hard-shadow overflow-hidden rounded-xl">

    <!-- Header form -->
    <div class="p-8 border-b-[3px] border-on-surface bg-surface-container-high
                relative overflow-hidden">
      <!-- Ikon dekoratif sailing opacity 10% pojok kanan atas -->
      <div class="absolute -right-4 -top-4 opacity-10">
        <span class="material-symbols-outlined text-[120px]">sailing</span>
      </div>
      <h1 class="font-headline-lg text-headline-lg text-on-surface mb-2 relative z-10">
        Login - Jawara Obira
      </h1>
      <p class="font-body-md text-body-md text-on-surface-variant relative z-10">
        Masuk ke arsip digital KKN Hub...
      </p>
    </div>

    <!-- Form -->
    <div class="p-8 space-y-6">
      <form method="POST" action="#" class="space-y-5">

        <!-- Field: Email / Username -->
        <div class="space-y-2">
          <label for="identity"
                 class="block font-label-md text-label-md text-on-surface
                        uppercase tracking-widest">
            Email atau Nama Pengguna
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
              <span class="material-symbols-outlined text-body-md">person</span>
            </span>
            <input type="text" id="identity" name="identity" required
                   placeholder="nama@kampus.ac.id"
                   class="w-full pl-10 pr-4 py-3 bg-surface-container-low
                          border-[2px] border-on-surface font-body-md rounded-xl
                          input-focus transition-all placeholder:text-outline-variant" />
          </div>
        </div>

        <!-- Field: Password -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label for="password"
                   class="block font-label-md text-label-md text-on-surface uppercase tracking-widest">
              Kata Sandi
            </label>
            <a class="font-label-md text-label-md text-primary hover:underline" href="#">
              Lupa Sandi?
            </a>
          </div>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-outline">
              <span class="material-symbols-outlined text-body-md">lock</span>
            </span>
            <input type="password" id="password" name="password" required
                   placeholder="••••••••"
                   class="w-full pl-10 pr-4 py-3 bg-surface-container-low
                          border-[2px] border-on-surface font-body-md rounded-xl
                          input-focus transition-all placeholder:text-outline-variant" />
          </div>
        </div>

        <!-- Checkbox: Remember Me -->
        <div class="flex items-center">
          <input type="checkbox" id="remember" name="remember"
                 class="h-5 w-5 text-primary border-[2px] border-on-surface
                        focus:ring-0 rounded-md bg-surface-container-low" />
          <label for="remember" class="ml-3 font-body-md text-body-md text-on-surface-variant">
            Ingat sesi saya di perangkat ini
          </label>
        </div>

        <!-- Submit -->
        <div class="pt-4">
          <button type="submit"
                  class="w-full py-4 bg-primary-container border-[3px] border-on-surface
                         text-on-surface font-headline-md text-headline-md rounded-xl
                         hard-shadow hard-shadow-hover btn-active transition-all
                         duration-200 flex items-center justify-center gap-3">
            <span class="material-symbols-outlined"
                  style="font-variation-settings: 'FILL' 1;">verified_user</span>
            Secure Login
          </button>
        </div>

      </form>

      <!-- Daftar link -->
      <div class="text-center pt-4 border-t-[2px] border-on-surface border-dotted">
        <p class="font-body-md text-body-md text-on-surface-variant mb-4">
          Belum terdaftar dalam kolektif?
        </p>
        <a class="inline-block px-6 py-2 border-[2px] border-on-surface font-label-md
                  text-label-md rounded-lg hover:bg-surface-container-highest transition-colors"
           href="#">
          DAFTAR SEKARANG
        </a>
      </div>
    </div>

  </div>

  <!-- Status server di bawah card -->
  <div class="mt-8 flex flex-wrap justify-between items-center gap-4 px-2">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-green-500"></span>
      <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-tighter">
        Server: Operasional
      </span>
    </div>
    <div class="flex gap-4">
      <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary" href="#">
        Bantuan
      </a>
      <a class="font-label-md text-label-md text-on-surface-variant hover:text-primary" href="#">
        Privasi
      </a>
    </div>
  </div>
</main>
```

### JavaScript

```js
// Warnai label saat input di-focus
const inputs = document.querySelectorAll('input:not([type="checkbox"])');
inputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.parentElement.querySelector('label').style.color = '#006689';
  });
  input.addEventListener('blur', () => {
    input.parentElement.parentElement.querySelector('label').style.color = '';
  });
});
```

---

## Ringkasan Pola Interaksi Global

| Interaksi | Kelas / Handler | Efek |
|-----------|----------------|------|
| Hover kartu | `group`, `group-hover:` | Warna, skala, shadow |
| Hover gambar | `grayscale group-hover:grayscale-0` | Warna muncul |
| Hover tombol | `hard-shadow-hover` | Geser kiri atas + shadow besar |
| Klik tombol | `press-effect:active` / JS mousedown | Geser kanan bawah |
| Focus input | `.input-focus:focus` | Border tebal + shadow biru |
| Foto scrapbook | `.scrapbook-rotate-left/right` | Miring, hover kembali lurus |
| Animasi marker peta | `animate-bounce`, `animate-pulse` | Bouncing / pulsing |
| Animated dots status | `animate-ping` | Ping/ripple effect |
| Scroll parallax | JS `window.scroll` | Background atau elemen gerak lambat |

---

## Catatan Implementasi

1. **Tailwind CDN** — Semua halaman menggunakan CDN Tailwind dengan konfigurasi inline `tailwind.config`. Tidak ada build step.
2. **Gambar** — Semua `<img>` menggunakan URL eksternal dari `lh3.googleusercontent.com`. Setiap gambar memiliki atribut `data-alt` berisi prompt deskriptif untuk regenerasi gambar jika perlu.
3. **Material Symbols** — Font ikon dari Google, diatur dengan `font-variation-settings` untuk kontrol `FILL`, `wght`, dst.
4. **Responsif** — Semua layout menggunakan grid responsif Tailwind (`grid-cols-1 md:grid-cols-2 lg:grid-cols-12`). Navbar collapse di mobile.
5. **Aksesibilitas** — Label form terhubung ke input melalui `for`/`id`. Placeholder bukan pengganti label. Alt text ada di semua gambar.
6. **Konsistensi** — Palet warna, font, border-width (`3px`), dan spacing (`margin: 32px`, `gutter: 24px`) identik di semua halaman via config Tailwind yang sama.
