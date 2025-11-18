"use client";

import { ReactNode, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LuMenu } from "react-icons/lu";
import Sidebar from "@/components/commons/sidebar";
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
        {children}
      </main>
    </div>
  );
}
