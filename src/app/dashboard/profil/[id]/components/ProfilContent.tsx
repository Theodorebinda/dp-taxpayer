"use client";

import type { TaxpayerAccount } from "@/types/taxpayer-account.type";
import { useTaxpayer } from "@/hooks/useTaxpayer";
import Loader from "@/components/atoms/loader";
import { Button } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft, Phone, Calendar, User, Building2 } from "lucide-react";

type ProfilContentProps = {
  initialData: TaxpayerAccount | null;
  taxpayerId: string;
};

export default function ProfilContent({
  initialData,
  taxpayerId,
}: ProfilContentProps) {
  const {
    data: taxpayer,
    isLoading,
    isError,
    refetch,
  } = useTaxpayer(taxpayerId);

  const taxpayerData =
    taxpayer && typeof taxpayer === "object" ? taxpayer : initialData;

  if (isLoading && !initialData) {
    return <Loader />;
  }

  if (isError || (!taxpayerData && !isLoading)) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            Impossible de charger les informations du contribuable.
          </p>
        </div>
      </section>
    );
  }

  if (!taxpayerData) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-6 py-4 text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40">
          <p className="font-semibold">Aucune donnée disponible</p>
          <p className="text-sm">
            Les informations du contribuable ne sont pas disponibles.
          </p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="flex flex-col gap-6 p-0 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/overview">
            <Button variant="outline" size="small">
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          </Link>
          <Button
            variant="outline"
            size="small"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Actualiser
          </Button>
        </div>
        <div>
          <p className="text-sm uppercase text-muted-foreground">Profil</p>
          <h1 className="text-3xl font-semibold">Profil Assujetti</h1>
          <p className="text-sm text-muted-foreground">
            Informations détaillées du contribuable
          </p>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Carte Identité */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
            <User className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Identité</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Nom complet
              </span>
              <span className="text-base font-medium text-foreground">
                {taxpayerData.fullName || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Prénom
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.firstName || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Nom
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.lastName || "N/A"}
                </span>
              </div>
            </div>
            {taxpayerData.middleName && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Nom du milieu
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.middleName}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Identifiant unique (NIF)
              </span>
              <span className="text-base font-medium text-foreground">
                {taxpayerData.uniqueId || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Catégorie
              </span>
              <span className="text-base font-medium text-foreground">
                {taxpayerData.category === "PHYSIQUE"
                  ? "Personne physique"
                  : taxpayerData.category === "MORALE"
                  ? "Personne morale"
                  : taxpayerData.category || "N/A"}
              </span>
            </div>
            {taxpayerData.birthDate && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Date de naissance
                </span>
                <span className="text-base font-medium text-foreground">
                  {formatDate(taxpayerData.birthDate)}
                </span>
              </div>
            )}
            {taxpayerData.birthPlace && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Lieu de naissance
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.birthPlace}
                </span>
              </div>
            )}
            {taxpayerData.sex && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Sexe
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.sex}
                </span>
              </div>
            )}
            {taxpayerData.martialStatus && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Statut matrimonial
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.martialStatus}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Carte Contact */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
            <Phone className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Téléphone mobile
              </span>
              <span className="text-base font-medium text-foreground">
                {taxpayerData.mobile || "N/A"}
              </span>
            </div>
            {taxpayerData.email && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.email}
                </span>
              </div>
            )}
            {taxpayerData.physicalAddress && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Adresse physique
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.physicalAddress}
                </span>
              </div>
            )}
            {taxpayerData.identityCard && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Type de pièce d&apos;identité
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.identityCard}
                </span>
              </div>
            )}
            {taxpayerData.identityCardNumber && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Numéro de pièce d&apos;identité
                </span>
                <span className="text-base font-medium text-foreground">
                  {taxpayerData.identityCardNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Carte Informations système */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
            <Calendar className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Informations système
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Statut d&apos;approbation
              </span>
              <span className="text-base font-medium text-foreground">
                {taxpayerData.approvalStatus || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Date de création
              </span>
              <span className="text-base font-medium text-foreground">
                {formatDateTime(taxpayerData.createdAt)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Dernière mise à jour
              </span>
              <span className="text-base font-medium text-foreground">
                {formatDateTime(taxpayerData.updatedAt)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                ID du contribuable
              </span>
              <span className="text-sm font-mono text-foreground/70">
                {taxpayerData.id}
              </span>
            </div>
          </div>
        </div>

        {/* Carte Possessions */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
            <Building2 className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Possessions ({taxpayerData.possessions?.length ?? 0})
            </h2>
          </div>
          {taxpayerData.possessions && taxpayerData.possessions.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {taxpayerData.possessions.map((possession) => (
                <div
                  key={possession.id}
                  className="rounded-lg border border-border/40 bg-muted/20 p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {possession.uniqueNumber || "Sans numéro"}
                      </h3>
                      {possession.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {possession.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        possession.isVoucher
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {possession.isVoucher ? "Vignette" : "Autre"}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">
                        Opérations:{" "}
                      </span>
                      <span className="font-medium text-foreground">
                        {possession._count?.operations ?? 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Statut: </span>
                      <span className="font-medium text-foreground">
                        {possession.approvalStatus}
                      </span>
                    </div>
                  </div>
                  {possession.meta &&
                    Object.keys(possession.meta).length > 0 && (
                      <div className="mt-3 rounded border border-border/40 bg-background/50 p-2">
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">
                          Métadonnées:
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {Object.entries(possession.meta).map(
                            ([key, value]) => (
                              <div key={key}>
                                <span className="text-muted-foreground">
                                  {key}:{" "}
                                </span>
                                <span className="font-medium text-foreground">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border/40 bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Aucune possession enregistrée
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
