# 🌴 Jawara Obira

**Portal Informasi Digital Desa Kawasi & Soligi, Pulau Obi**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)

> 🚧 **Proyek KKN UGM** — Dikembangkan oleh tim Kuliah Kerja Nyata tim Jawara Obira di Pulau Obi sebagai bentuk pengabdian masyarakat melalui digitalisasi informasi desa.

---

## 📖 Tentang Proyek

Website ini adalah platform web modern yang dirancang untuk mendigitalisasi dan mempublikasikan informasi dari dua desa di Pulau Obi, yaitu **Desa Kawasi** dan **Desa Soligi**. Platform ini menyajikan berbagai konten mulai dari profil desa, berita terkini, kekayaan budaya, potensi UMKM, keanekaragaman hayati (TOGA & Fauna), hingga dokumentasi kegiatan KKN.

### ✨ Fitur Unggulan

- 🗺️ **Peta Interaktif SVG** — Jelajahi wilayah Kawasi & Soligi dengan animasi GSAP yang smooth
- 📰 **Portal Berita** — Informasi terkini dengan layout majalah elegan dan gambar rotasi 3D
- 🎭 **Artikel Budaya** — Dokumentasi tradisi, kuliner, kearifan bahari, dan seni lokal
- 🏪 **Direktori UMKM** — Showcase produk lokal dengan kategori, galeri, dan highlight fitur
- 🌿 **Ensiklopedia TOGA** — Database tanaman obat keluarga beserta resep tradisional
- 🦜 **Fauna Obi** — Katalog keanekaragaman hayati dengan status konservasi IUCN
- 🎓 **Portal KKN** — Jurnal harian (calendar view), program kerja, dan profil tim
- 🔐 **Admin Panel** — Dashboard CMS lengkap untuk pengelolaan konten
- 📱 **Fully Responsive** — Tampilan optimal di desktop, tablet, dan mobile

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) + Turbopack |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom Theme (ocean, sand, tropic) |
| **Database & Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **Animation** | GSAP (GreenSock Animation Platform) |
| **Rich Text** | Custom Rich Text Editor |
| **Image Handling** | Next.js Image + Supabase Storage |

---

## 📁 Struktur Proyek

```
website-jawara-obira/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx                 # Homepage
│   │   ├── profil/                  # Profil desa + peta interaktif
│   │   ├── berita/                  # Daftar & detail berita
│   │   ├── budaya/                  # Artikel budaya
│   │   ├── umkm/                    # Direktori UMKM
│   │   ├── toga/                    # Tanaman obat
│   │   ├── fauna-obi/               # Keanekaragaman hayati
│   │   ├── galeri/                  # Galeri foto
│   │   ├── peta/                    # Peta lokasi
│   │   ├── kkn/                     # Portal KKN
│   │   │   ├── tim/                 # Anggota tim
│   │   │   ├── jurnal/              # Jurnal harian (calendar view)
│   │   │   └── proker/              # Program kerja
│   │   └── login/                   # Halaman login
│   │
│   ├── admin/                       # Dashboard admin
│   │   ├── berita/[id]/
│   │   ├── budaya/[id]/
│   │   ├── umkm/[id]/
│   │   ├── toga/[id]/
│   │   ├── fauna-obi/[id]/
│   │   └── kkn/
│   │       ├── tim/[id]/
│   │       ├── jurnal/[id]/
│   │       └── proker/[id]/
│   │
│   ├── api/                         # API Routes
│   │   ├── auth/                    # Login, logout, OAuth callback
│   │   └── toga/plants/             # Endpoint TOGA
│   │
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles
│   ├── loading.tsx                  # Loading skeleton
│   └── not-found.tsx                # 404 page
│
├── components/
│   ├── admin/                       # Admin form components
│   │   ├── NewsForm.tsx
│   │   ├── CultureForm.tsx
│   │   ├── UMKMForm.tsx
│   │   ├── TogaPlantForm.tsx
│   │   ├── FaunaForm.tsx
│   │   ├── KKNTeamForm.tsx
│   │   ├── KKNJournalForm.tsx
│   │   ├── KKNProkerForm.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── ExtraImageUploader.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── DeleteButton.tsx
│   └── InteractiveMap.tsx           # Peta SVG interaktif (GSAP)
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                # Server client (cookies-based)
│   │   ├── client.ts                # Browser client
│   │   └── queries.ts               # 🎯 Centralized queries
│   ├── auth.ts                      # Auth utilities
│   └── utils.ts                     # Helper functions
│
└── public/                          # Static assets
```

