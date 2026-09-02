"use client";

import { EntitySearchForm } from "@/components/shared/EntitySearchForm";
import { togaFormVariants, TOGA_CONTENT, TOGA_ICONS } from "@/constants/toga";

type TogaFilterBarProps = {
  initialQ?: string;
};

export function TogaFilterBar({ initialQ }: TogaFilterBarProps) {
  return (
    <EntitySearchForm
      variants={togaFormVariants}
      initialQ={initialQ}
      searchPlaceholder={TOGA_CONTENT.searchPlaceholder}
      filterLabel={TOGA_CONTENT.searchLabel}
      SearchIcon={TOGA_ICONS.Search}
    />
  );
}
