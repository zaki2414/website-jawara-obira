"use client";

import { EntitySearchForm } from "@/components/shared/EntitySearchForm";
import {
  umkmFormVariants,
  UMKM_BUSINESS_TYPES,
  UMKM_CONTENT,
  UMKM_ICONS,
} from "@/constants/umkm";

type UMKMSearchFormProps = {
  initialQ?: string;
  initialType?: string;
};

export function UMKMSearchForm({ initialQ, initialType }: UMKMSearchFormProps) {
  return (
    <EntitySearchForm
      variants={umkmFormVariants}
      initialQ={initialQ}
      initialFilter={initialType}
      filterName="type"
      filterOptions={UMKM_BUSINESS_TYPES}
      searchPlaceholder={UMKM_CONTENT.searchPlaceholder}
      filterLabel={UMKM_CONTENT.filterLabel}
      SearchIcon={UMKM_ICONS.Search}
      FilterIcon={UMKM_ICONS.Filter}
    />
  );
}
