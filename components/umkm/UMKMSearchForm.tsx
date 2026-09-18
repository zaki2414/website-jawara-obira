"use client";

import { PageFilterBar } from "@/components/shared/PageFilterBar";
import { UMKM_BUSINESS_TYPES, UMKM_CONTENT } from "@/constants/umkm";

type UMKMSearchFormProps = {
  initialQ?: string;
  initialType?: string;
};

export function UMKMSearchForm({ initialQ, initialType }: UMKMSearchFormProps) {
  return (
    <PageFilterBar
      accent="umkm"
      search={{
        name: "q",
        placeholder: UMKM_CONTENT.searchPlaceholder,
        defaultValue: initialQ,
      }}
      select={{
        name: "type",
        label: "Jenis usaha",
        options: UMKM_BUSINESS_TYPES.map((t) => ({ value: t.value, label: t.label })),
        defaultValue: initialType,
      }}
      submitLabel={UMKM_CONTENT.filterLabel}
    />
  );
}
