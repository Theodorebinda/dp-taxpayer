"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LuChevronDown, LuMenu, LuX } from "react-icons/lu";
import appLogo from "@/../public/logo/icon.png";
import { useUiStore } from "@/store/ui-store";
import { MenuItemType } from "@/types/menu";
import {
  findAllParent,
  getMenuItemFromURL,
  getMenuItems,
} from "@/lib/menu/helpers";
import * as RiIcons from "react-icons/ri";
import { IconType } from "react-icons";

const HIDDEN_PATHS = ["/auth/login"];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isResizing, setIsResizing] = useState(false);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const sidebarWidth = useUiStore((state) => state.sidebarWidth);
  const setSidebarWidth = useUiStore((state) => state.setSidebarWidth);
  const [isMobile, setIsMobile] = useState(false);
  const menuItems = useMemo(() => getMenuItems(), []);
  const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);
  const [activeUrl, setActiveUrl] = useState<string>("");

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
      const nextWidth = Math.min(Math.max(event.clientX, 240), 460);
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

  useEffect(() => {
    const currentItem = pathname
      ? getMenuItemFromURL(menuItems, pathname)
      : null;
    if (!currentItem) return;

    const frame = requestAnimationFrame(() => {
      const parents = findAllParent(menuItems, currentItem);
      setActiveMenuItems(Array.from(new Set([...parents, currentItem.key])));
      setActiveUrl(currentItem.url ?? "");
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, menuItems]);

  const computedWidth = isMobile ? "100%" : sidebarWidth;

  const toggleMenu = useCallback((item: MenuItemType) => {
    if (!item.children || item.children.length === 0) return;
    setActiveMenuItems((prev) =>
      prev.includes(item.key)
        ? prev.filter((key) => key !== item.key)
        : [...prev, item.key]
    );
  }, []);

  const handleNavigate = useCallback(
    (item: MenuItemType) => {
      if (item.url) {
        router.push(item.url);
        setActiveUrl(item.url);
        if (isMobile) setSidebarOpen(false);
      }
    },
    [router, isMobile, setSidebarOpen]
  );

  const renderIcon = (icon?: string) => {
    if (!icon) {
      const DefaultIcon = RiIcons.RiDashboard2Line;
      return <DefaultIcon className="size-4" />;
    }
    const [prefix, name] = icon.split(":");
    if (prefix === "ri") {
      const pascal =
        "Ri" +
        name
          .split("-")
          .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
          .join("");
      const IconComponent =
        (RiIcons as Record<string, IconType>)[pascal] ||
        (RiIcons as Record<string, IconType>)[`${pascal}Line`];
      if (IconComponent) {
        return <IconComponent className="size-4" />;
      }
    }
    const Fallback = RiIcons.RiDashboard2Line;
    return <Fallback className="size-4" />;
  };

  const renderMenuItems = (items: MenuItemType[], depth = 0) =>
    items.map((item) => {
      if (item.isTitle) {
        return (
          <p
            key={item.key}
            className="mt-6 mb-2 text-xs font-semibold uppercase text-muted-foreground"
          >
            {item.label}
          </p>
        );
      }

      const hasChildren = !!item.children && item.children.length > 0;
      const isOpen = activeMenuItems.includes(item.key);
      const isActive = item.url && activeUrl === item.url;

      return (
        <div key={item.key} className="space-y-1">
          <button
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left  transition ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            } ${item.isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() =>
              hasChildren ? toggleMenu(item) : handleNavigate(item)
            }
            disabled={item.isDisabled}
          >
            <span className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-md bg-muted">
                {renderIcon(item.icon)}
              </span>
              <span>{item.label}</span>
            </span>
            {hasChildren && (
              <LuChevronDown
                className={`size-4 transition ${isOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>
          {hasChildren && isOpen && (
            <div className="space-y-1 pl-5">
              {renderMenuItems(item.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  if (HIDDEN_PATHS.includes(pathname ?? "")) {
    return null;
  }

  if (pathname === "/") {
    return <span />;
  }

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
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border p-2 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer la navigation"
            >
              <LuX size={20} />
            </button>
            <button
              className="hidden rounded-lg border p-2 lg:inline-flex"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              aria-label="Basculer la navigation"
            >
              <LuMenu size={20} />
            </button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <nav className="flex flex-col gap-1">
              {renderMenuItems(menuItems)}
            </nav>
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
