"use client";

import { ReactNode, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Sidebar from "@/components/commons/sidebar";
import { dashboardRoutes } from "../../lib/routes/routes";
import TopBanner from "@/components/commons/topBanner";

type DashboardLayoutProps = {
  children: ReactNode;
};

function getDefaultSegment(): string {
  return dashboardRoutes[0]?.segment ?? "overview";
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeSegment = useMemo(() => {
    const parts = pathname?.split("/") ?? [];
    const dashboardIndex = parts.indexOf("dashboard");
    return parts[dashboardIndex + 1] ?? getDefaultSegment();
  }, [pathname]);

  if (!pathname?.includes("/dashboard")) {
    return null;
  }

  if (!activeSegment) {
    router.replace(`/dashboard/${getDefaultSegment()}`);
    return null;
  }

  return (
    <div className="flex min-h-screen bg-(--dp-bg) dark:bg-app-blue-900 text-foreground">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-y-auto p-4 lg:p-8 md:max-w-7xl mx-auto">
        <div className="flex md:px-6 flex-col justify-start md:flex-row md:justify-between md:items-center  w-full">
          <div className="w-full md:w-1/2">
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

        {children}
      </main>
    </div>
  );
}
