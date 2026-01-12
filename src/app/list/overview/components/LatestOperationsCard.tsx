import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, HelpCircle } from "lucide-react";
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
import { Button, Dialog } from "@/components/ui";
import { Tooltip } from "@/components/atoms/tooltip";
import { PaymentWizard } from "@/components/ui/modules/payment-mode/payment-mode";
import {
  FILTER_OPTIONS,
  FilterOption,
  getEmptyMessage,
  getStatusLabel,
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
  const router = useRouter();
  const [filter, setFilter] = useState<FilterOption>("latest");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] =
    useState<OperationView | null>(null);

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

  // Composant pour l'icône de statut de paiement avec tooltip
  const PaymentStatusIcon: React.FC<{ status: PaiementStatus }> = ({
    status,
  }) => {
    const isPaid = status === "PAID";
    const statusLabel = getStatusLabel(status);

    return (
      <Tooltip
        content={statusLabel}
        position="top"
        trigger="both"
        minWidth="120px"
        variant="dark"
      >
        <button
          type="button"
          className="focus:outline-none"
          aria-label={`Statut de paiement: ${statusLabel}`}
        >
          {isPaid ? (
            <CheckCircle2
              size={18}
              className="text-green-500 cursor-pointer transition-colors hover:text-green-600"
            />
          ) : (
            <HelpCircle
              size={18}
              className="text-gray-400 cursor-pointer transition-colors hover:text-gray-600"
            />
          )}
        </button>
      </Tooltip>
    );
  };

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

  // Handler pour ouvrir le dialog de paiement
  const handleOpenPaymentDialog = (operation: OperationView) => {
    setSelectedOperation(operation);
    setIsPaymentDialogOpen(true);
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

    const isPaid = operation.paiementStatus === "PAID";
    const isClickable = !isPaid;

    const cardContent = (
      <Card
        className={`transition-all duration-200 shadow-md ${
          isClickable ? "hover:shadow-lg hover:scale-[1.02]" : "hover:shadow-lg"
        }`}
      >
        <CardHeader className=" flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex flex-col">
            <CardTitle className="text-base flex flex-row items-center gap-2">
              <span className="text-muted-foreground/80">
                {operation.reason || operation.action}
              </span>
              <PaymentStatusIcon status={operation.paiementStatus} />
            </CardTitle>
            <p className="text-sm text-muted-foreground/80">
              N° {operation.serialNumber || "N/A"}
            </p>
          </div>

          {/* Badge de Statut operation */}
          <span className={`rounded-full px-3 py-1 text-sm font-medium `}>
            <StatusBadge status={operation.status} />
          </span>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
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
              {/* <StatusBadge
                status={operation.paiementStatus as PaiementStatus}
              /> */}
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

    if (isClickable) {
      return (
        <div
          onClick={() => handleOpenPaymentDialog(operation)}
          className="cursor-pointer"
        >
          {cardContent}
        </div>
      );
    }

    return cardContent;
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayOperations.map((operation) => (
                  <motion.div key={operation.id} variants={itemVariants} layout>
                    <OperationItem operation={operation} />
                  </motion.div>
                ))}
              </div>

              {remainingOperations > 0 && (
                <motion.div
                  key={`more-${filter}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-center pt-2"
                >
                  <Link href="/list/operations/declarations">
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

      {/* Dialog de paiement */}
      <Dialog
        isOpen={isPaymentDialogOpen}
        onClose={() => {
          setIsPaymentDialogOpen(false);
          setSelectedOperation(null);
        }}
        title={` Paiement de ${
          selectedOperation?.reason || selectedOperation?.action
        } - N° ${selectedOperation?.serialNumber || "N/A"}`}
        size="xl"
      >
        {selectedOperation && (
          <PaymentWizard
            operationId={selectedOperation.id}
            defaultAmount={selectedOperation.totalAmount}
            onSuccess={() => {
              setIsPaymentDialogOpen(false);
              setSelectedOperation(null);
              // Les données du sessionStorage sont déjà supprimées dans handleSubmit
              // Rediriger vers l'accueil
              router.push("/list/overview");
            }}
            onCancel={() => {
              setIsPaymentDialogOpen(false);
              setSelectedOperation(null);
            }}
          />
        )}
      </Dialog>
    </Card>
  );
};

export default LatestOperationsCard;
