"use client";

import { motion } from "framer-motion";
import { Target, CheckSquare } from "lucide-react";

// Referensi komponen ikon (Target/CheckSquare) tidak bisa dikirim dari Server
// Component (page.tsx) ke Client Component ini — React hanya bisa serialize
// data polos lewat batas server/client. Jadi cukup kirim key string, resolve
// komponennya di sini, di dalam file "use client" ini sendiri.
const ICONS = { target: Target, "check-square": CheckSquare } as const;

type ProkerRichTextSectionProps = {
  icon: keyof typeof ICONS;
  iconChip: string;
  border: string;
  title: string;
  html: string;
  delay?: number;
};

export function ProkerRichTextSection({ icon, iconChip, border, title, html, delay = 0 }: ProkerRichTextSectionProps) {
  const Icon = ICONS[icon];
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
      className={`space-y-3 bg-background p-6 border-4 ${border} rounded-2xl hard-shadow-lg`}
    >
      <h3 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
        <span className={`p-1.5 rounded-lg shrink-0 ${iconChip}`}>
          <Icon className="w-5 h-5" />
        </span>
        {title}
      </h3>
      <div
        className="prose prose-neutral max-w-none text-on-surface-variant font-sans font-medium text-sm md:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.section>
  );
}
