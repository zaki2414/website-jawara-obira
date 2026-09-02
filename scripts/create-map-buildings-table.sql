-- Tabel map_buildings — override BLOK/No Rumah untuk poligon rumah warga
-- (public/data/bangunan*.geojson), dikelola dari /admin/peta lewat panel
-- detail "Rumah Warga" di peta.
--
-- BEDA dari map_facilities (14 baris, pre-seeded, update-only): bangunan ada
-- ratusan per desa (264+ untuk Kawasi saja) dan KEBANYAKAN tidak pernah
-- diedit admin — jadi baris di sini TIDAK pre-seeded, cuma dibuat ad-hoc
-- (upsert) saat admin pertama kali mengisi/mengoreksi data satu rumah.
-- feature_id sudah dinamespace per-desa sejak convert-shp.mjs
-- ("bangunan-N" utk Kawasi, "bangunan-soligi-N" utk Soligi), jadi aman
-- dipakai sebagai kunci unik lintas kedua desa tanpa kolom "village" terpisah.
--
-- Jalankan file ini sekali di Supabase SQL Editor sebelum tombol "Edit" di
-- panel "Rumah Warga" bisa dipakai.

create table if not exists map_buildings (
  id uuid primary key default gen_random_uuid(),
  feature_id text not null unique,
  blok text,
  no_rumah integer,
  updated_at timestamptz not null default now()
);

alter table map_buildings enable row level security;

-- Baca publik (dipakai /profil MAUPUN /admin/peta untuk menampilkan override
-- di panel detail rumah), sama seperti pola map_facilities.
create policy "map_buildings_public_read"
  on map_buildings for select
  using (true);

-- Tulis (insert/update via upsert) hanya untuk user yang sudah login —
-- sesuaikan kondisi ini kalau proyek pakai skema role admin yang berbeda
-- dari sekadar "authenticated".
create policy "map_buildings_admin_write"
  on map_buildings for insert
  to authenticated
  with check (true);

create policy "map_buildings_admin_update"
  on map_buildings for update
  to authenticated
  using (true)
  with check (true);
