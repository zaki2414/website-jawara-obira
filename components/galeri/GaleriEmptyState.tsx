"use client";

import { EntityEmptyState } from "@/components/shared/EntityEmptyState";
import { GALERI_CONTENT, GALERI_ICONS } from "@/constants/galeri";

export function GaleriEmptyState() {
  return (
    <EntityEmptyState
      icon={GALERI_ICONS.Camera}
      title={GALERI_CONTENT.emptyTitle}
      description={GALERI_CONTENT.emptyDescription}
      suggestion={GALERI_CONTENT.emptySuggestion}
    />
  );
}
