"use client";

import { PageFilterBar } from "@/components/shared/PageFilterBar";
import { TOGA_CONTENT } from "@/constants/toga";

type TogaFilterBarProps = {
  initialQ?: string;
};

/** TOGA hanya punya pencarian — tidak ada taksonomi yang bisa disaring
 *  (kolom category & family di tabelnya kosong seluruhnya). */
export function TogaFilterBar({ initialQ }: TogaFilterBarProps) {
  return (
    <PageFilterBar
      accent="toga"
      search={{
        name: "q",
        placeholder: TOGA_CONTENT.searchPlaceholder,
        defaultValue: initialQ,
      }}
      submitLabel={TOGA_CONTENT.searchLabel}
    />
  );
}
