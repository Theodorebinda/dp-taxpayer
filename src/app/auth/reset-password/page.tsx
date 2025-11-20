"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Suspense } from "react";
import { z } from "zod";
import { Home, Loader2 } from "lucide-react";
import banner from "@/../public/images/banner.webp";
import logo from "@/../public/logo/logo-inline.png";
import ThemeToggleButton from "@/components/atoms/themeToggleButton";
import { useToast } from "@/hooks/useToast";
import {
  useResetPassword,
  useValidateResetToken,
} from "@/hooks/usePasswordReset";
import { createZodResolver } from "@/lib/forms/zod-resolver";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Inclure au moins une lettre majuscule")
      .regex(/[0-9]/, "Inclure au moins un chiffre"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Les mots de passe doivent être identiques",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
const resetPasswordResolver = createZodResolver(ResetPasswordSchema);

function ResetPasswordContent() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token");
  const { success, error } = useToast();
  const tokenValidation = useValidateResetToken(token);
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordForm>({
    resolver: resetPasswordResolver,
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordForm) {
    if (!token) {
      error("Lien de réinitialisation invalide.");
      return;
    }
    try {
      const response = await resetPasswordMutation.mutateAsync({
        token,
        newPassword: values.password,
      });
      const message =
        response.message || "Votre mot de passe a été réinitialisé.";
      success(message);
      reset();
      router.replace("/auth/login");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour votre mot de passe.";
      error(message);
    }
  }

  const isTokenMissing = !token;
  const isTokenInvalid =
    tokenValidation.isError ||
    (tokenValidation.data && !tokenValidation.data.valid);

  return (
    <main className="relative flex min-h-screen w-full items-center bg-background lg:gap-5 max-lg:flex-col-reverse">
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
        <div className="z-10 w-full max-w-xl rounded-xl bg-background/90 p-6 shadow-lg backdrop-blur lg:p-10">
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
                Sécurité du compte
              </p>
              <h1 className="text-3xl font-semibold text-foreground">
                Choisissez un nouveau mot de passe
              </h1>
              <p className="text-sm text-muted-foreground">
                Le mot de passe doit contenir au minimum 8 caractères, une
                majuscule et un chiffre.
              </p>
            </div>
          </div>

          {isTokenMissing ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
              Aucun jeton de réinitialisation n&apos;a été trouvé.{" "}
              <Link
                href="/auth/password/forgot"
                className="font-semibold underline"
              >
                Demander un nouveau lien.
              </Link>
            </div>
          ) : tokenValidation.isPending ? (
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/30 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Vérification du lien en cours...
            </div>
          ) : isTokenInvalid ? (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
              Ce lien de réinitialisation est invalide ou expiré.{" "}
              <Link
                href="/auth/password/forgot"
                className="font-semibold underline"
              >
                Demander un nouveau lien.
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 flex w-full flex-col gap-4"
            >
              <label className="text-sm font-medium text-foreground">
                Nouveau mot de passe
                <input
                  type="password"
                  aria-invalid={Boolean(errors.password)}
                  className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </label>

              <label className="text-sm font-medium text-foreground">
                Confirmer le mot de passe
                <input
                  type="password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </label>

              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition disabled:opacity-60"
              >
                {resetPasswordMutation.isPending
                  ? "Mise à jour..."
                  : "Mettre à jour le mot de passe"}
              </button>

              <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground">
                <Link href="/auth/login" className="hover:underline">
                  Retour à la connexion
                </Link>
                <Link
                  href="/auth/password/forgot"
                  className="font-medium text-primary hover:underline"
                >
                  Besoin d&apos;un nouveau lien ?
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* <div className="relative flex h-full w-full items-center bg-background/85 px-10 py-10 max-lg:h-fit max-lg:py-12">
        <div className="relative z-10 mx-auto flex max-w-lg flex-col items-start justify-center gap-8">
          <Image
            src={logo}
            alt="digipublic logo blanc"
            width={240}
            height={80}
            className="w-48"
            priority
          />
          <div className="flex flex-col gap-2 h-full">
            <p className="text-xl font-medium text-foreground">
              Protégez vos accès en quelques secondes
            </p>
            <p className="text-4xl font-medium text-foreground">
              Réinitialisez et reprenez vos démarches en toute confiance
            </p>
          </div>
        </div>
      </div> */}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
