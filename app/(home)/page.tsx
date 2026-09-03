import {
  getAllVillages,
  getUMKMCount,
  getPublishedKKNJournalCount,
  getFeaturedKKNProkers,
} from "@/lib/supabase/queries";
import { APPROX_POPULATION, type HomeStats, type Village, type Proker } from "@/constants/home";
import { HeroSection, StatsSection, PotensiBento, KKNSection, HomeFadeIn } from "@/components/home";

// Halaman dengan traffic tertinggi di situs — revalidate 1 jam (pola sama
// dengan app/profil/page.tsx) supaya tidak query Supabase di setiap request,
// stats (jumlah proker/jurnal/umkm) toleran terhadap data yang telat sejam.
export const revalidate = 3600;

export default async function HomePage() {
  const [{ data: villagesData }, { count: umkmCount }, { count: journalCount }, { data: prokersData, count: prokerCount }] =
    await Promise.all([
      getAllVillages(),
      getUMKMCount(),
      getPublishedKKNJournalCount(),
      getFeaturedKKNProkers(3),
    ]);

  const villages = (villagesData ?? []) as Village[];
  const stats: HomeStats = {
    desa: villages.length,
    penduduk: APPROX_POPULATION,
    proker: prokerCount,
    umkm: umkmCount,
  };
  const featuredProkers = (prokersData ?? []) as Proker[];
  const kknStats = { jurnal: journalCount, proker: prokerCount };

  return (
    <HomeFadeIn>
      <HeroSection villages={villages} />
      <StatsSection stats={stats} />
      <PotensiBento />
      <KKNSection kknStats={kknStats} featuredProkers={featuredProkers} />
    </HomeFadeIn>
  );
}
