"use client";
import { useStore } from "zustand";
import { sidebarState, useUiStore } from "../store/sidebarState";
import { IoMenu } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggleButton from "../atoms/themeToggleButton";
import UserMenu from "../atoms/userMenu";
import DP from "@/../public/logo/logo-inline.png";
import { connectedUserStore } from "../store/connectedUser";
import SVGComponent from "../atoms/displaySVG";
import { greeting } from "@/utils/utils";
import { LuMenu } from "react-icons/lu";
import { Bell, LogOut } from "lucide-react";
import LogoutButton from "../ui/LogoutButton";

const TopBanner = () => {
  const { user } = useStore(connectedUserStore);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <div className={`flex justify-center w-full items-center`}>
      <div
        className={`flex justify-between items-center w-full py-5  gap-10 z-10`}
      >
        <div>
          <button
            className="flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <LuMenu className="size-4" />
            Menu
          </button>
        </div>

        <div className="flex justify-end items-center gap-3">
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
                <LogoutButton
                  variant="ghost"
                  // label="Déconnexion"
                  startIcon={<LogOut className="size-6" />}
                />
              </div>
            </div>
          </div>
        </div>

        <UserMenu />
      </div>
    </div>
  );
};

export default TopBanner;
