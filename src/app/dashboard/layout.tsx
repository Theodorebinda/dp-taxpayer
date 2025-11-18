"use client";

import { ReactNode, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LuMenu } from "react-icons/lu";
import { Bell, Search } from "lucide-react";
import Sidebar from "@/components/commons/sidebar";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import LogoutButton from "@/components/ui/LogoutButton";
import { dashboardRoutes } from "../../lib/routes/routes";
import { useUiStore } from "@/store/ui-store";

type DashboardLayoutProps = {
  children: ReactNode;
};

function getDefaultSegment(): string {
  return dashboardRoutes[0]?.segment ?? "overview";
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

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
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-y-auto p-4 lg:p-8">
        <button
          className="mb-4 flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <LuMenu className="size-4" />
          Menu
        </button>
        <div className="mb-6 flex w-full flex-col  md:px-6 md:flex-row lg:items-center md:justify-between">
          {" "}
          <div className="flex justify-between items-center w-full">
            <div className="w-1/3">
              {" "}
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
              </label>{" "}
            </div>

            <div className="">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="relative inline-flex size-10 items-center justify-center rounded-full border border-foreground/10 bg-background/70 text-foreground transition hover:border-foreground/30"
                  aria-label="Voir les notifications"
                >
                  <Bell className="size-4" />
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold">
                    3
                  </span>
                </button>
                <ThemeSwitcher />
                <LogoutButton variant="ghost" label="Déconnexion" />
              </div>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
