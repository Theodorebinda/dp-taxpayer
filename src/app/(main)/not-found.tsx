"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { useThemeMounted } from "@/hooks/useThemeMounted";

export default function NotFound() {
  const router = useRouter();
  const { isMounted } = useThemeMounted();

  // Ne pas rendre le contenu jusqu'à ce que le thème soit monté
  // pour éviter les problèmes de style
  if (!isMounted) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="space-y-6 max-w-2xl opacity-0" aria-hidden="true">
          {/* Placeholder invisible pour éviter le layout shift */}
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 max-w-2xl"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-primary/10 rounded-full p-6">
              <AlertCircle className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500 dark:text-white/60 font-semibold">
            Erreur 404
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-primary">
            Page introuvable
          </h1>
          <p className="text-lg text-slate-600 dark:text-white/80 max-w-xl mx-auto">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
            Vérifiez l&apos;URL ou retournez à la page d&apos;accueil.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="primary"
            size="large"
            className="w-full sm:w-auto"
            onClick={() => router.push("/")}
          >
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Button>
          <Button
            variant="outline"
            size="large"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </Button>
        </div>

        {/* Helpful links */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/20">
          <p className="text-sm text-slate-500 dark:text-white/60 mb-4">
            Vous pouvez également :
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Se connecter
            </Link>
            <span className="text-slate-400 dark:text-white/40">•</span>
            <Link
              href="/auth/registration"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              S&apos;inscrire
            </Link>
            <span className="text-slate-400 dark:text-white/40">•</span>
            <Link
              href="#features"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Fonctionnalités
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
