"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BUDAYA_CONTENT } from "@/constants/budaya";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center bg-background border-4 border-on-surface rounded-2xl py-12 px-6 hard-shadow max-w-md mx-auto relative overflow-hidden select-none"
    >
      <div className="relative inline-flex w-16 h-16 mb-3 motion-safe:animate-[spin_20s_linear_infinite]">
        <Image
          src="/Hiasan 5.svg"
          alt=""
          aria-hidden="true"
          fill
          className="object-contain p-1 opacity-80"
        />
      </div>
      <h3 className="font-serif text-xl text-on-surface font-black mb-1.5">
        {BUDAYA_CONTENT.emptyTitle}
      </h3>
      <p className="text-body-md text-on-surface-variant font-medium max-w-xs mx-auto leading-relaxed">
        {BUDAYA_CONTENT.emptyDescription}
      </p>
    </motion.div>
  );
}
