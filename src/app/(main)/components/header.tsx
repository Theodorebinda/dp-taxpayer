"use client";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { motion, Transition, useReducedMotion } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = isMounted && resolvedTheme === "dark";

  // respect user reduced motion preference
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // CLASSES (safe / valid Tailwind)
  const linkBaseClass =
    "relative transition-colors duration-200 font-medium tracking-tight";
  const linkColorClass = isDarkTheme ? "text-white/90" : "text-slate-800";

  const signupButtonClass = clsx(
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold shadow-sm transition",
    isDarkTheme
      ? "bg-white text-[var(--primary)]"
      : " bg-[var(--primary)] text-white"
  );

  const baseLayer = isDarkTheme ? "var(--background)" : "var(--dp-bg)";
  const glowA = isDarkTheme
    ? "color-mix(in srgb, var(--primary) 24%, transparent)"
    : "color-mix(in srgb, var(--primary) 18%, transparent)";
  const glowB = isDarkTheme
    ? "color-mix(in srgb, var(--app-blue-800) 28%, transparent)"
    : "color-mix(in srgb, var(--app-blue) 12%, transparent)";

  const navSurfaceStyle = {
    backgroundColor: baseLayer,
    backgroundImage: `
      radial-gradient(120% 140% at 10% -40%, ${glowA}, transparent 70%),
      radial-gradient(140% 160% at 90% -60%, ${glowB}, transparent 75%)
    `,
    backgroundBlendMode: isDarkTheme ? "screen" : "multiply",
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
  } as const;

  // mini-nav inline styles to use your CSS variables (and apply alpha)
  const miniNavStyle = {
    // background alpha handled with rgba fallback for wider support
    background: isDarkTheme ? "rgba(36,49,71,0.78)" : "rgba(255,255,255,0.82)",
    borderColor: isDarkTheme
      ? "rgba(255,255,255,0.08)"
      : "rgba(148,163,184,0.35)",
    backdropFilter: "blur(8px)",
  } as const;

  // animations (fall back to simple fade if reduced motion)
  const initial = { y: -100, opacity: 0 };
  const animateIn = { y: 0, opacity: 1 };
  const animateOut = { y: -100, opacity: 0 };
  const transition = shouldReduceMotion
    ? { duration: 0.15 }
    : { type: "spring", stiffness: 420, damping: 32, mass: 0.4 };

  return (
    <header className="relative z-50">
      {/* ========== GRAND HEADER QUI DÉFILE (normal flow) ========= */}
      <div className="w-full backdrop-blur-xl" style={navSurfaceStyle}>
        <div className="layout-shell py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-white/90 pulse" />
            </span>

            <Image
              src={
                isDarkTheme
                  ? "/logo/logo-inline-green.png"
                  : "/logo/logo-inline.png"
              }
              alt="DigiPublic"
              width={150}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={clsx(linkBaseClass, linkColorClass)}>
              Fonctionnalités
            </a>
            <a href="#how" className={clsx(linkBaseClass, linkColorClass)}>
              Comment ça marche
            </a>
            <Link
              href="/contact"
              className={clsx(linkBaseClass, linkColorClass)}
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Link
              href="/auth/login"
              className={clsx(
                "hidden md:inline px-3 py-2 font-medium",
                linkColorClass
              )}
            >
              Se connecter
            </Link>
            <Link href="/auth/registration" className={signupButtonClass}>
              {"S'inscrire"}
            </Link>
          </div>
        </div>
      </div>

      {/* ========== MINI NAV FIXE (overlay) ========== */}
      {/* fixed so it doesn't take layout space when hidden */}
      <motion.div
        aria-hidden={!scrolled}
        className="fixed top-0 left-0 right-0 z-60 pointer-events-none "
        initial={initial}
        animate={scrolled ? animateIn : animateOut}
        transition={transition as Transition}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="layout-shell pointer-events-auto">
          <div
            className="mt-2 mb-2 py-3 rounded-xl border shadow-lg px-2 md:px-4"
            style={miniNavStyle}
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-white/90 pulse" />
                </span>

                <Image
                  src={
                    isDarkTheme
                      ? "/logo/logo-inline-green.png"
                      : "/logo/logo-inline.png"
                  }
                  alt="DigiPublic"
                  width={150}
                  height={32}
                  className="h-7 w-auto"
                  priority
                />
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <a
                  href="#features"
                  className={clsx(linkBaseClass, linkColorClass)}
                >
                  Fonctionnalités
                </a>
                <a href="#how" className={clsx(linkBaseClass, linkColorClass)}>
                  Comment ça marche
                </a>
                <Link
                  href="/contact"
                  className={clsx(linkBaseClass, linkColorClass)}
                >
                  Contact
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <ThemeSwitcher />
                <Link
                  href="/auth/login"
                  className={clsx(
                    "hidden md:inline px-3 py-2 font-medium",
                    linkColorClass
                  )}
                >
                  Se connecter
                </Link>
                <Link href="/auth/registration" className={signupButtonClass}>
                  {"S'inscrire"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
