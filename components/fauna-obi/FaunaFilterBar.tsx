"use client";

import { PageFilterBar } from "@/components/shared/PageFilterBar";
import { FAUNA_CLASSES, FAUNA_CONTENT } from "@/constants/fauna";

type FaunaFilterBarProps = {
  initialQ?: string;
  initialClass?: string;
};

export function FaunaFilterBar({ initialQ, initialClass }: FaunaFilterBarProps) {
  return (
    <PageFilterBar
      accent="fauna"
      search={{
        name: "q",
        placeholder: FAUNA_CONTENT.searchPlaceholder,
        defaultValue: initialQ,
      }}
      select={{
        name: "class",
        label: "Kelas satwa",
        // Label saja, tanpa emoji: emoji dirender berbeda-beda per sistem
        // operasi dan tidak bisa diikat ke palet.
        options: FAUNA_CLASSES.map((c) => ({ value: c.value, label: c.label })),
        defaultValue: initialClass,
      }}
      submitLabel={FAUNA_CONTENT.filterLabel}
    />
  );
}
