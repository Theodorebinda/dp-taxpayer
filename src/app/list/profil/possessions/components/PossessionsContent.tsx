"use client";

import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, Loader } from "@/components/ui";
import { useTaxpayer } from "@/hooks/useTaxpayer";
import type { TaxpayerPossession } from "@/types/taxpayer-account.type";
import PossessionItem from "./PossessionItem";
import { motion } from "framer-motion";
import DataTablePagination from "@/components/table/dataTablePagination";

interface PossessionsContentProps {
  initialData?: TaxpayerPossession[];
  taxpayerId: string;
  totalPossessions?: number;
}

const ITEMS_PER_PAGE = 10;

export default function PossessionsContent({
  initialData,
  taxpayerId,
  totalPossessions,
}: PossessionsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculer skip et limit pour la pagination
  const paginationParams = useMemo(() => {
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    return {
      skip,
      limit: ITEMS_PER_PAGE,
    };
  }, [currentPage]);

  const {
    data: taxpayerData,
    isLoading,
    error,
    refetch,
  } = useTaxpayer(taxpayerId, paginationParams);

  // Utiliser les données du hook si disponibles, sinon utiliser les données initiales
  const possessions =
    taxpayerData &&
    typeof taxpayerData === "object" &&
    "possessions" in taxpayerData
      ? taxpayerData.possessions
      : initialData ?? [];

  // Calculer si on doit afficher la pagination
  const shouldShowPagination =
    totalPossessions !== undefined &&
    totalPossessions > 0 &&
    totalPossessions > ITEMS_PER_PAGE;

  if (isLoading) {
    return (
      <div className="mx-auto p-4 md:p-8">
        <div className="flex flex-col justify-start items-start gap-2">
          <div className="flex flex-col justify-start items-start gap-4">
            <div className="flex justify-start items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/list/overview">
                  <Button variant="outline" size="small">
                    <ArrowLeft className="size-4" />
                    Retour
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="small"
                  //   onClick={() => refetch()}
                  disabled={isLoading}
                >
                  Actualiser
                </Button>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-semibold">Vos biens</h1>
            <p className="text-sm text-muted-foreground">Vos biens détaillés</p>
          </motion.div>
        </div>

        <div className="flex justify-center pt-12">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-4 md:p-8">
        <div className="flex flex-col justify-start items-start gap-2">
          <div className="flex flex-col justify-start items-start gap-4">
            <div className="flex justify-start items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/list/overview">
                  <Button variant="outline" size="small">
                    <ArrowLeft className="size-4" />
                    Retour
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="small"
                  //   onClick={() => refetch()}
                  disabled={isLoading}
                >
                  Actualiser
                </Button>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-semibold">Vos biens</h1>
            <p className="text-sm text-muted-foreground">Vos biens détaillés</p>
          </motion.div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40 my-6">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            {error instanceof Error
              ? error.message
              : "Erreur lors du chargement des possessions"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6">
      <div className="flex flex-col justify-start items-start gap-2">
        <div className="flex flex-col justify-start items-start gap-4">
          <div className="flex justify-start items-start gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/list/overview">
                <Button variant="outline" size="small">
                  <ArrowLeft className="size-4" />
                  Retour
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="small"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                Actualiser
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-3xl font-semibold">Vos biens</h1>
          <p className="text-sm text-muted-foreground">Vos biens détaillés</p>
        </motion.div>
      </div>

      {possessions.length === 0 ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-6 py-4 text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40 my-6">
          <p className="font-semibold">Aucun bien trouvé</p>
          <p className="text-sm">
            Vous n&apos;avez enregistré aucun bien pour le moment.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {possessions.map((possession) => (
              <PossessionItem key={possession.id} possession={possession} />
            ))}
          </div>
          {/* Pagination */}
          {shouldShowPagination && (
            <div className="mt-6">
              <DataTablePagination
                dataLength={totalPossessions}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  // Scroll to top when page changes
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
