"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import AnimatedGradientBackground from "@/components/ui/MovingGradient";

export default function MarketingLanding() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme !== "light";

  const heroHeadingClass = isDarkTheme ? "text-white" : "text-slate-900";
  const heroDescriptionClass = isDarkTheme ? "text-white/80" : "text-slate-600";
  const accentGlowClass = isDarkTheme ? "bg-white/6" : "bg-(--primary)/15";
  const primaryCtaClass = `${
    isDarkTheme
      ? "bg-white text-(--primary) shadow-white/30 hover:shadow-white/50"
      : "bg-(--primary) text-white shadow-(--primary)/30 hover:bg-(--primary)/90"
  } inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition`;
  const secondaryCtaClass = `${
    isDarkTheme
      ? "border-white/30 text-white hover:bg-white/10"
      : "border-slate-300 text-slate-700 hover:bg-white"
  } inline-flex items-center gap-2 px-5 py-3 rounded-lg border transition`;
  const badgesRowClass = isDarkTheme ? "text-white/90" : "text-slate-700";
  const mockupBubbleClass = isDarkTheme
    ? "bg-white/10 backdrop-blur-md shadow-xl"
    : "bg-white/80 backdrop-blur-md shadow-xl border border-white/60";

  return (
    <div className="min-h-screen bg-(--dp-bg) text-neutral-700 dark:text-white/90 ">
      {/* HERO */}

      <AnimatedGradientBackground>
        <section className="relative">
          {/* <div className="absolute inset-0  opacity-95 "></div> */}

          <div
            className={`absolute -left-40 top-20 w-[520px] h-[520px] rounded-[120px] ${accentGlowClass} blur-[56px]`}
          />
          <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-20 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 ">
              <motion.h1
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className={`text-5xl md:text-7xl font-extrabold leading-tight max-w-2xl ${heroHeadingClass}`}
              >
                La plateforme moderne pour vos démarches fiscales
              </motion.h1>

              <motion.p
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
                className={`mt-6 text-lg md:text-xl max-w-xl ${heroDescriptionClass}`}
              >
                Inscription, déclaration et suivi centralisés — un portail
                simple, sécurisé et pensé pour les contribuables et les agents.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 flex gap-4"
              >
                <a href="/registration" className={primaryCtaClass}>
                  Commencer maintenant
                  <ArrowRight size={18} />
                </a>
                <a href="#features" className={secondaryCtaClass}>
                  En savoir plus
                </a>
              </motion.div>

              <div
                className={`mt-8 flex flex-wrap gap-4 text-sm ${badgesRowClass}`}
              >
                <Badge label="Sécurisé" isDark={isDarkTheme} />
                <Badge label="Piloté par API" isDark={isDarkTheme} />
                <Badge label="Import CSV / Excel" isDark={isDarkTheme} />
              </div>
            </div>

            {/* Right: mockup & decorative bubble */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ rotate: -12, y: -10, opacity: 0 }}
                animate={{ rotate: -6, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 14 }}
                className="relative w-[360px] h-[700px] md:w-[420px] md:h-[820px]"
              >
                {/* big rounded bubble behind */}
                <div
                  className={`absolute -left-12 -top-12 w-[480px] h-[340px] rounded-bubble ${mockupBubbleClass}`}
                />

                {/* phone mockup (placeholder) */}
                <div
                  aria-hidden
                  className="absolute inset-0 m-auto w-[320px] h-[640px] md:w-[360px] md:h-[720px] rounded-3xl bg-linear-to-b from-white/90 to-white/70 shadow-2xl flex flex-col overflow-hidden"
                  style={{ border: "10px solid rgba(255,255,255,0.15)" }}
                >
                  <div className="h-12 bg-neutral-100/60 flex items-center px-4">
                    <div className="w-14 h-8 rounded-lg bg-neutral-200/60" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="h-12 rounded-lg bg-(--dp-soft) mb-4" />
                    <div className="h-44 rounded-lg bg-(--primary)/8 mb-4" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-28 rounded-lg bg-white/70" />
                      <div className="h-28 rounded-lg bg-white/70" />
                      <div className="h-28 rounded-lg bg-white/70" />
                    </div>
                  </div>
                  <div className="h-18 bg-neutral-100/60 flex items-center px-4">
                    <div className="w-24 h-8 rounded-lg bg-primary" />
                  </div>
                </div>

                {/* small phone previews */}
                <div className="absolute right-[10px] bottom-[-20px] w-[140px] h-[300px] rounded-2xl bg-white/85 shadow-lg transform rotate-6" />
                <div className="absolute right-[-32px] bottom-[40px] w-[120px] h-[240px] rounded-2xl bg-white/85 shadow-lg transform rotate-10" />
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedGradientBackground>

      {/* SECTION 01 Overview (big bubble block) */}
      {/* <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="rounded-bubble overflow-hidden hero-gradient p-12 md:p-16 text-white">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="text-[96px] font-extrabold opacity-20 leading-none">
              01
            </div>
            <div className="max-w-3xl">
              <h3 className="text-3xl md:text-4xl font-semibold">
                Project Overview
              </h3>
              <p className="mt-4 text-lg text-white/90">
                DigiPublic est une plateforme qui connecte les contribuables et
                les services administratifs pour simplifier l’inscription, la
                déclaration et la gestion documentaire. Le moteur est
                entièrement piloté par API.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* <GlobeSection /> */}

      {/* PROBLEM & SOLUTION */}
      {/* <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h4 className="text-2xl font-semibold mb-6">The Problem</h4>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <ul className="space-y-4 text-neutral-700">
              <li className="flex items-start gap-4">
                <span className="mt-1 text-[20px] text-(--primary)">
                  •
                </span>
                <div>
                  <strong>Recherche difficile</strong>
                  <div className="text-sm text-neutral-600">
                    Trouver des services et des informations fiables est
                    complexe.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-[20px] text-(--primary)">
                  •
                </span>
                <div>
                  <strong>Transparence limitée</strong>
                  <div className="text-sm text-neutral-600">
                    Tarification et statuts peu clairs.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="mt-1 text-[20px] text-(--primary)">
                  •
                </span>
                <div>
                  <strong>Complexité documentaire</strong>
                  <div className="text-sm text-neutral-600">
                    Gestion des pièces & uploads mal centralisée.
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-2xl font-semibold mb-6">The Solution</h4>
          <div className="bg-(--primary) rounded-xl p-6 text-white shadow-lg">
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <CheckCircle className="mt-1" color="white" />
                <div>
                  <strong>Inscription guidée</strong>
                  <div className="text-sm text-white/90">
                    Formulaires dynamiques pilotés par API et validations
                    serveur.
                  </div>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="mt-1" color="white" />
                <div>
                  <strong>Import / Export</strong>
                  <div className="text-sm text-white/90">
                    CSV & Excel pour intégration en masse.
                  </div>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="mt-1" color="white" />
                <div>
                  <strong>Secure by design</strong>
                  <div className="text-sm text-white/90">
                    NextAuth + token rotation + cookies httpOnly (prévu).
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
     */}
      {/* CTA / Final */}
      {/* <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="rounded-xl bg-var(--dp-soft) p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-2xl font-semibold">Prêt à commencer ?</h4>
            <p className="text-neutral-700 mt-2">
              Créez votre compte, renseignez vos informations et commencez vos
              démarches aujourd&apos;hui.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="/registration"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-(--primary) text-white font-semibold hover:opacity-95"
            >
              {"S'inscrire"}
            </a>
            <a
              href="/auth/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-300 bg-white"
            >
              Se connecter
            </a>
          </div>
        </div>
      </section>
     */}
    </div>
  );
}

/* small badge */
function Badge({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${
        isDark
          ? "bg-white/12 text-white/95 border-white/10"
          : "bg-white/90 text-slate-700 border-white/60"
      }`}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
        <circle
          cx="5"
          cy="5"
          r="5"
          fill={isDark ? "white" : "var(--primary, #2563eb)"}
        />
      </svg>
      {label}
    </span>
  );
}
