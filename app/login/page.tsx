// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Lock, AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

// ==========================================
// ANIMATED BACKGROUND — kerangka SAMA PERSIS dengan app/not-found.tsx
// (partikel Hiasan 5.svg melayang + dua orb gradasi), cuma warna orb
// divariasikan (primary/tertiary, bukan merah/oranye) karena ini bukan
// halaman error. Duplikasi kecil disengaja, bukan diekstrak jadi komponen
// bersama, supaya not-found.tsx (yang diminta TIDAK diubah selain teks
// 404-nya) tetap sepenuhnya utuh.
// ==========================================

function AnimatedLoginBackground() {
  // useState(lazy initializer) — BUKAN useMemo — karena Math.random() di sini
  // impure; React boleh re-invoke callback useMemo kapan saja tanpa jaminan
  // efek samping konsisten, sedangkan initializer useState dijamin cuma
  // jalan sekali per mount. (not-found.tsx masih pakai useMemo lama — tidak
  // diubah sesuai permintaan, tapi kode baru di sini pakai pola yang benar.)
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => {
      const size = 16 + Math.floor(Math.random() * 24);
      return {
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 2,
      };
    }),
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-primary-container via-primary/10 to-transparent rounded-full blur-3xl opacity-20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-tl from-tertiary-container via-tertiary/10 to-transparent rounded-full blur-3xl opacity-15"
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute opacity-35 select-none"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -40, 0], rotate: [0, 180, 360], scale: [1, 1.15, 1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          <Image src="/Hiasan 5.svg" alt="" width={p.size} height={p.size} className="object-contain" aria-hidden="true" />
        </motion.div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleLogin = async () => {
    setError(null);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (oauthError) setError(oauthError.message);
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-aged-paper px-4 py-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedLoginBackground />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-background border-4 border-on-surface p-6 md:p-8 rounded-2xl hard-shadow-lg text-center max-w-sm w-full space-y-5 relative z-10"
      >
        {/* Eyebrow badge — flex + w-fit + mx-auto (BUKAN inline-flex sendirian)
            supaya ini jadi blok sendiri yang center, bukan sejajar dengan
            kotak ikon di baris yang sama. */}
        <motion.div variants={itemVariants} className="flex w-fit mx-auto">
          <div className="flex items-center gap-2 border-2 border-on-surface bg-background px-3 py-1 rounded-full hard-shadow-sm">
            <Lock className="size-3.5 text-primary" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-widest text-on-surface">
              Portal Admin
            </span>
          </div>
        </motion.div>

        {/* Ikon melayang — pola identik FloatingErrorIcon di not-found.tsx,
            warna primary (bukan merah), Hiasan 5.svg yang sama berputar di dalamnya. */}
        <motion.div
          className="flex w-fit mx-auto p-4 bg-linear-to-br from-tertiary to-tertiary-container/30 text-on-primary border-4 border-on-surface rounded-2xl hard-shadow-sm relative"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 102, 137, 0.25)" }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 relative flex items-center justify-center"
          >
            <Image
              src="/Hiasan 5.svg"
              alt=""
              width={43}
              height={43}
              className="brightness-200"
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1.5">
          <h1 className="font-serif text-2xl md:text-3xl font-black text-on-surface tracking-tight leading-tight">
            Masuk Admin
          </h1>
          <p className="text-xs md:text-sm font-medium text-on-surface-variant/80 leading-relaxed px-2">
            Masuk untuk mengelola konten Jawara Obira.
          </p>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            role="alert"
            className="flex items-center gap-2 rounded-lg border-2 border-error/30 bg-error-container p-3 text-left text-sm font-bold text-error"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </motion.div>
        )}

        <motion.form variants={itemVariants} onSubmit={handleEmailLogin} className="space-y-3 text-left">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-sm font-black uppercase tracking-wider text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-sm font-black uppercase tracking-wider text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button type="submit" variant="primary" loading={loading} className="w-full">
            {loading ? "Memproses..." : "Login dengan Email"}
          </Button>
        </motion.form>

        <motion.div variants={itemVariants} className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-outline-variant" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-label-sm font-black uppercase tracking-widest text-on-surface-variant">
              Atau
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          {/* variant="secondary" (bukan "primary") — sengaja beda dari tombol
              Email supaya ada satu aksi utama yang jelas menonjol (biru) dan
              satu alternatif (netral), tapi keduanya tetap pakai typography
              Button yang sama (font-black uppercase tracking-wider) — tidak
              ada className override lagi yang bikin teksnya beda gaya. */}
          <Button type="button" variant="tertiary" onClick={handleGoogleLogin} className="w-full">
            <FcGoogle className="size-5" aria-hidden="true" />
            Login dengan Google
          </Button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-xs text-on-surface-variant/70">
          Hanya akun yang terdaftar sebagai admin yang dapat mengakses dashboard.
        </motion.p>
      </motion.div>

      {/* Corner ornaments — sama seperti not-found.tsx */}
      <motion.div
        className="absolute top-5 -right-12 opacity-35 pointer-events-none select-none z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Image src="/Hiasan 5.svg" alt="" width={192} height={192} className="object-contain" aria-hidden="true" />
      </motion.div>
      <motion.div
        className="absolute -bottom-16 -left-16 opacity-35 pointer-events-none select-none z-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <Image src="/Hiasan 5.svg" alt="" width={256} height={256} className="object-contain" aria-hidden="true" />
      </motion.div>
    </motion.main>
  );
}
