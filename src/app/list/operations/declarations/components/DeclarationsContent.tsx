"use client";

import { useOperations } from "@/hooks/useOperations";
import type { OperationView } from "@/types/operation-view.type";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/atoms/loader";
import { DataTable } from "@/components/table/dataTable";
import { DataTableColumnType } from "@/types/table";
import { useState, useCallback } from "react";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const [searchingError, setSearchingError] = useState<
    | {
        code: number;
        message: string;
        [key: string]: unknown;
      }
    | undefined
  >(undefined);

  // Colonnes du tableau
  const columns: DataTableColumnType<OperationView>[] = [
    {
      property: "id",
      verbose: "ID",
      type: "text",
    },
    {
      property: "recipe",
      verbose: "Recipe",
      type: "text",
      render: (value, item) => {
        return item.recipe?.name || "N/A";
      },
    },
    {
      property: "createdAt",
      verbose: "Date de création",
      type: "date",
      render: (value) => {
        if (!value) return "N/A";
        try {
          return new Date(value as string).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } catch {
          return String(value);
        }
      },
    },
    {
      property: "status",
      verbose: "Statut",
      type: "enum",
      enumOptions: [
        {
          key: "CLOSED",
          color: "green",
        },
        {
          key: "PENDING",
          color: "yellow",
        },
        {
          key: "REJECTED",
          color: "red",
        },
        {
          key: "IN_PROGRESS",
          color: "blue",
        },
      ],
    },
    {
      property: "totalAmount",
      verbose: "Montant",
      type: "numeric",
      render: (value, item) => {
        return `${(item.totalAmount || 0).toLocaleString("fr-FR")} ${
          item.currency?.symbol || ""
        }`;
      },
    },
  ];

  const handleRowSelect = useCallback(
    (selectedRows: OperationView[]) => {
      if (selectedRows.length > 0) {
        const item = selectedRows[0];
        const meta = item.meta as Record<string, unknown> | undefined;
        const declarationType = meta?.declarationType as string | undefined;
        const type = declarationType || "operation";
        router.push(`/list/operations/declarations/${type}/${item.id}`);
      }
    },
    [router]
  );

  const setRefreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  const setData = useCallback(() => {
    // Pas nécessaire pour l'instant
  }, []);

  const setError = useCallback(() => {
    // Pas nécessaire pour l'instant
  }, []);

  const setLoading = useCallback(() => {
    // Pas nécessaire pour l'instant
  }, []);

  const setCurrentPageHandler = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setRequestor = useCallback(() => {
    // Pas de recherche serveur pour l'instant
  }, []);

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

      {operationsData.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-sm text-muted-foreground">
          Aucune opération trouvée.
        </div>
      ) : (
        <div className="  overflow-hidden">
          <DataTable<OperationView>
            data={operationsData}
            columns={columns}
            dataLength={operationsData.length}
            setData={setData}
            setError={setError}
            setLoading={setLoading}
            setRefreshData={setRefreshData}
            searchable={true}
            searchKeys={["id", "recipe"]}
            onPageChange={onPageChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPageHandler}
            setRequestor={setRequestor}
            searching={searching}
            setSearching={setSearching}
            searchingError={searchingError}
            setSearchingError={setSearchingError}
            viewAction={{
              url: (id: string | number) =>
                `/list/operations/declarations/operation/${id}`,
              label: "Voir",
              active: true,
            }}
            onRowSelect={handleRowSelect}
          />
        </div>
      )}
    </section>
  );
}
