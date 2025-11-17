"use client";

import { useMemo } from "react";
import Sidebar from "@/components/commons/sidebar";
import DisplayLayoutMenu from "@/components/menus/menu-display-layout";
import GridLayout from "@/components/menus/grid-layout";
import ListLayout from "@/components/menus/list-layout";
import { useApplications } from "@/hooks/use-applications";
import { useUiStore } from "@/store/ui-store";
import { ApplicationType } from "@/types/application.type";
import Button from "@/components/commons/button";

const DashboardPage = () => {
  const {
    data: applications = [],
    isPending,
    isError,
    error,
    refetch,
  } = useApplications();
  const displayLayout = useUiStore((state) => state.displayLayout);

  const content = useMemo(() => {
    if (isPending) {
      return <LoadingState />;
    }
    if (isError) {
      return (
        <ErrorState
          message={(error as Error)?.message || "Erreur inattendue"}
          onRetry={refetch}
        />
      );
    }
    if (!applications.length) {
      return <EmptyState />;
    }

    return displayLayout === "grid" ? (
      <GridLayout applications={applications} />
    ) : (
      <ListLayout applications={applications} />
    );
  }, [applications, displayLayout, error, isError, isPending, refetch]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase text-muted-foreground">Workspace</p>
            <h1 className="text-2xl font-semibold">Portail DigiPublic</h1>
            <p className="text-sm text-muted-foreground">
              Sélectionnez une application pour afficher ses menus et
              formulaires.
            </p>
          </div>
          <DisplayLayoutMenu />
        </header>
        {content}
      </main>
    </div>
  );
};

const LoadingState = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="h-40 rounded-xl bg-muted animate-pulse" />
    ))}
  </div>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
    <p className="text-base font-medium text-destructive">
      Impossible de charger les applications.
    </p>
    <code className="rounded-lg bg-background px-3 py-2 text-sm">
      {message}
    </code>
    <Button onClick={onRetry} variant="outline">
      Réessayer
    </Button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/40 p-10 text-center">
    <h2 className="text-lg font-semibold">Aucune application disponible</h2>
    <p className="max-w-md text-sm text-muted-foreground">
      Les applications assignées à votre espace apparaîtront ici dès
      qu&apos;elles seront disponibles.
    </p>
  </div>
);

export default DashboardPage;
