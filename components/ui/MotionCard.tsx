"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/utils";

type MotionCardProps = {
  href: string;
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
};

export function MotionCard({ href, children, variants, className = "" }: MotionCardProps) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      className={cn(
        "group relative border-2 border-on-surface p-8 rounded-2xl overflow-hidden cursor-pointer h-full hard-shadow hard-shadow-hover",
        className
      )}
    >
      <Link href={href} className="block h-full">
        {children}
      </Link>
    </motion.div>
  );
}