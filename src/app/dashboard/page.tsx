"use client";

import { useEffect } from "react";
import Sidebar from "@/components/commons/sidebar";
import Button from "@/components/commons/button";
import MenuCard from "@/components/menus/menu-card";
import { usePrimaryApplication } from "@/hooks/use-primary-application";
import { useApplicationMenus } from "@/hooks/use-application-menus";
import { useNavigationStore } from "@/store/navigation-store";

export default function DashboardPage() {
  const {
    data: application,
    isPending,
    isError,
    error,
    refetch,
  } = usePrimaryApplication();
  const {
    data: menus = [],
    isPending: menusPending,
    isError: menusError,
  } = useApplicationMenus(application?.id);
  const setCurrentApplicationId = useNavigationStore(
    (state) => state.setCurrentApplicationId
  );

  useEffect(() => {
    if (application) {
      setCurrentApplicationId(application.id);
    }
  }, [application, setCurrentApplicationId]);

  const isLoading = isPending || menusPending;

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (isError) {
      return (
        <ErrorState
          message={(error as Error)?.message || "Erreur inattendue"}
          onRetry={refetch}
        />
      );
    }
    if (!application) {
      return <EmptyApplicationState />;
    }
    if (menusError) {
      return (
        <ErrorState
          message="Impossible de charger les menus."
          onRetry={refetch}
        />
      );
    }
    if (menus.length === 0) {
      return <EmptyMenusState />;
    }

    return (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menus.map((menu) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            applicationId={application.id}
            applicationName={application.verbose || application.name}
          />
        ))}
      </section>
    );
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <header className="flex flex-col gap-3">
          <p className="text-sm uppercase text-muted-foreground">Workspace</p>
          <h1 className="text-3xl font-semibold">
            {application?.verbose || application?.name || "DigiPublic"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {application?.description ||
              "Accédez aux routes dynamiques exposées par votre administration fiscale."}
          </p>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

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
      {message || "Une erreur est survenue."}
    </p>
    <Button onClick={onRetry} variant="outline">
      Réessayer
    </Button>
  </div>
);

const EmptyApplicationState = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/40 p-10 text-center">
    <h2 className="text-lg font-semibold">Aucune application disponible</h2>
    <p className="max-w-md text-sm text-muted-foreground">
      Contactez votre administrateur pour activer votre portail.
    </p>
  </div>
);

const EmptyMenusState = () => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted-foreground/40 p-10 text-center">
    <h2 className="text-lg font-semibold">Aucun menu configuré</h2>
    <p className="max-w-md text-sm text-muted-foreground">
      Les routes exposées par l&apos;API apparaîtront automatiquement ici dès
      qu&apos;elles seront publiées.
    </p>
  </div>
);
