import { PageOrnament, PaperTexture } from "@/components/shared/PageOrnament";

/** Identitas ornamen halaman Fauna — motif 2, tepi kanan tengah. */
export function FaunaPageBackground() {
  return (
    <>
      <PaperTexture opacity={0.045} />
      <PageOrnament motif={2} placement="top-right" size="xl" opacity={0.06} marks={3} counterMotif={5} />
    </>
  );
}
