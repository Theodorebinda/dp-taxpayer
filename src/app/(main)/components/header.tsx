"use client";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme !== "light";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 62);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClassName = useMemo(
    () =>
      clsx(
        "mt-3 mb-3 rounded-2xl transition-all duration-300",
        scrolled
          ? isDarkTheme
            ? "border border-white/10 bg-(--bg-secondary)/80 backdrop-blur-md shadow-lg shadow-black/30"
            : "border border-white/60 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-200/70"
          : "border-transparent bg-transparent shadow-none",
        isDarkTheme ? "text-white/90" : "text-slate-800"
      ),
    [isDarkTheme, scrolled]
  );

  const linkColorClass = isDarkTheme
    ? "text-white/90"
    : "text-app-blue-700 hover:text-(--primary)";

  const signupButtonClass = isDarkTheme
    ? "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-(--primary) bg-white shadow-sm hover:opacity-90 transition"
    : "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white bg-primary shadow-sm hover:opacity-95 transition";

  const baseBackground = isDarkTheme ? "#243147" : "#f4f7ff";
  const gradientStyle = useMemo(
    () =>
      isDarkTheme
        ? `
            radial-gradient(600px at 30% 20%, rgba(4,137,150,0.25), transparent 70%),
            radial-gradient(800px at 80% 70%, rgba(4,137,150,0.15), transparent 80%)
          `
        : `
            radial-gradient(720px at 20% 20%, rgba(53,132,255,0.22), transparent 70%),
            radial-gradient(860px at 80% 60%, rgba(14,165,233,0.18), transparent 80%)
          `,
    [isDarkTheme]
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{ background: baseBackground }}
        />
        <div
          className={`absolute inset-0 ${
            isDarkTheme ? "opacity-[0.35] blur-3xl" : "opacity-[0.5] blur-2xl"
          }`}
          style={{ background: gradientStyle }}
        />
        <div className="relative">
          <div className="h-px w-full bg-linear-to-r from-(--app-green-600)/30 via-(--app-blue-600)/30 to-(--app-green-600)/30 " />
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.nav
              className={navClassName}
              initial={false}
              animate={scrolled ? { y: 6, opacity: 1 } : { y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 28,
                mass: 0.4,
              }}
            >
              <div className="flex items-center justify-between px-4 md:px-6 py-3">
                <Link href="/" className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm"
                  >
                    <span className="h-2 w-2 rounded-full bg-white/90 pulse" />
                  </span>
                  <Image
                    src="/logo/logo-inline.png"
                    alt="DigiPublic"
                    width={140}
                    height={28}
                    className="h-6 md:h-8 w-auto"
                    priority
                  />
                </Link>

                <div className="hidden md:flex items-center gap-8 font-medium transition-colors">
                  <a
                    href="#features"
                    className={clsx(
                      "relative transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100",
                      linkColorClass
                    )}
                  >
                    Fonctionnalités
                  </a>
                  <a
                    href="#how"
                    className={clsx(
                      "relative transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100",
                      linkColorClass
                    )}
                  >
                    Comment ça marche
                  </a>
                  <Link
                    href="/contact"
                    className={clsx(
                      "relative transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100",
                      linkColorClass
                    )}
                  >
                    Contact
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <ThemeSwitcher />
                  <Link
                    href="/auth/login"
                    className={clsx(
                      "hidden md:inline px-3 py-2 font-medium transition-colors",
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
            </motion.nav>
          </div>
        </div>
      </div>
    </header>
  );
}
