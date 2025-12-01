"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import { sendOtp, verifyOtp, type OtpMethod } from "@/services/auth.service";
import MotionWrapper from "@/components/ui/MotionWrapper";
import ThemeToggleButton from "@/components/atoms/themeToggleButton";
import banner from "@/../public/images/login.jpg";
import logo from "@/../public/logo/logo-inline.png";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { useApiMutation } from "@/hooks/useApi";
import { ErrorDisplay } from "@/components/public/declaration/errorDisplay";

export default function OtpComponent() {
  const router = useRouter();
  const { status, update } = useSession();
  const { success, error: showError, info, dismiss } = useToast();

  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [otpMethods, setOtpMethods] = useState<OtpMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [step, setStep] = useState<"method" | "code">("method");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const pendingToastId = useRef<string | undefined>(undefined);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Éviter de réinitialiser plusieurs fois
    if (initializedRef.current) return;

    // Récupérer les données OTP depuis sessionStorage
    const otpDataStr = sessionStorage.getItem("otp_data");
    if (!otpDataStr) {
      // Si pas de données OTP, rediriger vers login
      router.push("/auth/login");
      return;
    }

    try {
      const otpData = JSON.parse(otpDataStr);
      setOtpToken(otpData.token);
      setOtpMethods(otpData.methods || []);
      // Sélectionner automatiquement la première méthode disponible
      if (otpData.methods && otpData.methods.length > 0) {
        setSelectedMethod(otpData.methods[0].value);
      }
      initializedRef.current = true;
    } catch {
      showError("Données OTP invalides");
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois au montage

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/list");
    }
  }, [status, router]);

  const sendOtpMutation = useApiMutation(
    async (method: string) => {
      if (!otpToken) throw new Error("Token OTP manquant");
      try {
        return await sendOtp({ token: otpToken, method });
      } catch (error) {
        if (
          error instanceof Error &&
          (error as { isHandled?: boolean })?.isHandled
        ) {
          throw error;
        }
        throw error;
      }
    },
    {
      onSuccess: () => {
        setError(null);
        setStep("code");
        success("Code OTP envoyé avec succès");
      },
      onError: (err) => {
        // Extraire un message d'erreur clair et informatif
        let message = "Erreur lors de l'envoi du code OTP";

        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        } else if (err && typeof err === "object" && "message" in err) {
          message = String(err.message);
        }

        // S'assurer que le message n'est pas vide
        if (!message || message.trim() === "") {
          message =
            "Une erreur s'est produite lors de l'envoi du code. Veuillez réessayer.";
        }

        // Afficher l'erreur dans l'interface et dans le toast
        setError({ message });
        showError(message);
      },
    }
  );

  const verifyOtpMutation = useApiMutation(
    async (code: string) => {
      if (!otpToken) throw new Error("Token OTP manquant");
      return await verifyOtp({ token: otpToken, code });
    },
    {
      onSuccess: async (_, variables) => {
        // La vérification OTP a réussi, maintenant créer la session NextAuth
        // On utilise le provider OTP avec le token et le code
        // variables contient le code qui a été passé à mutateAsync
        const code = variables;
        if (!otpToken || !code) return;

        try {
          const res = await signIn("otp", {
            token: otpToken,
            code: code,
            redirect: false,
          });

          if (res?.error) {
            showError(res.error);
            return;
          }

          success("Connexion réussie");

          // Nettoyer sessionStorage
          sessionStorage.removeItem("otp_data");

          // Mettre à jour la session et rediriger
          await update();
          setTimeout(() => {
            router.replace("/list");
          }, 1000);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Erreur lors de la création de la session";
          showError(message);
        }
      },
      onError: (err) => {
        const message =
          err instanceof Error
            ? err.message
            : "Code OTP invalide. Veuillez réessayer.";
        showError(message);
      },
    }
  );

  const handleSendOtp = async () => {
    if (!selectedMethod) {
      showError("Veuillez sélectionner une méthode");
      return;
    }

    setSending(true);
    if (!pendingToastId.current) {
      pendingToastId.current = info("Envoi du code en cours...", {
        id: "otp-send-status",
      });
    }

    try {
      await sendOtpMutation.mutateAsync(selectedMethod);
    } finally {
      setSending(false);
      if (pendingToastId.current) {
        dismiss(pendingToastId.current);
        pendingToastId.current = undefined;
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      showError("Veuillez entrer un code OTP valide");
      return;
    }

    if (!otpToken) {
      showError("Token OTP manquant");
      return;
    }

    setVerifying(true);
    if (!pendingToastId.current) {
      pendingToastId.current = info("Vérification du code...", {
        id: "otp-verify-status",
      });
    }

    try {
      // Vérifier l'OTP d'abord
      await verifyOtpMutation.mutateAsync(otpCode);

      // Si la vérification réussit, onSuccess sera appelé et créera la session
    } catch {
      // L'erreur est déjà gérée par onError
    } finally {
      setVerifying(false);
      if (pendingToastId.current) {
        dismiss(pendingToastId.current);
        pendingToastId.current = undefined;
      }
    }
  };

  const handleBackToMethod = () => {
    setStep("method");
    setOtpCode("");
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "sms":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const getMethodLabel = (method: OtpMethod) => {
    switch (method.value.toLowerCase()) {
      case "email":
        return "Email";
      case "sms":
        return "SMS";
      default:
        return method.name;
    }
  };

  return (
    <MotionWrapper>
      <main className="relative flex h-screen w-full items-center bg-background lg:gap-5 max-lg:flex-col justify-between">
        <div className="absolute md:left-5 px-2 md:mx-0 top-5 lg:left-30 z-30 flex w-full md:w-90 md:px-5 justify-between items-center gap-8 md:justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full py-1.5 font-medium text-foreground w-60 h-12 transition hover:text-primary"
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
          className="absolute max-w-full inset-0 bg-cover bg-center bg-no-repeat dark:opacity-40"
          style={{ backgroundImage: `url(${banner.src})` }}
          aria-hidden
        />

        <div
          className="absolute inset-0 z-1 bg-background/50 md:bg-linear-to-r md:from-background md:from-25% via-background/40 via-55% md:to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex w-full items-center md:pl-10 lg:pl-40 max-lg:h-full md:max-lg:justify-start max-lg:justify-center backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0">
          <div className="w-full max-w-2xl flex flex-col justify-center md:justify-start items-center">
            {step === "method" ? (
              <div className="flex w-full max-w-lg flex-col items-center md:justify-start justify-center gap-6">
                <div className="flex w-full flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-medium text-foreground">
                      Vérification en deux étapes
                    </p>
                    <p className="text-4xl font-medium text-foreground">
                      Choisissez votre méthode de vérification
                    </p>
                  </div>
                  <div className="md:flex hidden space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez le moyen par lequel vous souhaitez recevoir
                      votre code de confirmation.
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4">
                  {otpMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedMethod(method.value)}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method.value
                          ? "border-primary bg-primary/10"
                          : "border-foreground/20 hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          selectedMethod === method.value
                            ? "bg-primary text-white"
                            : "bg-foreground/10 text-foreground"
                        }`}
                      >
                        {getMethodIcon(method.value)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground">
                          {getMethodLabel(method)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir le code par{" "}
                          {getMethodLabel(method).toLowerCase()}
                        </p>
                      </div>
                      {selectedMethod === method.value && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!selectedMethod || sending}
                    className="mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-white transition disabled:opacity-60"
                  >
                    {sending ? "Envoi en cours..." : "Envoyer le code"}
                  </button>

                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleVerifyOtp}
                className="flex w-full max-w-lg flex-col items-center md:justify-start justify-center gap-6"
              >
                <div className="flex w-full flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-medium text-foreground">
                      Code de vérification
                    </p>
                    <p className="text-4xl font-medium text-foreground">
                      Entrez le code reçu
                    </p>
                  </div>
                  <div className="md:flex hidden space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Nous avons envoyé un code de vérification à votre{" "}
                      {selectedMethod === "email" ? "email" : "téléphone"}.
                    </p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4">
                  <label className="font-medium text-foreground">
                    Code OTP
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-4 text-center text-2xl font-bold tracking-widest shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                      value={otpCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtpCode(value);
                      }}
                      placeholder="000000"
                      required
                      autoFocus
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!otpCode || otpCode.length < 4 || verifying}
                    className="mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-white transition disabled:opacity-60"
                  >
                    {verifying ? "Vérification..." : "Vérifier le code"}
                  </button>

                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBackToMethod}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Changer de méthode
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sending}
                      className="text-sm text-primary hover:underline disabled:opacity-60"
                    >
                      Renvoyer le code
                    </button>
                  </div>
                </div>
              </form>
            )}

            {error && (
              <ErrorDisplay
                error={error}
                className="mt-8 text-red-700 border-red-400"
              />
            )}
          </div>
        </div>
      </main>
    </MotionWrapper>
  );
}
