"use client";

import { ReactNode, Suspense, useEffect, useRef } from "react";
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
  const hasRedirected = useRef(false);

  // Ne pas rediriger si on est sur une route valide
  // Les routes dynamiques comme /list/create/[recipeId] sont gérées par Next.js
  useEffect(() => {
    if (!pathname?.includes("/list")) {
      return;
    }

    // Éviter les redirections multiples
    if (hasRedirected.current) {
      return;
    }

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
        return;
      }

      // Rediriger vers le segment par défaut
      hasRedirected.current = true;
      router.replace(`/list/${getDefaultSegment()}`);
    }
  }, [pathname, router]);

  if (!pathname?.includes("/list")) {
    return null;
  }

  return (
    <div className="flex h-screen bg-(--dp-bg) dark:bg-app-blue-600 text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex flex-1  flex-col overflow-y-auto hide-scrollbar p-4 lg:p-8 md:max-w-7xl mx-auto min-w-0">
        <TopBanner />

        <div className="py-4 "> {children}</div>
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
