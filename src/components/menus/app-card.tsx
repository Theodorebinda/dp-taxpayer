"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ApplicationType } from "@/types/application.type";
import SVGComponent from "../atoms/displaySVG";
import { usePrefetchMenus } from "@/hooks/use-prefetch-menus";
import { useNavigationStore } from "@/store/navigation-store";

type ApplicationCardProps = {
  application: ApplicationType;
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();
  const prefetchMenus = usePrefetchMenus(application.id);
  const isActiveApp =
    application.isActive && (application.menus ?? []).length > 0;
  const {
    currentApplicationId,
    setCurrentApplicationId,
    pendingApplicationId,
    setPendingApplicationId,
  } = useNavigationStore();

  const isSelected = currentApplicationId === application.id;
  const isNavigating = pendingApplicationId === application.id;

  const primaryActionPath = useMemo(() => {
    return (
      application.menus?.[0]?.menuActions?.[0]?.action?.path ?? application.name
    );
  }, [application]);

  const handleOpen = () => {
    if (!isActiveApp) return;
    setPendingApplicationId(application.id);
    setCurrentApplicationId(application.id);
    router.push(primaryActionPath);
    setTimeout(() => setPendingApplicationId(null), 300);
  };

  return (
    <button
      onClick={handleOpen}
      onMouseEnter={prefetchMenus}
      onFocus={prefetchMenus}
      className={`group relative w-full rounded-xl border p-5 text-left transition-all ${
        isActiveApp
          ? "hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          : "opacity-60 cursor-not-allowed"
      } ${isSelected ? "border-primary shadow-lg" : "border-border"}`}
    >
      <div
        className={`mb-6 flex h-24 w-full items-center justify-center rounded-lg ${
          isActiveApp
            ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <SVGComponent width="40" height="40" icon={application.icon} />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-semibold">
          {application.verbose?.toUpperCase() ||
            application.name?.toUpperCase()}
        </p>
        <p className="text-sm text-muted-foreground">
          {application.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{application.menus?.length ?? 0} menus</span>
        <span className="font-medium text-primary">
          {isActiveApp ? "Ouvrir" : "Indisponible"}
        </span>
      </div>

      {isNavigating && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </button>
  );
}
