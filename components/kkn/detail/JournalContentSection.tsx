"use client";

import { motion } from "framer-motion";

type JournalContentSectionProps = {
  html: string;
  border: string;
};

export function JournalContentSection({ html, border }: JournalContentSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`bg-background p-6 md:p-8 border-4 ${border} rounded-2xl hard-shadow-lg`}
    >
      <div
        className="prose prose-neutral max-w-none text-on-surface font-sans font-medium leading-relaxed prose-headings:font-serif prose-headings:font-black prose-strong:font-black whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.section>
  );
}
