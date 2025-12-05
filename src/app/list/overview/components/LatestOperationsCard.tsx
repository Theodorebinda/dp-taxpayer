import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FormulaLine,
  OperationView,
  type PaiementStatus,
} from "@/types/operation-view.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/commons/operationViews.components";
import Link from "next/link";
import { Button } from "@/components/ui";
import {
  FILTER_OPTIONS,
  FilterOption,
  getEmptyMessage,
  StatusBadge,
} from "@/utils/constants/status";

interface LatestOperationsProps {
  operations?: OperationView[];
  maxDisplay?: number;
}

/**
 * Affiche une liste de cartes représentant les dernières opérations d'un assujetti.
 * @param {LatestOperationsProps}
 * @returns {JSX.Element}
 */
export const LatestOperationsCard: React.FC<LatestOperationsProps> = ({
  operations,
  maxDisplay = 4,
}) => {
  const [filter, setFilter] = useState<FilterOption>("latest");

  // Filtrer et trier les opérations selon le filtre sélectionné
  const filteredOperations = useMemo(() => {
    if (!operations || operations.length === 0) return [];

    let filtered = [...operations];

    // Appliquer le filtre
    switch (filter) {
      case "pending":
        filtered = filtered.filter((op) => op.status === "PENDING");
        break;
      case "paid":
        filtered = filtered.filter((op) => op.paiementStatus === "PAID");
        break;
      case "unpaid":
        filtered = filtered.filter((op) => op.paiementStatus === "UNPAID");
        break;
      case "closed":
        filtered = filtered.filter((op) => op.status === "CLOSED");
        break;
      case "rejected":
        filtered = filtered.filter((op) => op.status === "REJECTED");
        break;
      case "latest":
      default:
        // Par défaut, trier par date décroissante (les plus récentes en premier)
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [operations, filter]);

  const displayOperations = filteredOperations.slice(0, maxDisplay) || [];
  const hasOperations = displayOperations.length > 0;
  const remainingOperations = filteredOperations
    ? filteredOperations.length - displayOperations.length
    : 0;

  // Variantes d'animation pour le conteneur
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Variantes d'animation pour chaque carte
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  };

  // Composant pour une seule opération
  const OperationItem: React.FC<{ operation: OperationView }> = ({
    operation,
  }) => {
    // Nom du bureau/étape pour une meilleure information
    const officeName =
      operation.operationRecipeStepOffices?.[0]?.office?.name ||
      operation.operationRecipeStepOffices?.[0]?.recipeStep?.step?.name ||
      "Bureau/Étape N/A";

    // Les détails de la formule si disponibles (pour l'impôt foncier)
    const formulaResult = operation.meta?.formulaResult?.lines || [];
    const mainTax =
      formulaResult.find((line: FormulaLine) =>
        line.label.includes("Impôt Foncier")
      ) || formulaResult.find((line: FormulaLine) => line.total > 0);

    return (
      <Card className="hover:shadow-lg transition-shadow duration-200 shadow-md">
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
          <span className={`rounded-full px-3 py-1 text-sm font-medium `}>
            <StatusBadge status={operation.status} />
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
            <span className={`rounded-full px-2 py-0.5 font-medium `}>
              <StatusBadge
                status={operation.paiementStatus as PaiementStatus}
              />
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
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
            className="px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className=" grow  pt-0">
        <AnimatePresence mode="wait">
          {hasOperations ? (
            <motion.div
              key={`operations-${filter}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {/* Grille des Opérations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayOperations.map((operation) => (
                  <motion.div key={operation.id} variants={itemVariants} layout>
                    <OperationItem operation={operation} />
                  </motion.div>
                ))}
              </div>

              {/* Lien pour voir plus si nécessaire */}
              {remainingOperations > 0 && (
                <motion.div
                  key={`more-${filter}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-center pt-2"
                >
                  <Link href="/list/operations">
                    <Button variant="outline" size="small">
                      Voir {remainingOperations} opération(s) supplémentaire(s)
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${filter}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-dashed text-center bg-muted/20"
            >
              {(() => {
                const emptyMessage = getEmptyMessage(filter);
                return (
                  <div className="flex flex-col gap-2 p-4">
                    <span className="text-xl font-semibold text-gray-500">
                      {emptyMessage.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {emptyMessage.description}
                    </span>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default LatestOperationsCard; // Ou export const
