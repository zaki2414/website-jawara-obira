"use client";

import { EntityEmptyState } from "@/components/shared/EntityEmptyState";
import { TOGA_CONTENT, TOGA_ICONS } from "@/constants/toga";

export function TogaEmptyState() {
  return (
    <EntityEmptyState
      icon={TOGA_ICONS.Sprout}
      title={TOGA_CONTENT.emptyTitle}
      description={TOGA_CONTENT.emptyDescription}
      suggestion={TOGA_CONTENT.emptySuggestion}
    />
  );
}
