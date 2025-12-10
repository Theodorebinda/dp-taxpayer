"use client";

import type { OperationView } from "@/types/operation-view.type";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type OperationDetailContentProps = {
  id: string;
  initialData: OperationView;
};

export default function OperationDetailContent({
  initialData,
}: OperationDetailContentProps) {
  const operation = initialData;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateString);
    }
  };

  return (
    <section className="flex flex-col gap-6 p-0 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase text-muted-foreground">Opérations</p>
        <div className="flex items-center gap-4">
          <Link href="/list/operations/declarations">
            <Button variant="outline" size="small">
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            Opération {operation.serialNumber || operation.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            Détails de l&apos;opération fiscale
          </p>
        </div>
      </div>

      {/* Données de l'opération */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Carte Informations principales */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
            <h2 className="text-xl font-semibold text-foreground">
              Informations principales
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                ID
              </span>
              <span className="text-base font-medium text-foreground">
                {operation.id}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Numéro de série
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.serialNumber || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Raison
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.reason || "N/A"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Action
              </span>
              <span className="text-base font-medium text-foreground">
                {operation.action}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Statut
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium w-fit ${
                  operation.status === "CLOSED"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : operation.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : operation.status === "REJECTED"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {operation?.status}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Statut de paiement
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.paiementStatus}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Date de création
              </span>
              <span className="text-base font-medium text-foreground">
                {formatDate(operation?.createdAt)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Dernière mise à jour
              </span>
              <span className="text-base font-medium text-foreground">
                {formatDate(operation?.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Carte Montants et Recipe */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-border/40 pb-3">
            <h2 className="text-xl font-semibold text-foreground">
              Montants et Recipe
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Montant total
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.totalAmount?.toLocaleString("fr-FR")}{" "}
                {operation?.currency?.symbol || ""}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Montant payé
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.paiedAmount?.toLocaleString("fr-FR")}{" "}
                {operation?.currency?.symbol || ""}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Recipe
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.recipe?.name}
              </span>
            </div>
            {operation?.recipe?.description && (
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Description
                </span>
                <span className="text-base font-medium text-foreground">
                  {operation?.recipe?.description}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Organisation
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.organization?.name}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Entité
              </span>
              <span className="text-base font-medium text-foreground">
                {operation?.entity?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
