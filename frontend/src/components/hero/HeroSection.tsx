"use client";

import { motion } from "framer-motion";
import { Camera, FileText, Sparkles, Video } from "lucide-react";
import { PromoBanner } from "@/components/hero/PromoBanner";

const QUICK_PILLS = [
  { label: "Editor de TikTok", Icon: Video },
  { label: "Fotografo para evento", Icon: Camera },
  { label: "Traduccion de documentos", Icon: FileText },
  { label: "Mas vendido hoy", Icon: Sparkles },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export function HeroSection() {
  return (
    <section className="fp-gradient-bg border-b border-border/60">
      <motion.div
        className="mx-auto max-w-7xl px-4 pb-4 pt-5 sm:pt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          className="text-xs font-semibold uppercase tracking-[0.1em] text-primary"
        >
          Lima, Peru
        </motion.p>
        <motion.h1
          variants={itemVariants}
          className="mt-1 text-[clamp(28px,4vw,44px)] font-extrabold leading-tight text-foreground"
        >
          ¿Que necesitas resolver hoy?
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-1 max-w-2xl text-sm text-muted">
          Entra, descubre y contrata al toque. Servicios reales, gente real, resultados
          directos.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-4 flex flex-wrap gap-2">
          {QUICK_PILLS.map(({ label, Icon }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.03 }}
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:border-primary/45 hover:text-primary"
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <PromoBanner />
        </motion.div>
      </motion.div>
    </section>
  );
}
