import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/supabase/queries";
import { getSiteUrl } from "@/lib/siteUrl";

// Sitemap dibangun ulang sejam sekali, sama dengan revalidate halaman publik —
// tidak ada gunanya lebih sering, dan ini menjaga agar crawler tidak memicu
// query DB di setiap kunjungan.
export const revalidate = 3600;

// Halaman statis + prioritasnya. Beranda paling tinggi, lalu halaman indeks
// tiap domain; halaman detail di bawahnya (lihat di bawah).
const STATIC_PATHS: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/profil", priority: 0.8 },
  { path: "/budaya", priority: 0.8 },
  { path: "/umkm", priority: 0.8 },
  { path: "/toga", priority: 0.8 },
  { path: "/fauna-obi", priority: 0.8 },
  { path: "/galeri", priority: 0.7 },
  { path: "/kkn", priority: 0.8 },
  { path: "/kkn/proker", priority: 0.7 },
  { path: "/kkn/jurnal", priority: 0.7 },
  { path: "/kkn/tim", priority: 0.6 },
];

function toDate(value: string | null): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const { budaya, umkm, toga, fauna, proker, jurnal } = await getSitemapEntries();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));

  const detail = (
    prefix: string,
    rows: Array<{ slug: string; lastModified: string | null }>,
  ): MetadataRoute.Sitemap =>
    rows.map((row) => ({
      url: `${base}${prefix}/${row.slug}`,
      lastModified: toDate(row.lastModified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    ...staticEntries,
    ...detail("/budaya", budaya),
    ...detail("/umkm", umkm),
    ...detail("/toga", toga),
    ...detail("/fauna-obi", fauna),
    ...detail("/kkn/proker", proker),
    ...detail("/kkn/jurnal", jurnal),
  ];
}
