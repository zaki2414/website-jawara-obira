"use client";

import { EntitySearchForm } from "@/components/shared/EntitySearchForm";
import {
  faunaFormVariants,
  FAUNA_CLASSES,
  FAUNA_CONTENT,
  FAUNA_ICONS,
} from "@/constants/fauna";

type FaunaFilterBarProps = {
  initialQ?: string;
  initialClass?: string;
};

export function FaunaFilterBar({ initialQ, initialClass }: FaunaFilterBarProps) {
  return (
    <EntitySearchForm
      variants={faunaFormVariants}
      initialQ={initialQ}
      initialFilter={initialClass}
      filterName="class"
      filterOptions={FAUNA_CLASSES}
      searchPlaceholder={FAUNA_CONTENT.searchPlaceholder}
      filterLabel={FAUNA_CONTENT.filterLabel}
      SearchIcon={FAUNA_ICONS.Search}
      FilterIcon={FAUNA_ICONS.Filter}
    />
  );
}
