"use client";

import { ReactNode, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Sidebar from "@/components/commons/sidebar";
import { dashboardRoutes } from "../../lib/routes/routes";
import TopBanner from "@/components/commons/topBanner";
import { Loader } from "@/components/ui";

type DashboardLayoutProps = {
  children: ReactNode;
};

function getDefaultSegment(): string {
  return dashboardRoutes[0]?.segment ?? "overview";
}

function DashboardLayoutInner({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (!pathname?.includes("/list")) {
    return null;
  }

  // Ne pas rediriger si on est sur une route valide
  // Les routes dynamiques comme /list/create/[recipeId] sont gérées par Next.js
  const parts = pathname?.split("/") ?? [];
  const dashboardIndex = parts.indexOf("list");
  const segment = parts[dashboardIndex + 1];

  // Routes valides : overview, profil, settings, operations, create
  const validSegments = [
    "overview",
    "profil",
    "settings",
    "operations",
    "create",
  ];

  // Ne rediriger que si le segment n'est pas valide ET qu'on n'est pas sur une route dynamique
  if (segment && !validSegments.includes(segment)) {
    // Vérifier si c'est une route dynamique (ex: /list/create/[recipeId])
    if (pathname.includes("/create/") || pathname.includes("/operations/")) {
      // Laisser Next.js gérer la route dynamique
    } else {
      router.replace(`/list/${getDefaultSegment()}`);
      return null;
    }
  }

  return (
    <div className="flex h-screen bg-(--dp-bg) dark:bg-app-blue-900 text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-y-auto hide-scrollbar p-4 lg:p-8 md:max-w-7xl mx-auto min-w-0">
        <div className="flex md:px-6 flex-col justify-start md:flex-row md:justify-between md:items-center  w-full">
          <div className=" hidden w-full md:w-1/2 md:block">
            <label
              className="relative flex-1"
              aria-label="Recherche dans le tableau de bord"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher dans le tableau de bord..."
                className="w-full rounded-lg border bg-background/60 py-2 pl-10 pr-4 text-sm outline-none ring-offset-background transition focus:border-transparent focus:ring-2 focus:ring-primary/60"
              />
            </label>
          </div>
          <TopBanner />
        </div>
        <div className="  mb-4 block md:hidden w-full">
          <label
            className="relative flex-1"
            aria-label="Recherche dans le tableau de bord"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher dans le tableau de bord..."
              className="w-full rounded-lg border bg-background/60 py-2 pl-10 pr-4 text-sm outline-none ring-offset-background transition focus:border-transparent focus:ring-2 focus:ring-primary/60"
            />
          </label>
        </div>
        <div className="py-4"> {children}</div>
      </main>
    </div>
  );
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardLayoutInner {...props} />
    </Suspense>
  );
}
