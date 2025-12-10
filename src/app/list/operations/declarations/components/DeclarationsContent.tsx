"use client";

import { useOperations } from "@/hooks/useOperations";
import type { OperationView } from "@/types/operation-view.type";
import { Button } from "@/components/ui";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/atoms/loader";

type DeclarationsContentProps = {
  taxpayerId: string;
  initialData: OperationView[];
};

export default function DeclarationsContent({
  taxpayerId,
  initialData,
}: DeclarationsContentProps) {
  const router = useRouter();
  const {
    data: operations,
    isLoading,
    isError,
    refetch,
  } = useOperations(taxpayerId);

  const operationsData =
    operations && Array.isArray(operations) ? operations : initialData;

  console.log({ operationsData });
  console.log({ initialData });
  console.log({ operations });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return String(dateString);
    }
  };

  const handleRowClick = (item: OperationView) => {
    if (item.id) {
      // Extraire le type de déclaration depuis meta si disponible
      const meta = item.meta as Record<string, unknown> | undefined;
      const declarationType = meta?.declarationType as string | undefined;
      const type = declarationType || "operation";
      router.push(`/list/operations/declarations/${type}/${item.id}`);
    }
  };

  if (isLoading && initialData.length === 0) {
    return <Loader />;
  }

  if (isError) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            Impossible de charger les déclarations. Veuillez réessayer.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-0 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase text-muted-foreground">Opérations</p>
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
          <h1 className="text-3xl font-semibold">Déclarations</h1>
          <p className="text-sm text-muted-foreground">
            Vue dédiée aux déclarations fiscales (listes, formulaires,
            workflows).
          </p>
        </div>
      </div>

      {/* Tableau des opérations */}
      {operationsData.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
          Aucune opération trouvée.
        </div>
      ) : (
        <div className="rounded-xl border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Recipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {operationsData.map((item, index) => {
                  const meta = item.meta as Record<string, unknown> | undefined;
                  const declarationType = meta?.declarationType as
                    | string
                    | undefined;
                  const type = declarationType || "operation";

                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {String(item.id || "N/A")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {item.recipe ? item.recipe.name : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            item.status === "CLOSED"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : item.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : item.status === "REJECTED"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {item.totalAmount.toLocaleString("fr-FR")}{" "}
                        {item.currency?.symbol || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/list/operations/declarations/${type}/${item.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <Eye className="size-4" />
                          Voir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
