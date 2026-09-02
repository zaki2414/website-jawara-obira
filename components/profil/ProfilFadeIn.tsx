// components/profil/ProfilFadeIn.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Leaf "use client" khusus untuk transisi fade-in level halaman — dipisah
// dari app/profil/page.tsx supaya page.tsx bisa jadi Server Component (bisa
// fetch data map_facilities langsung), sesuai migrasi yang diminta CLAUDE.md
// §1.1 untuk halaman ini.
export function ProfilFadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="relative min-h-screen flex flex-col bg-background overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
