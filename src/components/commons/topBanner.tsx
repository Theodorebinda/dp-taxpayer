"use client";
import { useUiStore } from "../store/sidebarState";
import ThemeToggleButton from "../atoms/themeToggleButton";
import { greeting } from "@/utils/utils";
import { LuMenu, LuX } from "react-icons/lu";
import { Bell, LogOut, Search, User2 } from "lucide-react";
import LogoutButton from "../ui/LogoutButton";
import { useSession } from "next-auth/react";

const TopBanner = () => {
  const { data: session } = useSession();
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  const userName = (session?.user as { name?: string } | undefined)?.name;

  return (
    <div className="flex md:px-6 flex-col justify-start md:flex-row md:justify-between md:items-center  w-full">
      <div className="hidden   w-full md:w-1/2 md:flex justify-start gap-3">
        <div className="flex items-center gap-2">
          <button
            className="hidden w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium lg:flex"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <LuX className="size-4" />
            ) : (
              <LuMenu className="size-4" />
            )}
            {isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          </button>
        </div>
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

      <div>
        <div
          className={`flex justify-between items-center w-full py-5  gap-10 z-10`}
        >
          <div>
            <button
              className=" w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium flex md:hidden"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <LuX className="size-4" />
              ) : (
                <LuMenu className="size-4" />
              )}
              {isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            </button>
          </div>
          <div className="flex justify-end items-center gap-3">
            <div className="hidden md:flex justify-end items-center gap-4">
              <span className=" text-muted-foreground">{greeting()}</span>
              {userName && (
                <div className="flex items-center bg-primary/10 rounded-full px-2 py-1 font-medium">
                  <User2 className="size-4 text-primary" />
                  <span className="text-primary ml-1">{userName}</span>
                </div>
              )}
            </div>
            <div className="">
              <ThemeToggleButton />
            </div>
            <div className=" flex items-center justify-end gap-3">
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
              <div>
                <div className=" hidden md:block">
                  <LogoutButton
                    variant="ghost"
                    label="Déconnexion"
                    startIcon={<LogOut className="size-6" />}
                  />
                </div>
                <div className="block md:hidden">
                  <LogOut className="size-6" />
                </div>
              </div>
            </div>
          </div>

          {/* <UserMenu /> */}
        </div>
        <label
          className="relative flex-1 md:hidden "
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
    </div>
  );
};

export default TopBanner;
