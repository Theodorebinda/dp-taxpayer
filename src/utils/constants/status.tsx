// ---------------------------------------------------------
// TYPES
// ---------------------------------------------------------
export type PaiementStatus =
  | "PENDING"
  | "REFUNDED"
  | "PAID"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "CANCELED"
  | "FAILED"
  | "CREATED";

export type OperationStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "CLOSED"
  | "REJECTED"
  | "REVERSED"
  | "POSED";

export type AnyStatus = PaiementStatus | OperationStatus;

// ---------------------------------------------------------
// LABEL FRANÇAIS
// ---------------------------------------------------------
export const getStatusLabel = (status: AnyStatus): string => {
  const mapping: Record<AnyStatus, string> = {
    // Paiement
    CREATED: "Créé",
    PENDING: "En attente",
    PARTIALLY_PAID: "Partiellement payé",
    PAID: "Payé",
    UNPAID: "Non payé",
    FAILED: "Échec du paiement",
    CANCELED: "Annulé",
    REFUNDED: "Remboursé",

    // Opérations
    POSED: "Déposé",
    IN_PROGRESS: "En cours de traitement",
    CLOSED: "Clôturé",
    REJECTED: "Rejeté",
    REVERSED: "Inversé",
  };

  return mapping[status] || "Statut inconnu";
};

// ---------------------------------------------------------
// COULEURS PRINCIPALES POUR ICONES/GRAPHIQUES
// ---------------------------------------------------------
export const getStatusColor = (status: AnyStatus): string => {
  switch (status) {
    case "PENDING":
      return "#facc15"; // jaune
    case "PARTIALLY_PAID":
      return "#fb923c"; // orange
    case "PAID":
    case "CLOSED":
      return "#22c55e"; // vert
    case "IN_PROGRESS":
      return "#6366f1"; // indigo
    case "POSED":
    case "CREATED":
      return "#3b82f6"; // bleu
    case "REFUNDED":
      return "#a855f7"; // violet
    case "UNPAID":
    case "FAILED":
    case "REJECTED":
      return "#ef4444"; // rouge
    case "CANCELED":
    case "REVERSED":
    default:
      return "#9ca3af"; // gris
  }
};

// ---------------------------------------------------------
// COULEURS TAILWIND POUR BADGES
// ---------------------------------------------------------
export const getStatusClasses = (status: AnyStatus): string => {
  switch (status) {
    // 🟡 EN ATTENTE
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

    // 🟠 PARTIEL
    case "PARTIALLY_PAID":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

    // 🟢 TERMINÉ
    case "PAID":
    case "CLOSED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    // 🔵 INITIALISÉ
    case "CREATED":
    case "POSED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

    // 🟣 REMBOURSEMENT
    case "REFUNDED":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

    // 🔵 TRAITEMENT
    case "IN_PROGRESS":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";

    // 🔴 PROBLÈME
    case "UNPAID":
    case "FAILED":
    case "REJECTED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    // ⚪ ANNULÉ / INVERSÉ
    case "CANCELED":
    case "REVERSED":
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300";
  }
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: AnyStatus;
  className?: string;
}) {
  return (
    <span
      className={`
        px-2 py-1 text-xs font-medium rounded
        ${getStatusClasses(status)}
        ${className}
      `}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export type FilterOption =
  | "latest"
  | "pending"
  | "paid"
  | "unpaid"
  | "closed"
  | "rejected";

export const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "latest", label: "Dernières opérations" },
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payées" },
  { value: "unpaid", label: "Non payées" },
  { value: "closed", label: "Fermées" },
  { value: "rejected", label: "Rejetées" },
];

export const getEmptyMessage = (filter: FilterOption) => {
  switch (filter) {
    case "pending":
      return {
        title: "Aucune opération en attente",
        description: "Vous n'avez pas d'opérations en attente pour le moment.",
      };
    case "paid":
      return {
        title: "Aucune opération payée",
        description: "Vous n'avez pas encore d'opérations payées.",
      };
    case "unpaid":
      return {
        title: "Aucune opération non payée",
        description: "Toutes vos opérations sont payées.",
      };
    case "closed":
      return {
        title: "Aucune opération fermée",
        description: "Vous n'avez pas d'opérations fermées.",
      };
    case "rejected":
      return {
        title: "Aucune opération rejetée",
        description: "Vous n'avez pas d'opérations rejetées.",
      };
    case "latest":
    default:
      return {
        title: "Aucune opération enregistrée",
        description: "Vous n'avez pas encore d'opérations sur votre compte.",
      };
  }
};
