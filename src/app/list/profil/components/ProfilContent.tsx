"use client";

import type { TaxpayerAccount } from "@/types/taxpayer-account.type";
import { useTaxpayer } from "@/hooks/useTaxpayer";
import Loader from "@/components/atoms/loader";
import { Button, Accordion } from "@/components/ui";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Calendar,
  User,
  Edit2,
  ArrowRight,
} from "lucide-react";

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
      <div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <Link href="/list/overview">
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
            <h1 className="text-3xl font-semibold">
              {taxpayerData.fullName || "N/A"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Vos informations détaillées
            </p>
          </div>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-6 items-center w-full lg:justify-between justify-center lg:h-[calc(70vh-100px)]">
          {/* Photo de profil fixe à gauche */}
          <div className="lg:shrink-0 flex justify-center ">
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="mx-4 lg:mx-0 size-96 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-primary/20">
                    <User className="size-40 text-primary/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 w-full lg:w-auto max-w-2xl">
            <div className="w-full mx-auto">
              <Accordion
                items={[
                  {
                    title: "Identité",
                    icon: <User className="size-5" />,
                    defaultOpen: true,
                    children: (
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
                        <div className="pt-4  w-fit self-end">
                          <Button
                            variant="outline"
                            size="small"
                            className="w-full px-4 py-2"
                            onClick={() => {
                              // TODO: Implémenter la mise à jour de l'identité
                              console.log("Mettre à jour l'identité");
                            }}
                          >
                            <Edit2 className="size-4 mr-2" />
                            Mettre à jour
                          </Button>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Contact",
                    icon: <Phone className="size-5" />,
                    children: (
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
                        <div className="pt-4  w-fit self-end">
                          <Button
                            variant="outline"
                            size="small"
                            className="w-full px-4 py-2"
                            onClick={() => {
                              // TODO: Implémenter la mise à jour du contact
                              console.log("Mettre à jour le contact");
                            }}
                          >
                            <Edit2 className="size-4 mr-2" />
                            Mettre à jour
                          </Button>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Informations système",
                    icon: <Calendar className="size-5" />,
                    children: (
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
                        <div className="pt-4  w-fit self-end">
                          <Button
                            variant="outline"
                            size="small"
                            className="w-full px-4 py-2"
                            onClick={() => {
                              // TODO: Implémenter la mise à jour des informations système
                              console.log(
                                "Mettre à jour les informations système"
                              );
                            }}
                          >
                            <Edit2 className="size-4 mr-2" />
                            Mettre à jour
                          </Button>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end mt-4">
          <Button
            variant="outline"
            size="small"
            className="px-4 py-2"
            onClick={() => {
              // router.push("/list/property");
              console.log("Voir vos Biens");
            }}
          >
            Voir vos Biens <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
