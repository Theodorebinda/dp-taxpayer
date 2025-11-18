"use client";

export default function OperationsPage() {
  return (
    <section className="flex flex-col gap-3 p-6">
      <p className="text-sm uppercase text-muted-foreground">Opérations</p>
      <h1 className="text-3xl font-semibold">Gestion des opérations</h1>
      <p className="text-sm text-muted-foreground">
        Sélectionnez une sous-section (déclarations, paiements…) pour commencer.
      </p>
      <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        Contenu principal des opérations à définir.
      </div>
    </section>
  );
}
