"use client";
import { useRouter } from "next/navigation";
import { useStore } from "zustand";
import { LuCircle, LuFolderOpen, LuLink } from "react-icons/lu";
import { capitalizeWords } from "@/utils/utils";
import { useEffect, useState } from "react";
import SVGComponent from "../atoms/displaySVG";
import { ApplicationType, SideMenuType } from "@/types/application.type";
import { currentMenuStore } from "../store/currentMenu";
import { applictionsStore } from "../store/applications";

const MenuCard = ({
  menu,
  currentApplication,
}: {
  menu: SideMenuType;
  currentApplication: ApplicationType;
}) => {
  const has_actions = menu.menuActions.length > 0;
  const actions_length = menu.menuActions.length;
  const { setMenus } = useStore(currentMenuStore);
  const { setCurrentApplication } = useStore(applictionsStore);
  const router = useRouter();
  const [loading, set_loading] = useState<boolean>(false);
  // const [showActions, setShowActions] = useState<boolean>(false);

  return (
    <button
      disabled={loading}
      onClick={() => {
        if (has_actions) {
          set_loading(true);
          setMenus(currentApplication.menus);
          setCurrentApplication(currentApplication);
          router.push(`${menu.menuActions[0].action.path}`);
        }
      }}
      className={`relative bg-background dark:bg-foreground/20 rounded-lg p-5 max-md:p-2.5 flex items-center gap-5 transition-colors cursor-pointer max-md:w-auto max-md:items-start ${
        has_actions && "hover:bg-foreground/20"
      }`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/80 bg-opacity-50 rounded-lg z-20">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin"></div>
        </div>
      )}
      <span
        className={`${
          has_actions ? "text-primary" : "text-foreground/60"
        } max-md:hidden`}
      >
        {menu?.icon?.length > 0 ? (
          <SVGComponent width={"20px"} height={"20px"} icon={menu.icon} />
        ) : (
          <LuFolderOpen size={20} />
        )}
      </span>
      <div className="flex-1 flex flex-col items-start justify-between gap-2">
        <span
          className={`font-semibold text-left ${!has_actions && "text-foreground/60"}`}
        >
          {capitalizeWords(menu.name)}
        </span>
        <span className="text-base text-foreground/70 flex items-center gap-2">
          <LuLink />{" "}
          <span>
            <span className="max-md:hidden">Nombre d&apos;</span>
            actions : {actions_length}
          </span>
        </span>
      </div>
      <span className="flex items-center gap-2">
        <LuCircle
          className={` ${!has_actions ? "text-red-500" : "text-green-500"}`}
        />{" "}
        <span
          className={`max-lg:hidden ${!has_actions && "text-foreground/60"}`}
        >
          {has_actions ? "actif" : "inactif"}
        </span>
      </span>
    </button>
  );
};

export default MenuCard;