---

## 🗄️ Database Schema

Proyek ini menggunakan **Supabase** dengan entitas utama:

| Tabel | Deskripsi |
|-------|-----------|
| `villages` | Data desa (Kawasi, Soligi) + statistik |
| `news` | Artikel berita |
| `culture_articles` | Artikel budaya & tradisi |
| `umkm` + `umkm_gallery`, `umkm_features`, `umkm_products` | Data UMKM dengan relasi kompleks |
| `toga_plants` | Tanaman obat keluarga (dengan JSONB recipes) |
| `fauna_obi` | Data fauna dengan status IUCN (JSONB documentations) |
| `kkn_members` | Anggota tim KKN |
| `kkn_journals` + `kkn_journal_images` | Jurnal harian KKN |
| `kkn_prokers` | Program kerja KKN |

---

## 🚀 Getting Started

### Prasyarat

- **Node.js** 18+ (direkomendasikan 20+)
- **npm** / **yarn** / **pnpm**
- Akun **Supabase** (untuk database & storage)

### Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/website-jawara-obira.git
   cd website-jawara-obira
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**

   Buat file `.env.local` di root folder:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Setup database**

   Jalankan SQL schema dari Supabase Dashboard → SQL Editor, atau gunakan file migrasi yang tersedia.

5. **Jalankan development server**
   ```bash
   npm run dev
   # atau dengan Turbopack
   npm run dev --turbopack
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build untuk Production

```bash
npm run build
npm start
```

---

## 🎨 Design System

Proyek ini menggunakan custom color palette yang terinspirasi dari keindahan alam Pulau Obi:

| Color | Hex | Penggunaan |
|-------|-----|------------|
| 🌊 **Ocean** | `#0284c7` | Primary color, CTA, links |
| 🏖️ **Sand** | `#f5f0e6` | Background, cards |
| 🌴 **Tropic** | `#16a34a` | Accent, highlights, nature |

Font menggunakan kombinasi **Serif** untuk heading (nuansa klasik) dan **Sans-serif** untuk body text (modern & readable).

---

## 🔐 Akses Admin

- **URL Login**: `/login`
- **Dashboard**: `/admin`
- Autentikasi menggunakan **Supabase Auth** dengan Role-Based Access Control (RBAC)

---

## 📦 Deployment

Proyek ini siap di-deploy ke platform berikut:

### Vercel (Direkomendasikan)
```bash
npm i -g vercel
vercel
```

### Alternatif
- Netlify
- Railway
- Self-hosted (VPS)

Jangan lupa untuk menambahkan environment variables di platform deployment yang kamu pilih.

---

## 🤝 Contributing

Proyek ini dikembangkan sebagai bagian dari program KKN UGM. Kontribusi dari masyarakat sangat dihargai!

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📄 License

Distributed under the **MIT License**.

---

## 🙏 Acknowledgments

- **Universitas Gadjah Mada (UGM)** — Program KKN yang memungkinkan proyek ini terwujud
- **Pemerintah Desa Kawasi & Soligi** — Atas dukungan dan data yang diberikan
- **Masyarakat Pulau Obi** — Sumber inspirasi dan keberkahan proyek ini
- **Supabase, Next.js, Tailwind CSS, GSAP** — Teknologi luar biasa di balik layar

---

<div align="center">

**Dibuat dengan ❤️ di Pulau Obi untuk Masyarakat Obi**

🌴 *Jawara Obira — Menjaga Tradisi, Membangun Digital* 🌊

</div>
