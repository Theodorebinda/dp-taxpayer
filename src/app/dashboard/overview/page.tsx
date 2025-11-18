"use client";

export default function OverviewPage() {
  return (
    <section className="h-full w-full p-6">
      <header className="mb-6">
        <p className="text-sm uppercase text-muted-foreground">Dashboard</p>
        <h1 className="text-3xl font-semibold">Vue d&apos;ensemble</h1>
        <p className="text-sm text-muted-foreground">
          Statistiques globales, raccourcis et suivi de vos opérations récentes.
        </p>
      </header>
      <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        Contenu à définir par la suite (widgets dynamiques, kpis, etc.).
      </div>
    </section>
  );
}
