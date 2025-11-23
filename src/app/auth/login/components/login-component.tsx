"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import MotionWrapper from "@/components/ui/MotionWrapper";
import ThemeToggleButton from "@/components/atoms/themeToggleButton";
import banner from "@/../public/images/login.jpg";
import logo from "@/../public/logo/logo-inline.png";
import { CircleX, CheckCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function LoginComponent() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/list";

  const { login } = useAuth();
  const { status } = useSession();

  const { success, error: showError, info, dismiss } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pendingToastId = useRef<string | undefined>(undefined);

  // Validation du mot de passe
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Calcul de la force du mot de passe
  const getPasswordStrength = () => {
    if (password.length === 0) return null;

    const criteriaCount =
      Object.values(passwordValidation).filter(Boolean).length;

    if (criteriaCount <= 2) {
      return { level: "Faible", color: "text-red-500" };
    } else if (criteriaCount <= 4) {
      return { level: "Moyen", color: "text-yellow-500" };
    } else {
      return { level: "Fort", color: "text-green-500" };
    }
  };

  const passwordStrength = getPasswordStrength();

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
        <div className="absolute left-5 top-10 z-30 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 font-medium text-foreground transition hover:text-primary"
          >
            <Image
              src={logo}
              alt="digipublic logo"
              width={100}
              height={40}
              className="h-12 w-auto"
            />
          </Link>
          <ThemeToggleButton />
        </div>

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:opacity-40"
          style={{ backgroundImage: `url(${banner.src})` }}
          aria-hidden
        />

        {/* Gradient overlay: très opaque à gauche pour le formulaire, transparent à droite */}
        <div
          className="absolute inset-0 z-1 bg-linear-to-r from-background from-30% via-background/60 via-55% to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex w-full items-start justify-start p-5 lg:items-center lg:pl-30 lg:pr-0 max-lg:h-full max-lg:justify-center max-lg:bg-background/90">
          <div className="w-full max-w-2xl   p-5  backdrop-blur-sm lg:p-10">
            <form
              onSubmit={onSubmit}
              className=" flex w-full max-w-lg flex-col items-center justify-start gap-6"
            >
              <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <p className="text-xl font-medium text-foreground">
                    simplifiez votre vie fiscal !
                  </p>
                  <p className="text-4xl font-medium text-foreground">
                    Déclarez, payez et suivez vos taxes sans stress
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-wide text-primary">
                    Portail DigiPublic
                  </p>

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
                    className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-4 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="Entrez votre identifiant"
                  />
                </label>

                <label className="text-sm font-medium text-foreground">
                  Mot de passe
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full rounded-lg border border-foreground/20 bg-background px-3 py-4 pr-10 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition disabled:opacity-60"
                >
                  {submitting ? "Connexion..." : "Se connecter"}
                </button>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sécurité du mot de passe</span>
                    {passwordStrength && (
                      <span
                        className={`underline font-medium ${passwordStrength.color}`}
                      >
                        {passwordStrength.level}
                      </span>
                    )}
                  </div>
                  <ul className="list-item list-inside text-sm text-muted-foreground">
                    <li className="flex justify-start items-center gap-2">
                      {passwordValidation.minLength ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <CircleX className="w-4 h-4 text-red-500" />
                      )}
                      <span>Contient au moins 8 caractères</span>
                    </li>
                    <li className="flex justify-start items-center gap-2">
                      {passwordValidation.hasUpperCase ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <CircleX className="w-4 h-4 text-red-500" />
                      )}
                      <span>Contient au moins une lettre majuscule</span>
                    </li>
                    <li className="flex justify-start items-center gap-2">
                      {passwordValidation.hasLowerCase ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <CircleX className="w-4 h-4 text-red-500" />
                      )}
                      <span>Contient au moins une lettre minuscule</span>
                    </li>
                    <li className="flex justify-start items-center gap-2">
                      {passwordValidation.hasNumber ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <CircleX className="w-4 h-4 text-red-500" />
                      )}
                      <span>Contient au moins un chiffre</span>
                    </li>
                    <li className="flex justify-start items-center gap-2">
                      {passwordValidation.hasSpecialChar ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <CircleX className="w-4 h-4 text-red-500" />
                      )}
                      <span>Contient au moins un caractère spécial</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap justify-between gap-3 mt-4 text-sm text-muted-foreground">
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
                      className="font-medium text-primary text-base hover:underline"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </MotionWrapper>
  );
}
