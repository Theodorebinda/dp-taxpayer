"use client";

export default function DeclarationsPage() {
  return (
    <section className="flex flex-col gap-3 p-6">
      <p className="text-sm uppercase text-muted-foreground">Opérations</p>
      <h1 className="text-3xl font-semibold">Déclarations</h1>
      <p className="text-sm text-muted-foreground">
        Vue dédiée aux déclarations fiscales (listes, formulaires, workflows).
      </p>
      <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        Contenu des déclarations à implémenter.
      </div>
    </section>
  );
}
