"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type ProseContentProps = {
  content: string;
};

export function ProseContent({ content }: ProseContentProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className="prose prose-lg max-w-none font-sans text-on-surface-variant leading-relaxed
                 prose-headings:font-serif prose-headings:font-bold prose-headings:text-on-surface
                 prose-p:mb-6 prose-strong:text-on-surface prose-strong:font-bold
                 prose-a:text-primary prose-a:underline hover:prose-a:text-primary-container"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}