import React from "react";
import {
  OperationView,
  type PaiementStatus,
  type OperationStatus,
} from "@/types/operation-view.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/commons/operationViews.components";
import Link from "next/link";
import { Button } from "@/components/ui";

const getStatusClasses = (status: OperationStatus | PaiementStatus) => {
  switch (status) {
    case "PENDING":
    case "PARTIALLY_PAID":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "PAID":
    case "CLOSED":
    case "POSED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "UNPAID":
    case "REJECTED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "REFUNDED":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "CANCELED":
    case "REVERSED":
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300";
  }
};

interface LatestOperationsProps {
  operations?: OperationView[];
  maxDisplay?: number;
}

/**
 * Affiche une liste de cartes représentant les dernières opérations d'un assujetti.
 * @param {LatestOperationsProps} { operations, maxDisplay }
 * @returns {JSX.Element}
 */
export const LatestOperationsCard: React.FC<LatestOperationsProps> = ({
  operations,
  maxDisplay = 4,
}) => {
  const displayOperations = operations?.slice(0, maxDisplay) || [];
  const hasOperations = displayOperations.length > 0;
  const remainingOperations = operations
    ? operations.length - displayOperations.length
    : 0;

  // Composant pour une seule opération
  const OperationItem: React.FC<{ operation: OperationView }> = ({
    operation,
  }) => {
    const statusClass = getStatusClasses(operation.status);
    const paymentStatusClass = getStatusClasses(operation.paiementStatus);

    // Nom du bureau/étape pour une meilleure information
    const officeName =
      operation.operationRecipeStepOffices?.[0]?.office?.name ||
      operation.operationRecipeStepOffices?.[0]?.recipeStep?.step?.name ||
      "Bureau/Étape N/A";

    // Les détails de la formule si disponibles (pour l'impôt foncier)
    const formulaResult = operation.meta?.formulaResult?.lines || [];
    const mainTax =
      formulaResult.find((line: any) => line.label.includes("Impôt Foncier")) ||
      formulaResult.find((line: any) => line.total > 0);

    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className=" flex flex-row items-center justify-between space-y-0 pb-2">
          {/* Titre et Numéro de Série */}
          <div className="flex flex-col">
            <CardTitle className="text-base">
              {operation.reason || operation.action}
            </CardTitle>
            <p className="text-sm text-muted-foreground/80">
              N° {operation.serialNumber || "N/A"}
            </p>
          </div>

          {/* Badge de Statut Principal */}
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass}`}
          >
            {operation.status}
          </span>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          {/* Informations Clés */}
          <div className="grid grid-cols-2 gap-2 ">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Recette
              </span>
              <span className="font-semibold text-foreground">
                {operation.currency?.symbol}{" "}
                {mainTax?.total?.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ||
                  operation.totalAmount.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-muted-foreground">
                Payé
              </span>
              <span className="font-semibold text-foreground">
                {operation.currency?.symbol}{" "}
                {operation.paiedAmount.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Ligne de Séparation */}
          <hr className="border-t border-border/60" />

          {/* Statut de Paiement et Date */}
          <div className="flex items-center justify-between text-sm">
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${paymentStatusClass}`}
            >
              {operation.paiementStatus.replace(/_/g, " ")}
            </span>
            <span className="text-muted-foreground">
              {new Date(operation.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Lieu de l'Opération */}
          <div className="flex items-center text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{officeName}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className=" flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1 mb-4">
          <CardTitle className="text-xl font-semibold text-foreground">
            Dernières Opérations
          </CardTitle>
          <p className="text-sm text-muted-foreground/70">
            Historique des opérations fiscales récentes
          </p>
        </div>
        <Link href="/list/operations">
          <Button variant="outline" size="small">
            Voir toutes
          </Button>
        </Link>
      </CardHeader>

      <CardContent className=" grow  pt-0">
        {hasOperations ? (
          <div className="space-y-4">
            {/* Grille des Opérations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayOperations.map((operation) => (
                <OperationItem key={operation.id} operation={operation} />
              ))}
            </div>

            {/* Lien pour voir plus si nécessaire */}
            {remainingOperations > 0 && (
              <div className="text-center pt-2">
                <Link href="/list/operations">
                  <Button variant="outline" size="small">
                    Voir {remainingOperations} opération(s) supplémentaire(s)
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* État : Aucune Opération */
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-dashed text-center bg-muted/20">
            <div className="flex flex-col gap-2 p-4">
              <span className="text-xl font-semibold text-gray-500">
                Aucune opération enregistrée
              </span>
              <span className="text-sm text-muted-foreground">
                Vous n&apos;avez pas encore d&apos;opérations sur votre compte.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestOperationsCard; // Ou export const
