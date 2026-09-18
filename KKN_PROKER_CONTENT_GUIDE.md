# Panduan Isi Kolom `kkn_prokers`

Dokumen ini ada karena 24 entri proker pertama diisi manual lewat SQL tanpa
panduan, dan hasilnya persis apa yang dokumen ini coba cegah: fakta yang
sama (waktu, lokasi, siapa yang mengerjakan, angka pencapaian) ditulis
ulang di 2–3 kolom berbeda, dan dua di antaranya (`documentation`,
`impact_metrics` versi lama) bahkan tidak pernah tampil ke publik sama
sekali karena bentuknya tidak cocok dengan yang dibaca kode.

**Aturan paling penting: satu fakta, satu kolom.** Kalau sebuah fakta
(tanggal, nama pelaksana, sebuah angka) sudah disebut di satu kolom,
jangan tulis ulang di kolom lain "supaya lengkap" — pembaca cuma pernah
melihat SATU kolom itu pada satu waktu, menulis ulang di tempat lain hanya
menambah kerja isi data tanpa menambah apa yang benar-benar terbaca.

Sebelum mengisi/generate entri baru untuk tabel ini (lewat SQL manual atau
form admin), ikuti panduan per kolom di bawah.

## Kolom yang tampil ke publik

| Kolom | Tipe | Untuk apa | Isi seperti apa |
|---|---|---|---|
| `title` | text | Judul | Judul proker apa adanya. |
| `slug` | text | URL | `generate-slug-dari-title`, huruf kecil, dash. |
| `short_description` | text | Lead 1 kalimat, juga jadi meta description | SATU kalimat ringkas — bukan ringkasan `narrative`, bukan tempat menyebut angka (itu tugas `impact_metrics`). |
| `narrative` | text (HTML dari rich text editor) | Isi utama — "Deskripsi Program Kerja" | Cerita lengkap: masalah sebelum program → apa yang dilakukan → siapa yang terlibat → hasil. Boleh & wajar menyebut waktu/lokasi/nama di sini secara naratif — itu memang bagian dari cerita, bukan duplikasi, karena TIDAK ADA kolom lain yang menyimpan cerita ini. |
| `results` | text | "Hasil Realisasi Lapangan" | Ringkasan hasil/dampak dalam bentuk paragraf. Boleh menyebut angka besar sebagai bagian kalimat, tapi kalau sebuah angka layak ditonjolkan sebagai KPI, taruh juga (atau taruh SAJA) di `impact_metrics` — jangan sekadar menyalin daftar `impact_metrics` jadi kalimat satu-satu. |
| `impact_metrics` | jsonb — array `{label, value}` | Kartu KPI di sidebar publik, SATU-SATUNYA tempat angka pencapaian tampil terstruktur | Array bebas panjangnya, tiap elemen `{"label": "Total Partisipan", "value": "500"}`. Label singkat (2–4 kata), value singkat (angka atau angka+satuan pendek: "500", "16 tim", "380 bibit"). Jangan taruh lokasi/tanggal di sini — itu tugas `pemilik`/`waktu` atau narasi. **Bentuk lama** (objek bebas `{"jumlah_peserta": 10, "lokasi": "..."}`) sudah tidak dipakai — form admin masih bisa MEMBACA bentuk lama demi kompatibilitas saat mengedit entri lawas, tapi entri baru wajib pakai bentuk array ini. |
| `pemilik` | text | Byline — "Digagas oleh {pemilik}" di hero | Nama anak tim KKN yang menggagas/menjalankan proker ini, boleh + program studi dalam kurung (format yang sudah dipakai di data lama: `"Nama Lengkap (Program Studi)"`). Satu proker = satu pemilik (kalau proker gabungan banyak orang seperti festival, boleh dikosongkan atau isi nama koordinator/tim). |
| `waktu` | text | Byline — bagian kedua "· {waktu}" di hero | Kapan dilaksanakan, bebas format teks ("2 Juli 2026", "26–31 Juli 2026", "3, 10, 17, dan 24 Juli 2026") — SENGAJA text bukan date, karena banyak proker rentang/berulang. Jangan taruh lagi di `impact_metrics` atau diulang di `narrative` sebagai satu-satunya penyebutan tanggal (di narasi boleh disebut sebagai bagian cerita, tapi `waktu` yang jadi rujukan pasti/terstruktur). |
| `image_url` | text | Foto cover hero | URL Cloudinary hasil upload lewat form admin. |
| `documentation` | jsonb — array `{url, caption}` | Galeri foto pendukung | HANYA foto (`url` wajib, `caption` opsional). BUKAN tempat menyimpan info acara (waktu/lokasi/pelaksana/pihak terlibat) — itu semua tugas `pemilik`/`waktu`/`narrative`. Kalau tidak ada foto tambahan, biarkan `null`, jangan diisi objek metadata. |
| `village_id` | uuid, nullable | Badge "Wilayah Tugas" di hero | FK ke `villages`. `null` untuk proker gabungan lintas-desa (mis. festival). |
| `published` | boolean | Tampil/tidak di publik | `true` kalau siap tayang. |
| `featured` | boolean | Sorotan di seksi "Program Kerja" beranda `/kkn` | Dicentang lewat form admin ("Tampilkan di Beranda KKN"), bukan diisi manual saat insert. Beranda menampilkan 4 proker, diurutkan `featured desc, created_at desc` — yang dicentang selalu naik lebih dulu, sisanya diisi proker terbaru. **Jangan mengandalkan `created_at` untuk mengatur urutan beranda:** 22 dari 23 baris punya `created_at` identik dari satu kali insert massal, jadi urutannya ditentukan Postgres, bukan admin. |

## Kolom yang SUDAH TIDAK DIPAKAI

- **`key_achievements`** — dihapus dari kode (tidak ada lagi yang membacanya).
  Dulu isinya daftar kalimat yang hampir selalu cuma menulis ulang angka
  yang sama dari `impact_metrics` sebagai kalimat, dan section publiknya
  sendiri sudah dicabut. **Jangan isi kolom ini lagi** untuk entri baru —
  kalau sebuah pencapaian punya angka, itu masuk `impact_metrics`; kalau
  murni kualitatif tanpa angka, itu masuk kalimat di `results` atau
  `narrative`.

## Checklist cepat sebelum insert/generate entri baru

1. Fakta waktu/pelaksana ditulis SEKALI di `pemilik`/`waktu` (+ boleh
   disebut ulang secara naratif di `narrative`, itu bukan kolom terstruktur
   jadi tidak terhitung duplikasi).
2. Angka pencapaian masuk `impact_metrics` sebagai array `{label, value}`,
   BUKAN sebagai objek bebas, BUKAN diulang lagi di `key_achievements`
   (kolom itu sudah mati).
3. `documentation` cuma diisi kalau memang ada URL foto sungguhan.
4. `results` menceritakan hasil dalam kalimat, bukan daftar ulang
   `impact_metrics`.
