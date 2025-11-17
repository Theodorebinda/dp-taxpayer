"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import MotionWrapper from "@/components/ui/MotionWrapper";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

export default function LoginPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await login({ identifier, password });
    setSubmitting(false);
    if (res.ok) {
      success("Connexion réussie");
      window.location.href = "/";
    } else {
      error(res.error || "Identifiants invalides");
    }
  }

  console.log(error);

  return (
    <MotionWrapper className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-sm border border-foreground/10 rounded-lg p-5 bg-background">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg">Connexion</h1>
          <ThemeSwitcher />
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm">Identifiant</label>
            <input
              className="w-full text-sm rounded border border-foreground/20 bg-background px-3 py-2"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Mot de passe</label>
            <input
              type="password"
              className="w-full text-sm rounded border border-foreground/20 bg-background px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-primary text-white py-2 text-sm disabled:opacity-60"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </MotionWrapper>
  );
}
