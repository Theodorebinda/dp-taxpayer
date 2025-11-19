"use client";

import { quickActions } from "./components/quickActionSection";

const taxpayerInfo = {
  nif: "NIU-2025-001",
  fullName: "John Doe",
  type: "Personne physique",
  declarationsCount: 18,
};

const hasTaxpayerInfo = Object.values(taxpayerInfo).some(
  (value) => value !== null && value !== undefined && value !== ""
);

type PropertyOverview = {
  totalProperties: number;
  activeSites: number;
  pendingProjects: number;
  lastUpdate: string;
};

const propertyOverview: PropertyOverview | null = {
  totalProperties: 6,
  activeSites: 4,
  pendingProjects: 2,
  lastUpdate: "12/11/2025",
};

const hasPropertyOverview = Boolean(
  propertyOverview &&
    Object.values(propertyOverview).some(
      (value) => value !== null && value !== undefined && value !== ""
    )
);

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
      <div className="grid grid-cols-1 gap-10">
        <section
          className={`rounded-lg bg-background px-6 py-6 text-sm text-muted-foreground shadow ${
            hasTaxpayerInfo
              ? "shadow-md"
              : "border border-dashed border-border/40 border-gray-300 dark:border-gray-700"
          }`}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-border/40 border-gray-300 dark:border-gray-700 pb-4">
              <h4 className="text-xl font-semibold text-foreground">
                Information du contribuable
              </h4>
              <p className="text-xs text-muted-foreground/70">
                Identifiants principaux et synthèse des déclarations
              </p>
            </div>

            {hasTaxpayerInfo ? (
              <div className="grid grid-cols-1 gap-6 text-foreground md:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    NIF
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerInfo.nif}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Nom complet
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerInfo.fullName}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Type
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerInfo.type}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Nombre de déclarations
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerInfo.declarationsCount}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/40 bg-muted/20  uppercase tracking-wide text-muted-foreground">
                Aucune information contribuable disponible
              </div>
            )}
          </div>
        </section>

        <section
          className={`rounded-xl bg-background px-6 py-6 text-sm text-muted-foreground ${
            hasPropertyOverview
              ? "border border-border/30 border-gray-300 dark:border-gray-700"
              : "border border-dashed border-border/40 border-gray-300 dark:border-gray-700"
          }`}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-border/40 border-gray-300 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-semibold text-foreground">
                Mes Propriétés et Ouvrages
              </h3>
              <p className="text-xs text-muted-foreground/70">
                Suivi des actifs fonciers, chantiers en cours et dernière mise à
                jour
              </p>
            </div>

            {hasPropertyOverview && propertyOverview ? (
              <div className="grid grid-cols-1 gap-6 text-foreground md:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Total propriétés
                  </span>
                  <span className="text-lg font-semibold">
                    {propertyOverview.totalProperties}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Sites actifs
                  </span>
                  <span className="text-lg font-semibold">
                    {propertyOverview.activeSites}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Projets en attente
                  </span>
                  <span className="text-lg font-semibold">
                    {propertyOverview.pendingProjects}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Dernière mise à jour
                  </span>
                  <span className="text-lg font-semibold">
                    {propertyOverview.lastUpdate}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-border/40 border-gray-300 dark:border-gray-700 bg-muted/20  uppercase tracking-wide text-muted-foreground">
                <div className="flex flex-col gap-2 items-center justify-center">
                  {/* < className="size-10" /> */}
                  <span className="text-center font-semibold text-lg text-gray-500">
                    Aucune propriété enregistrée
                  </span>
                  <span className="text-center">
                    Vous n&apos;avez pas encore de propriétés déclarées.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-foreground">
              Actions rapides
            </h3>
            <p className="text-sm text-muted-foreground">
              Accédez en un clic aux formulaires les plus courants.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isDisabled = Boolean(action.disabled);
              const accentBg = isDisabled ? "bg-muted/40" : action.accentBg;
              const titleColor = isDisabled
                ? "text-muted-foreground"
                : `${action.accentText}`;
              const iconColor = isDisabled
                ? "text-muted-foreground"
                : action.accentText;
              const borderColor = isDisabled
                ? "border-border/40"
                : action.accentBorder;
              return (
                <button
                  key={index}
                  className={`flex h-full flex-col rounded-lg border hover:border/70 p-6 text-left shadow-sm transition ${
                    isDisabled
                      ? "cursor-not-allowed border-dashed border-border/40 text-muted-foreground opacity-70"
                      : `${borderColor} hover:${borderColor} hover:shadow-md`
                  }`}
                  disabled={isDisabled}
                >
                  <Icon className={`mb-4 size-8 ${iconColor}`} />
                  <p className={`text-lg font-semibold ${titleColor}`}>
                    {action.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {action.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
