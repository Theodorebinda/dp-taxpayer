"use client";

import Link from "next/link";
import Image from "next/image";
import banner from "@/../public/images/banner.webp";
import logo from "@/../public/logo/logo-inline.png";
import logoMobile from "@/../public/logo/icon.png";
import ThemeToggleButton from "@/components/atoms/themeToggleButton";
import { useToast } from "@/hooks/useToast";
import { useRequestPasswordReset } from "@/hooks/usePasswordReset";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { createZodResolver } from "@/lib/forms/zod-resolver";
import { Home } from "lucide-react";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse e-mail est requise")
    .email("Format d'e-mail invalide"),
});

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
const forgotPasswordResolver = createZodResolver(ForgotPasswordSchema);

export default function ForgotPasswordPage() {
  const { success, error } = useToast();
  const requestReset = useRequestPasswordReset();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: forgotPasswordResolver,
    defaultValues: { email: "" },
  });

  async function submitHandler(values: ForgotPasswordForm) {
    setFeedback(null);
    try {
      const response = await requestReset.mutateAsync(values.email);
      const message =
        response.message ||
        "Si un compte existe, un e-mail vient d'être envoyé.";
      success(message);
      setFeedback({ type: "success", message });
      reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer l'e-mail pour le moment.";
      error(message);
      setFeedback({ type: "error", message });
    }
  }

  return (
    <main className="relative flex min-h-screen w-full items-center bg-background lg:gap-5 max-lg:flex-col-reverse">
      <Link
        href="/"
        className="absolute left-5 top-6 z-30 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1.5 text-sm md:text-base font-medium text-foreground shadow-sm backdrop-blur transition hover:border-primary/50 hover:text-primary"
      >
        <Home className="size-4 md:size-7" />
        Accueil
      </Link>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40"
        style={{ backgroundImage: `url(${banner.src})` }}
        aria-hidden
      />
      <div className="z-10 flex w-full items-start justify-center p-5 lg:items-center max-lg:h-full max-lg:bg-background/90">
        <div className="z-10 w-full max-w-xl rounded-xl bg-background/90 p-6 shadow-lg backdrop-blur lg:p-10">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="mx-auto flex w-full max-w-md flex-col gap-6"
          >
            <div className="flex w-full flex-col gap-5">
              <div className="flex w-full items-center justify-between">
                <Image
                  src={logo}
                  alt="digipublic logo"
                  width={120}
                  height={48}
                  className="h-12 w-auto hidden md:block"
                />
                <Image
                  src={logoMobile}
                  alt="digipublic logo"
                  width={120}
                  height={48}
                  className="h-12 w-auto block md:hidden"
                />
                <div className="hidden md:block">
                  <ThemeToggleButton />
                </div>
                <div className="block md:hidden">
                  <ThemeSwitcher />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-wide text-primary">
                  Récupération
                </p>
                <h1 className="text-3xl font-semibold text-foreground">
                  Réinitialiser votre mot de passe
                </h1>
                <p className="text-sm text-muted-foreground">
                  Indiquez votre adresse e-mail. Nous vous enverrons les étapes
                  pour sécuriser votre compte.
                </p>
              </div>
            </div>

            <label className="text-sm font-medium text-foreground">
              Adresse e-mail
              <input
                type="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby="forgot-email-error"
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                {...register("email")}
              />
              {errors.email && (
                <p
                  id="forgot-email-error"
                  className="mt-1 text-xs text-red-500"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </label>

            {feedback && (
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  feedback.type === "success"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40"
                    : "border-red-400 bg-red-50 text-red-600 dark:bg-red-950/40"
                }`}
                role="status"
              >
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={requestReset.isPending}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition disabled:opacity-60"
            >
              {requestReset.isPending ? "Envoi en cours..." : "Envoyer le lien"}
            </button>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Link href="/auth/login" className="hover:underline">
                Retour à la connexion
              </Link>
              <Link
                href="/auth/registration"
                className="font-medium text-primary hover:underline"
              >
                Créer un compte
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
