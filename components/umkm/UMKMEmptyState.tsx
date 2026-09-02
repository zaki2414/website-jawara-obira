"use client";

import { EntityEmptyState } from "@/components/shared/EntityEmptyState";
import { UMKM_CONTENT, UMKM_ICONS } from "@/constants/umkm";

export function UMKMEmptyState() {
  return (
    <EntityEmptyState
      icon={UMKM_ICONS.Store}
      title={UMKM_CONTENT.emptyTitle}
      description={UMKM_CONTENT.emptyDescription}
      suggestion={UMKM_CONTENT.emptySuggestion}
    />
  );
}
