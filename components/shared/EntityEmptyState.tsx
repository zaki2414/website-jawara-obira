"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { LucideIcon } from "lucide-react";

type EntityEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  suggestion: string;
};

export function EntityEmptyState({ icon: Icon, title, description, suggestion }: EntityEmptyStateProps) {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className="text-center bg-background border-2 border-dashed border-outline rounded-2xl py-24 max-w-lg mx-auto hard-shadow-sm"
    >
      <motion.div
        className="inline-block mb-6"
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Icon className="w-16 h-16 text-on-surface-variant opacity-30" />
      </motion.div>

      <motion.p
        className="font-serif text-2xl font-black text-on-surface mb-3"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.p>

      <motion.p
        className="text-sm text-on-surface-variant px-4 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {description}
      </motion.p>

      <motion.div
        className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          💡
        </motion.div>
        {suggestion}
      </motion.div>
    </motion.div>
  );
}
