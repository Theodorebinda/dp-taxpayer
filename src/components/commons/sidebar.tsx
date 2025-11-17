"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LuX } from "react-icons/lu";
import appLogo from "@/../public/logo/icon.png";
import { usePrimaryApplication } from "@/hooks/use-primary-application";
import { useApplicationMenus } from "@/hooks/use-application-menus";
import { useNavigationStore } from "@/store/navigation-store";
import { useUiStore } from "@/store/ui-store";
import { SideMenuType } from "@/types/application.type";
import NavSection from "../atoms/navBarSection";
import Button from "./button";

const HIDDEN_PATHS = ["/auth/login"];

const SidebarLoader = () => (
  <div className="flex w-full flex-col gap-4 p-5">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-10 w-full rounded-md bg-muted animate-pulse"
      />
    ))}
  </div>
);

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isResizing, setIsResizing] = useState(false);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const sidebarWidth = useUiStore((state) => state.sidebarWidth);
  const setSidebarWidth = useUiStore((state) => state.setSidebarWidth);
  const [isMobile, setIsMobile] = useState(false);
  const { setCurrentApplicationId, setCurrentMenuId } = useNavigationStore();

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

  useEffect(() => {
    if (application) {
      setCurrentApplicationId(application.id);
    }
  }, [application, setCurrentApplicationId]);

  useEffect(() => {
    if (!menus?.length || menusPending) return;
    const currentMenu = useNavigationStore.getState().currentMenuId;
    if (!currentMenu) {
      setCurrentMenuId(menus[0]?.id ?? null);
    }
  }, [menus, menusPending, setCurrentMenuId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing) return;
      const nextWidth = Math.min(Math.max(event.clientX, 240), 480);
      setSidebarWidth(nextWidth);
    },
    [isResizing, setSidebarWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isResizing]);

  if (HIDDEN_PATHS.includes(pathname)) {
    return null;
  }

  if (pathname === "/") {
    return <span />;
  }

  const computedWidth = isMobile ? "100%" : sidebarWidth;
  const showError = isError || (!application && !isPending);
  const showMenus = !showError && !menusError && menus.length > 0;

  return (
    <>
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-40 flex h-screen flex-col border-r bg-background text-foreground shadow-xl transition-transform duration-200 lg:static lg:translate-x-0`}
        style={{ width: computedWidth }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <button className="rounded-lg border p-2">
            <Image
              src={appLogo}
              alt="digipublic logo"
              width={48}
              height={48}
              className="w-12"
            />
          </button>
          <span className="text-lg font-semibold">
            {application?.verbose || application?.name || "Portail"}
          </span>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <LuX size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {isPending || menusPending ? (
              <SidebarLoader />
            ) : showError ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Impossible de charger l&apos;application.
                </p>
                <code className="rounded-md bg-muted px-3 py-2 text-xs">
                  {(error as Error)?.message}
                </code>
                <Button onClick={() => refetch()} variant="outline">
                  Réessayer
                </Button>
              </div>
            ) : showMenus ? (
              <nav className="flex flex-col gap-1">
                {menus.map((menu: SideMenuType) => (
                  <NavSection {...menu} key={menu.id} />
                ))}
              </nav>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                Aucun menu disponible pour cette application.
              </div>
            )}
          </div>
        </div>
      </aside>

      {!isMobile && (
        <div
          className="hidden cursor-ew-resize items-center px-1 text-muted-foreground lg:flex"
          onMouseDown={handleMouseDown}
        >
          <span className="h-12 w-1 rounded-full bg-primary/40" />
        </div>
      )}
    </>
  );
};

export default Sidebar;
