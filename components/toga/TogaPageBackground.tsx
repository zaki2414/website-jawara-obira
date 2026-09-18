import { PageOrnament, PaperTexture } from "@/components/shared/PageOrnament";

/** Identitas ornamen halaman TOGA — motif 3, menggantung di tepi kanan bawah. */
export function TogaPageBackground() {
  return (
    <>
      <PaperTexture opacity={0.045} />
      <PageOrnament motif={3} placement="top-right" size="xl" opacity={0.06} marks={3} counterMotif={1} />
    </>
  );
}
