"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import AnimatedGradientBackground from "./MovingGradient";

type BadgeProps = {
  label: string;
  isDark: boolean;
};

type HeroSectionProps = {
  isDarkTheme: boolean;
};

function Badge({ label, isDark }: BadgeProps) {
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

export default function HeroSection({ isDarkTheme }: HeroSectionProps) {
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

  return (
    <AnimatedGradientBackground>
      <section className="relative">
        <div
          className=" absolute -left-40 top-20 w-[520px] h-[520px] rounded-[120px] blur-[56px]"
          style={accentGlowStyle}
        />
        <div className="relative max-w-7xl layout-shell mx-auto px-6 md:px-10 py-20 md:py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 ">
            <motion.h1
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className={`text-5xl md:text-6xl font-extrabold leading-tight max-w-2xl ${heroHeadingClass}`}
            >
              La fiscalité simplifiée, pensée pour vous donner de l&apos;avance.
            </motion.h1>

            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9 }}
              className={`mt-6 text-lg md:text-xl max-w-xl ${heroDescriptionClass}`}
            >
              Inscription, déclaration et suivi centralisés — un portail simple,
              sécurisé et pensé pour les contribuables.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex gap-4"
            >
              <a href="/auth/login" className={primaryCtaClass}>
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

          {/* Right: mockup & decorative bubble */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ rotate: -12, y: -10, opacity: 0 }}
              animate={{ rotate: -6, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 14 }}
              className="relative w-[360px] h-[700px] md:w-[420px] md:h-[820px]"
            >
              <div
                className={`absolute hidden md:block -left-12 -top-12 w-[480px] h-[340px] rounded-bubble ${mockupBubbleClass}`}
              />

              <Image
                src="/images/removebg-preview.png"
                alt="smartphone mockup"
                width={320}
                height={700}
                className="absolute inset-0 m-auto w-[320px] h-[700px] md:w-[360px] md:h-[720px] object-cover rounded-3xl scale-100 md:scale-130 hover:scale-140 transition-all duration-300"
              />
              <div className="absolute right-[10px] bottom-[-20px] w-[140px] h-[300px] rounded-2xl bg-white/85 shadow-lg rotate-6" />
              <div className="absolute right-[-32px] bottom-[40px] w-[120px] h-[240px] rounded-2xl bg-white/85 shadow-lg rotate-10" />
            </motion.div>
          </div>
        </div>
      </section>
    </AnimatedGradientBackground>
  );
}
