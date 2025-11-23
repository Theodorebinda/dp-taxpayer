"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { LuMenu, LuX } from "react-icons/lu";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = isMounted && resolvedTheme === "dark";

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const linkColorClass = isDarkTheme ? "text-white/90" : "text-slate-800";

  const signupButtonClass = clsx(
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold shadow-sm transition w-full",
    isDarkTheme
      ? "bg-white text-[var(--primary)]"
      : "bg-[var(--primary)] text-white"
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

  const menuOverlayStyle = {
    background: isDarkTheme
      ? "rgba(15, 23, 42, 0.95)"
      : "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
  } as const;

  return (
    <header className="relative z-50 lg:hidden">
      {/* Header principal */}
      <div
        className={`w-full backdrop-blur-xl transition-shadow ${
          scrolled ? "shadow-lg" : ""
        }`}
        style={navSurfaceStyle}
      >
        <div className="layout-shell py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/90 pulse" />
            </span>

            <Image
              src={
                isDarkTheme
                  ? "/logo/logo-inline-green.png"
                  : "/logo/logo-inline.png"
              }
              alt="DigiPublic"
              width={120}
              height={28}
              className="h-6 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={clsx(
                "p-2 rounded-lg transition-colors",
                isDarkTheme
                  ? "text-white/90 hover:bg-white/10"
                  : "text-slate-800 hover:bg-slate-100"
              )}
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 shadow-2xl"
              style={menuOverlayStyle}
            >
              <div className="flex flex-col h-full">
                {/* Header du menu */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200/20 dark:border-slate-700/30">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/90 pulse" />
                    </span>
                    <Image
                      src={
                        isDarkTheme
                          ? "/logo/logo-inline-green.png"
                          : "/logo/logo-inline.png"
                      }
                      alt="DigiPublic"
                      width={120}
                      height={28}
                      className="h-6 w-auto"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      isDarkTheme
                        ? "text-white/90 hover:bg-white/10"
                        : "text-slate-800 hover:bg-slate-100"
                    )}
                    aria-label="Fermer le menu"
                  >
                    <LuX size={24} />
                  </button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                  <Link
                    href="#features"
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "block px-4 py-3 rounded-lg font-medium transition-colors",
                      isDarkTheme
                        ? "text-white/90 hover:bg-white/10"
                        : "text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    Fonctionnalités
                  </Link>
                  <Link
                    href="#how"
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "block px-4 py-3 rounded-lg font-medium transition-colors",
                      isDarkTheme
                        ? "text-white/90 hover:bg-white/10"
                        : "text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    Comment ça marche
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "block px-4 py-3 rounded-lg font-medium transition-colors",
                      isDarkTheme
                        ? "text-white/90 hover:bg-white/10"
                        : "text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    Contact
                  </Link>
                </nav>

                {/* Actions */}
                <div className="p-4 space-y-3 border-t border-slate-200/20 dark:border-slate-700/30">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "block px-4 py-3 rounded-lg font-medium text-center transition-colors",
                      isDarkTheme
                        ? "text-white/90 hover:bg-white/10"
                        : "text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/registration"
                    onClick={() => setIsMenuOpen(false)}
                    className={signupButtonClass}
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
