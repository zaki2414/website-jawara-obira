// constants/domainAccent.ts
//
// SATU SUMBER KEBENARAN WARNA PER-DOMAIN PUBLIK.
//
// Sebelum ini tiap halaman listing memilih warnanya sendiri di dalam JSX, dan
// hasilnya dua masalah:
//
// 1. Warnanya tidak berhubungan dengan isinya. Halaman Tanaman Obat memakai
//    emas, warna yang tidak mengatakan apa pun tentang tumbuhan, hanya karena
//    emas kebetulan ada di palet.
// 2. Latarnya memakai gradien wash (`from-primary/10 via-background`) — biru
//    dingin beralpha rendah DI ATAS kertas hangat #fef9f2 menghasilkan abu
//    keruh, bukan warna. Gradien lembut juga bertentangan dengan dunia
//    neobrutalist yang justru dibangun dari bidang warna rata bertepi keras.
//
// Aturan sistem ini: warna datang dari BIDANG yang tegas (band/panel), bukan
// dari kabut gradien; dan tiap domain dapat rona yang memang berhubungan
// dengan subjeknya.

export type DomainKey =
  | "budaya"
  | "umkm"
  | "fauna"
  | "toga"
  | "galeri"
  | "kkn"
  | "profil";

export type DomainAccent = {
  /** Bidang warna penuh di belakang header halaman. */
  band: string;
  /** Teks di atas `band`. Sudah dipasangkan agar kontras ≥4.5:1. */
  onBand: string;
  /** Panel judul di dalam band (kartu kertas / kartu warna). */
  panel: string;
  /** Panel pendamping (statistik / ringkasan) — kontras dengan `panel`. */
  panelAlt: string;
  /** Teks di atas `panelAlt`. */
  onPanelAlt: string;
  /** Warna aksen yang tetap terbaca di atas kertas (bg-background). */
  accentText: string;
  /** Border solid beraksen untuk kartu/bingkai. */
  border: string;
  /** Chip/badge kecil beraksen. */
  chip: string;
};

// Pemetaan rona → subjek. Alasannya ditulis supaya penetapan berikutnya
// tidak jadi tebak-tebakan.
export const DOMAIN_ACCENT: Record<DomainKey, DomainAccent> = {
  // Emas upacara/kuningan — tradisi, ritus, kesenian.
  budaya: {
    band: "bg-tertiary",
    onBand: "text-on-tertiary",
    panel: "bg-cream",
    panelAlt: "bg-primary",
    onPanelAlt: "text-on-primary",
    accentText: "text-on-tertiary",
    border: "border-on-surface",
    chip: "bg-tertiary text-on-tertiary",
  },
  // Teal niaga + deret statistik tiga warna (teal/emas/krem). Sengaja TIDAK
  // diubah ke krem: susunan yang ada sudah bekerja — panel judul kertas di
  // atas bidang teal, lalu tiga blok statistik yang justru jadi tempat
  // krem & emas muncul. Memindahkan seluruh band ke krem akan menghapus
  // kontras itu, bukan menambah.
  umkm: {
    band: "bg-primary",
    onBand: "text-on-primary",
    panel: "bg-background",
    panelAlt: "bg-tertiary",
    onPanelAlt: "text-on-tertiary",
    accentText: "text-primary",
    border: "border-on-surface",
    chip: "bg-primary text-on-primary",
  },
  // Teal laut-dalam — satwa endemik pesisir & hutan Obi.
  fauna: {
    band: "bg-primary",
    onBand: "text-on-primary",
    panel: "bg-background",
    panelAlt: "bg-tertiary",
    onPanelAlt: "text-on-tertiary",
    accentText: "text-primary",
    border: "border-primary",
    chip: "bg-primary text-on-primary",
  },
  // Hijau herbal — satu-satunya domain yang subjeknya benar-benar tumbuhan.
  toga: {
    band: "bg-herbal",
    onBand: "text-on-herbal",
    panel: "bg-herbal-container",
    panelAlt: "bg-background",
    onPanelAlt: "text-on-surface",
    accentText: "text-herbal",
    border: "border-herbal",
    chip: "bg-herbal text-on-herbal",
  },
  // Tinta gelap — galeri foto: chrome-nya mundur, fotonya yang berwarna.
  galeri: {
    band: "bg-on-surface",
    onBand: "text-background",
    panel: "bg-background",
    panelAlt: "bg-tertiary",
    onPanelAlt: "text-on-tertiary",
    accentText: "text-on-surface",
    border: "border-on-surface",
    chip: "bg-on-surface text-background",
  },
  // Teal institusional — konsisten dengan sistem KKN yang sudah berjalan.
  kkn: {
    band: "bg-primary",
    onBand: "text-on-primary",
    panel: "bg-background",
    panelAlt: "bg-tertiary",
    onPanelAlt: "text-on-tertiary",
    accentText: "text-primary",
    border: "border-primary",
    chip: "bg-primary text-on-primary",
  },
  // Krem arsip — dokumen profil desa.
  profil: {
    band: "bg-cream-container",
    onBand: "text-on-surface",
    panel: "bg-background",
    panelAlt: "bg-primary",
    onPanelAlt: "text-on-primary",
    accentText: "text-on-cream",
    border: "border-on-surface",
    chip: "bg-cream text-on-surface",
  },
};
