"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import AnimatedGradientBackground from "@/components/ui/MovingGradient";
import StickyVisualStory from "@/components/ui/StickyVisualStory";
import GlobeSection from "./components/GlobeSection";
import mainInput from "@/../public/images/main-input.webp";
import banner from "@/../public/images/banner.webp";

export default function DigiPublicLanding() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";

  const heroHeadingClass = isDarkTheme ? "text-white" : "text-slate-900";
  const heroDescriptionClass = isDarkTheme ? "text-white/80" : "text-slate-600";
  const badgesRowClass = isDarkTheme ? "text-white/90" : "text-slate-700";

  // NOTE: use inline styles for CSS vars or Tailwind's arbitrary syntax:
  const accentGlowStyle = isDarkTheme
    ? { backgroundColor: "rgba(255,255,255,0.06)" }
    : { backgroundColor: "rgba(4,137,150,0.08)" };

  // CTA classes using valid Tailwind + CSS var fallback
  const primaryCtaClass = isDarkTheme
    ? "inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition bg-white text-[var(--primary)] shadow"
    : "inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition bg-[var(--primary)] text-white shadow";

  const secondaryCtaClass =
    "inline-flex items-center gap-2 px-5 py-3 rounded-lg border transition";

  const mockupBubbleClass = isDarkTheme
    ? "bg-white/10 backdrop-blur-md shadow-xl"
    : "bg-white/80 backdrop-blur-md shadow-xl border border-white/60";

  const storySections = [
    {
      id: "s1",
      title: "Inscription simplifiée",
      description:
        "Un formulaire guidé et intelligent pour ajouter vos informations en quelques étapes.",
      image: mainInput.src,
    },
    {
      id: "s2",
      title: "Paiement sécurisé",
      description:
        "Acceptez les paiements et suivez les transactions en temps réel depuis un tableau de bord simple.",
      image: banner.src,
    },
    {
      id: "s3",
      title: "Reporting & automatisation",
      description:
        "Exportez, planifiez et automatisez vos déclarations. Contrôlez tout depuis une API puissante.",
      image: mainInput.src,
    },
    {
      id: "s4",
      title: "Reporting & automatisation",
      description:
        "Exportez, planifiez et automatisez vos déclarations. Contrôlez tout depuis une API puissante.",
      image: mainInput.src,
    },
  ];

  return (
    <div
      className="min-h-screen text-neutral-700 dark:text-white/90"
      style={{ backgroundColor: "var(--dp-bg)" }} // safe use of CSS var
    >
      {/* HERO (je n'ai modifié que les classes invalides) */}
      <AnimatedGradientBackground>
        <section className="relative">
          <div
            className="absolute -left-40 top-20 w-[520px] h-[520px] rounded-[120px] blur-[56px]"
            style={accentGlowStyle}
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
                <a
                  href="#features"
                  className={`${secondaryCtaClass} ${
                    isDarkTheme
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-slate-300 text-slate-700 hover:bg-white"
                  }`}
                >
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

            {/* Right: mockup & decorative bubble — kept as-is but fixed invalid classes */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ rotate: -12, y: -10, opacity: 0 }}
                animate={{ rotate: -6, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 80, damping: 14 }}
                className="relative w-[360px] h-[700px] md:w-[420px] md:h-[820px]"
              >
                <div
                  className={`absolute -left-12 -top-12 w-[480px] h-[340px] rounded-bubble ${mockupBubbleClass}`}
                />

                <div
                  aria-hidden
                  className="absolute inset-0 m-auto w-[320px] h-[640px] md:w-[360px] md:h-[720px] rounded-3xl shadow-2xl flex flex-col overflow-hidden bg-gradient-to-b from-white/90 to-white/70"
                  style={{ border: "10px solid rgba(255,255,255,0.15)" }}
                >
                  <div className="h-12 bg-neutral-100/60 flex items-center px-4">
                    <div className="w-14 h-8 rounded-lg bg-neutral-200/60" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="h-12 rounded-lg bg-[var(--dp-soft)] mb-4" />
                    <div
                      className="h-44 rounded-lg"
                      style={{ backgroundColor: "rgba(4,137,150,0.08)" }}
                    />
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="h-28 rounded-lg bg-white/70" />
                      <div className="h-28 rounded-lg bg-white/70" />
                      <div className="h-28 rounded-lg bg-white/70" />
                    </div>
                  </div>
                  <div className="h-18 bg-neutral-100/60 flex items-center px-4">
                    <div className="w-24 h-8 rounded-lg bg-[var(--primary)]" />
                  </div>
                </div>

                <div className="absolute right-[10px] bottom-[-20px] w-[140px] h-[300px] rounded-2xl bg-white/85 shadow-lg rotate-6" />
                <div className="absolute right-[-32px] bottom-[40px] w-[120px] h-[240px] rounded-2xl bg-white/85 shadow-lg rotate-10" />
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedGradientBackground>

      {/* STORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 ">
        <StickyVisualStory sections={storySections} stickyTop={300} />
      </section>
      <section>
        <GlobeSection />
      </section>
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
          fill={isDark ? "white" : "var(--primary,#2563eb)"}
        />
      </svg>
      {label}
    </span>
  );
}
