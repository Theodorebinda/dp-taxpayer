"use client";

import { useMemo } from "react";
import { mapRecipesToActions } from "./recipeToActionMapper";
import type { TaxpayerAccount } from "@/types/taxpayer-account.type";
import type { DeclarableRecipe } from "@/types/recipe.type";
import { useTaxpayer } from "@/hooks/useTaxpayer";
import { useDeclarableRecipes } from "@/hooks/useRecipe";
import Loader from "@/components/atoms/loader";
import { Button } from "@/components/ui";
import Link from "next/link";

type OverviewContentProps = {
  initialData: TaxpayerAccount | null;
  taxpayerId: string;
  initialRecipes: DeclarableRecipe[];
};

export default function OverviewContent({
  initialData,
  taxpayerId,
  initialRecipes,
}: OverviewContentProps) {
  const { data: taxpayer, isLoading, isError } = useTaxpayer(taxpayerId);
  const { data: recipesData, isLoading: isLoadingRecipes } =
    useDeclarableRecipes();

  const taxpayerData =
    taxpayer && typeof taxpayer === "object" ? taxpayer : initialData;

  // Utiliser les recipes du hook ou les initiales
  const recipes =
    recipesData && Array.isArray(recipesData) ? recipesData : initialRecipes;

  // Mapper les recipes en actions rapides
  const quickActions = useMemo(() => mapRecipesToActions(recipes), [recipes]);

  // console.log("quickActions", quickActions);

  if (
    (isLoading && !initialData) ||
    (isLoadingRecipes && initialRecipes.length === 0)
  ) {
    return <Loader />;
  }

  if (isError || (!taxpayerData && !isLoading)) {
    return (
      <main className="h-full w-full p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            Impossible de charger les informations du contribuable.
          </p>
        </div>
      </main>
    );
  }

  const hasTaxpayerInfo = Boolean(
    taxpayerData &&
      (taxpayerData.fullName ||
        taxpayerData.uniqueId ||
        taxpayerData.category ||
        taxpayerData.possessions?.length)
  );

  const hasPropertyOverview = Boolean(
    taxpayerData?.possessions && taxpayerData.possessions.length > 0
  );

  // Calculer le nombre total de déclarations depuis les possessions
  const declarationsCount =
    taxpayerData?.possessions.reduce(
      (acc, possession) => acc + (possession._count?.operations ?? 0),
      0
    ) ?? 0;

  return (
    <main className="h-full w-full p-0 md:p-6">
      <header className="mb-6">
        <p className="text-sm uppercase text-muted-foreground">Dashboard</p>
        <h1 className="text-4xl font-semibold">Tableau de Bord</h1>
        <p className="text-gray-500 text-muted-foreground">
          Vue d&apos;ensemble de vos déclarations et impôts
        </p>
      </header>
      <div className="grid grid-cols-1 gap-10">
        <section
          className={`rounded-lg bg-background px-6 py-6 text-sm text-muted-foreground  ${
            hasTaxpayerInfo
              ? "dark:shadow-md"
              : "border border-dashed border-border/40 border-gray-300 dark:border-gray-700"
          }`}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 border-b border-border/40 border-gray-300 dark:border-gray-700 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-foreground">
                  Information du contribuable
                </h4>
                <Link href={`/list/profil`}>
                  <Button className="text-sm" variant="outline" size="small">
                    Voir plus
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground/70">
                Identifiants principaux et synthèse des déclarations
              </p>
            </div>

            {hasTaxpayerInfo && taxpayerData ? (
              <div className="grid grid-cols-1 gap-6 text-foreground md:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    NIF
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerData.uniqueId || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Nom complet
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerData.fullName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Type
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerData.category === "PHYSIQUE"
                      ? "Personne physique"
                      : taxpayerData.category === "MORALE"
                      ? "Personne morale"
                      : taxpayerData.category || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Nombre de déclarations
                  </span>
                  <span className="text-lg font-semibold">
                    {declarationsCount}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/40 bg-muted/20 uppercase tracking-wide text-muted-foreground">
                Aucune information contribuable disponible
              </div>
            )}
          </div>
        </section>

        <section
          className={`rounded-xl bg-background px-6 py-6 text-sm text-muted-foreground ${
            hasPropertyOverview
              ? "dark:shadow-md"
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

            {hasPropertyOverview && taxpayerData?.possessions ? (
              <div className="grid grid-cols-1 gap-6 text-foreground md:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Total propriétés
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerData.possessions.length}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Sites actifs
                  </span>
                  <span className="text-lg font-semibold">
                    {
                      taxpayerData.possessions.filter(
                        (p) => !p.isDeleted && p.approvalStatus !== "REJECTED"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Projets en attente
                  </span>
                  <span className="text-lg font-semibold">
                    {
                      taxpayerData.possessions.filter(
                        (p) => p.approvalStatus === "PENDING"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 uppercase tracking-wide text-muted-foreground">
                    Dernière mise à jour
                  </span>
                  <span className="text-lg font-semibold">
                    {taxpayerData.updatedAt
                      ? new Date(taxpayerData.updatedAt).toLocaleDateString(
                          "fr-FR"
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-border/40 border-gray-300 dark:border-gray-700 bg-muted/20 uppercase tracking-wide text-muted-foreground">
                <div className="flex flex-col gap-2 items-center justify-center">
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

          <div className=" gap-4  flex flex-wrap md:justify-start justify-center items-start">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isDisabled = Boolean(action.disabled);
              const iconColor = isDisabled
                ? "text-muted-foreground"
                : action.accentText;
              const titleColor = isDisabled
                ? "text-muted-foreground"
                : action.accentText;
              const borderColor = isDisabled
                ? "border-border/40"
                : action.accentBorder;

              const href =
                action.href ||
                (action.recipeId ? `/list/create/${action.recipeId}` : "#");

              const buttonContent = (
                <button
                  className={`flex w-70 h-full flex-col rounded-lg border hover:border/70 p-6 text-left  transition ${
                    isDisabled
                      ? "cursor-not-allowed border-dashed border-border/40 text-muted-foreground opacity-70"
                      : `${borderColor} hover:${borderColor} hover:shadow-md cursor-pointer`
                  }`}
                  disabled={isDisabled}
                >
                  <div className="flex space-between items-start w-full">
                    <div className="flex flex-col gap-1 w-full">
                      <Icon className={`mb-4 size-8 ${iconColor}`} />
                      <span className={`text-lg font-semibold ${titleColor}`}>
                        {action.title}
                      </span>
                      <span className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {action.subtitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-bold">
                        {action?.recipeType || ""}
                      </span>
                    </div>
                  </div>
                </button>
              );

              if (isDisabled) {
                return <div key={index}>{buttonContent}</div>;
              }

              return (
                <Link key={index} href={href} className="contents">
                  {buttonContent}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
