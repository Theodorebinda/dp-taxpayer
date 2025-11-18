"use client";

export default function OverviewPage() {
  return (
    <main className="h-full w-full p-0 md:p-6 ">
      <header className="mb-6">
        <p className="text-sm uppercase text-muted-foreground">Dashboard</p>
        <h1 className="text-4xl font-semibold">Tableau de Bord</h1>
        <p className="text-gray-500  text-muted-foreground">
          Vue d&apos;ensemble de vos déclarations et impôts
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
        <section className="rounded-xl border h-40 border-dashed p-8 text-sm text-muted-foreground bg-background">
          Contenu à définir par la suite (widgets dynamiques, kpis, etc.).
        </section>
        <section className="rounded-xl border h-40 border-dashed p-8 text-sm text-muted-foreground">
          <div>
            <h2 className="text-2xl font-semibold">Déclarations</h2>
            <p className="text-gray-500  text-muted-foreground">
              Vue d&apos;ensemble de vos déclarations et impôts
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Impôts</h2>
          </div>
        </section>
      </div>
    </main>
  );
}
