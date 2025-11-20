"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import MotionWrapper from "@/components/ui/MotionWrapper";
import ThemeToggleButton from "@/components/atoms/themeToggleButton";
import banner from "@/../public/images/banner.webp";
import logo from "@/../public/logo/logo-inline.png";
import { Home } from "lucide-react";
import Loader from "@/components/atoms/loader";

function LoginPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";

  const { login } = useAuth();
  const { status } = useSession();

  const { success, error: showError, info, dismiss } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pendingToastId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (!pendingToastId.current) {
      pendingToastId.current = info("Connexion en cours...", {
        id: "login-status",
      });
    }

    try {
      const res = await login({ identifier, password });

      if (res.ok) {
        success(res.message || "Connexion réussie");
        return;
      }

      showError(res.error || "Identifiants invalides");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : undefined;
      showError(message || "Erreur de connexion");
    } finally {
      setSubmitting(false);
      if (pendingToastId.current) {
        dismiss(pendingToastId.current);
        pendingToastId.current = undefined;
      }
    }
  }

  return (
    <MotionWrapper>
      <main className="relative flex h-screen w-full items-center bg-background lg:gap-5 max-lg:flex-col-reverse">
        <Link
          href="/"
          className="absolute left-5 top-10 z-30 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1.5 font-medium text-foreground shadow-sm backdrop-blur transition hover:border-primary/50 hover:text-primary"
        >
          <Home className="size-7" />
          Accueil
        </Link>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40"
          style={{ backgroundImage: `url(${banner.src})` }}
          aria-hidden
        />

        <div className="z-10 flex w-full items-start justify-center p-5 lg:items-center max-lg:h-full max-lg:bg-background/90">
          <div className="z-10 w-full max-w-2xl rounded-xl bg-background/90 p-5 shadow-lg backdrop-blur lg:p-10">
            <form
              onSubmit={onSubmit}
              className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-6"
            >
              <div className="flex w-full flex-col gap-5">
                <div className="flex w-full items-start justify-between">
                  <Image
                    src={logo}
                    alt="digipublic logo"
                    width={120}
                    height={48}
                    className="h-12 w-auto"
                  />
                  <ThemeToggleButton />
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-wide text-primary">
                    Portail DigiPublic
                  </p>
                  <h1 className="text-3xl font-semibold text-foreground">
                    Bonjour ! Heureux de vous revoir
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Connectez-vous pour accéder à vos démarches fiscales et vos
                    déclarations en cours.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-4">
                <label className="text-sm font-medium text-foreground">
                  Identifiant
                  <input
                    className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </label>

                <label className="text-sm font-medium text-foreground">
                  Mot de passe
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition disabled:opacity-60"
                >
                  {submitting ? "Connexion..." : "Se connecter"}
                </button>

                <div className="flex flex-wrap justify-between gap-3 text-sm text-muted-foreground">
                  <Link
                    href="/auth/password/forgot"
                    className="font-medium text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                  <div className="flex flex-wrap items-center gap-1">
                    <span>Pas encore de compte ?</span>
                    <Link
                      href="/auth/registration"
                      className="font-medium text-primary hover:underline"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="relative flex h-full w-full items-center bg-background/85 px-10 py-10 max-lg:h-fit max-lg:py-12">
          <div className="relative z-10 mx-auto  max-w-lg flex-col items-start justify-center gap-8 hidden md:flex">
            <Image
              src={logo}
              alt="digipublic logo blanc"
              width={240}
              height={80}
              className="w-48"
              priority
            />
            <div className="flex flex-col gap-2">
              <p className="text-xl font-medium text-foreground">
                simplifiez votre vie fiscal !
              </p>
              <p className="text-4xl font-medium text-foreground">
                Déclarez, payez et suivez vos taxes sans stress
              </p>
            </div>
          </div>
        </div>
      </main>
    </MotionWrapper>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginPageInner />
    </Suspense>
  );
}
