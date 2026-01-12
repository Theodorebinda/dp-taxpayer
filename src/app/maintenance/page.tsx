"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const updates = [
  {
    title: "Optimisation de l'onboarding",
    detail:
      "Refonte des formulaires et validation automatique des pièces jointes.",
  },
  {
    title: "Nouveaux parcours API",
    detail:
      "Connexion directe aux systèmes fiscaux partenaires en cours d’intégration.",
  },
  {
    title: "Stabilité temps réel",
    detail: "Renforcement de l’infrastructure de streaming pour les paiements.",
  },
];

export default function MaintenancePage() {
  return (
    <div
      className="min-h-screen bg-[var(--dp-bg)] text-slate-800 dark:bg-[var(--background)] dark:text-white/90 flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "radial-gradient(60% 60% at 20% 20%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%), radial-gradient(50% 50% at 80% 0%, color-mix(in srgb, var(--app-blue) 14%, transparent), transparent 75%)",
      }}
    >
      <div className="layout-shell py-16">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl rounded-[32px] bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_40px_120px_rgba(15,23,42,0.2)] px-8 md:px-12 py-12 space-y-8"
        >
          <div className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.4em] uppercase text-slate-500 dark:text-white/60">
            <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse" />
            Maintenance programmée
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
              Nous peaufinons l’expérience DigiPublic.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-white/80 max-w-2xl">
              Notre équipe déploie actuellement une série d’améliorations pour
              garantir des démarches fiscales encore plus fluides et sécurisées.
              Le portail public sera de nouveau accessible très prochainement.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {updates.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/40 bg-white/70 dark:bg-white/5 dark:border-white/10 p-5 space-y-2"
              >
                <p className="text-sm font-semibold tracking-wide text-[var(--primary)] uppercase">
                  {item.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-white/70">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-4">
            <div className="text-sm text-slate-500 dark:text-white/60">
              Besoin d’une confirmation ou d’un accès prioritaire ? Notre équipe
              reste joignable.
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="mailto:contact@digipublic.fr"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold shadow-lg shadow-[var(--primary)]/30 hover:opacity-90 transition"
              >
                Écrire au support
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white/80 hover:bg-white/60 dark:hover:bg-white/10 transition"
              >
                Retour à l’accueil
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
