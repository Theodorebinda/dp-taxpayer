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
import { Eye, EyeOff } from "lucide-react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

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

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    console.log({ identifier, password });

    if (!pendingToastId.current) {
      pendingToastId.current = info("Connexion en cours...", {
        id: "login-status",
      });
    }

    try {
      const res = await login({ identifier, password });

      console.log({ res });

      if (res.ok) {
        success(res.message || "Connexion réussie");
        return;
      }

      // Si OTP est requis, rediriger vers la page OTP
      if (res.requiresOtp && res.otpData) {
        console.log("OTP requis détecté, données OTP:", res.otpData);
        // Vérifier que c'est bien le type avec redirectToOpt: true
        const redirectToOpt = res.otpData.redirectToOpt;
        const hasToken = "token" in res.otpData;
        const hasOtpMethod = "otpMethod" in res.otpData;

        console.log("redirectToOpt:", redirectToOpt);
        console.log("hasToken:", hasToken);
        console.log("hasOtpMethod:", hasOtpMethod);

        const isOtpRequired =
          redirectToOpt === true ||
          (typeof redirectToOpt !== "undefined" &&
            String(redirectToOpt) === "true");

        if (isOtpRequired && hasToken && hasOtpMethod) {
          // Type guard: si redirectToOpt est true, alors c'est le type avec token et otpMethod
          const otpData = res.otpData as {
            code: number;
            message: string;
            redirectToOpt: true;
            otpMethod: { name: string; value: string }[];
            token: string;
          };

          const otpToken = otpData.token;
          const otpMethods = otpData.otpMethod;
          console.log("Redirection vers /auth/otp avec token:", otpToken);
          // Stocker les données OTP dans sessionStorage pour la page OTP
          sessionStorage.setItem(
            "otp_data",
            JSON.stringify({
              token: otpToken,
              methods: otpMethods,
            })
          );

          // Utiliser replace au lieu de push pour éviter les problèmes de navigation
          // et s'assurer que la redirection se fait immédiatement
          router.replace("/auth/otp");
          return;
        } else {
          console.error("Données OTP incomplètes:", {
            redirectToOpt,
            hasToken,
            hasOtpMethod,
            otpData: res.otpData,
          });
        }
      }

      // Ne pas afficher d'erreur si OTP est requis (c'est normal)
      if (!res.requiresOtp) {
        showError(res.error || "Identifiants invalides");
      }
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
      <main className="relative flex h-screen w-full items-center bg-background lg:gap-5 max-lg:flex-col justify-between">
        <div className="absolute md:left-5 px-2 md:mx-0   top-5  lg:left-30 z-30 flex w-full md:w-90 md:px-5 justify-between items-center gap-8 md:justify-start">
          <Link
            href="/"
            className="inline-flex  items-center gap-2 rounded-full   py-1.5 font-medium text-foreground  w-60 h-12 transition hover:text-primary"
          >
            <Image
              src={logo}
              alt="digipublic logo"
              width={120}
              height={40}
              className="h-6 md:h-10 w-auto"
            />
          </Link>
          <div className="md:hidden">
            <ThemeSwitcher />
          </div>
          <div className="hidden md:block">
            <ThemeToggleButton className="w-18" />
          </div>
        </div>

        <div
          className="absolute max-w-full inset-0 bg-cover bg-center bg-no-repeat dark:opacity-40 "
          style={{ backgroundImage: `url(${banner.src})` }}
          aria-hidden
        />

        {/* Gradient overlay: très opaque à gauche pour le formulaire, transparent à droite */}
        <div
          className="absolute inset-0 z-1 bg-background/50 md:bg-linear-to-r md:from-background md:from-25% via-background/40 via-55% md:to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex w-full  items-center md:pl-10 lg:pl-40 max-lg:h-full  md:max-lg:justify-start max-lg:justify-center  backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0  ">
          <div className="w-full max-w-2xl flex flex-col justify-center md:justify-start  items-center ">
            <form
              onSubmit={onSubmit}
              className=" flex w-full max-w-lg flex-col items-center md:justify-start justify-center gap-6"
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
                <div className="md:flex hidden space-y-1">
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
                <label className=" font-medium text-foreground">
                  Identifiant
                  <input
                    className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-4 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder="Entrez votre identifiant"
                  />
                </label>

                <label className=" font-medium text-foreground">
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
                  className="mt-4 w-full rounded-lg bg-primary py-3  font-semibold text-white transition disabled:opacity-60"
                >
                  {submitting ? "Connexion..." : "Se connecter"}
                </button>

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
