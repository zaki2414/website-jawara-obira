import { PageOrnament, PaperTexture } from "@/components/shared/PageOrnament";

/** Identitas ornamen halaman Budaya — motif 5, tepi kanan bawah. */
export function BrandIdentityBackground() {
  return (
    <>
      <PaperTexture opacity={0.045} />
      <PageOrnament motif={5} placement="top-right" size="xl" opacity={0.06} marks={3} counterMotif={2} />
    </>
  );
}
