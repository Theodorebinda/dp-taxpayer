"use client";

import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Tableau de bord
        </p>
        <h1 className="text-3xl font-semibold">
          Cette section est introuvable
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          La route que vous essayez d&apos;ouvrir n&apos;existe pas. Vérifiez
          l&apos;URL ou revenez à la vue d&apos;ensemble du portail.
        </p>
      </div>
      <Link
        href="/dashboard/overview"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background transition hover:bg-primary/90"
      >
        Retour au dashboard
      </Link>
    </section>
  );
}
