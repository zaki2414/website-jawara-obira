import { PageOrnament, PaperTexture } from "@/components/shared/PageOrnament";

type BackgroundOrnamentsProps = {
  variant?: "default" | "minimal" | "minimal-alt";
};

/**
 * Dulu komponen ini menggambar EMPAT ornamen berputar sekaligus (opacity
 * 0.16–0.30) lewat framer-motion. Sekarang ia hanya memilih motif & sudut,
 * lalu menyerahkan penggambarannya ke PageOrnament — lihat catatan lengkap
 * soal alasannya di components/shared/PageOrnament.tsx.
 */
export function BackgroundOrnaments({ variant = "default" }: BackgroundOrnamentsProps) {
  if (variant === "minimal-alt") {
    return (
      <>
        <PaperTexture opacity={0.04} />
        <PageOrnament motif={3} placement="top-right" size="lg" marks={2} counterMotif={1} />
      </>
    );
  }
  if (variant === "minimal") {
    return (
      <>
        <PaperTexture opacity={0.04} />
        <PageOrnament motif={5} placement="top-right" size="lg" marks={2} counterMotif={2} />
      </>
    );
  }
  return (
    <>
      <PaperTexture opacity={0.05} />
      <PageOrnament motif={2} placement="top-left" size="xl" marks={3} counterMotif={4} />
    </>
  );
}
