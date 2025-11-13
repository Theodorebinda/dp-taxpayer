"use client";

import { IoChevronDownOutline, IoChevronForwardOutline } from "react-icons/io5";
import Link from "next/link";
import translate from "../store/dictionary";
import { SideMenuType } from "@/types/application.type";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SVGComponent from "./displaySVG";
import { sidebarState } from "../store/sidebarState";
import { useStore } from "zustand";
import { LuMinus, LuPlus } from "react-icons/lu";

interface SideBarContent extends SideMenuType {
  panding?: number;
}

const NavSection = ({
  name,
  icon,
  path,
  menuActions,
  panding = 0,
}: SideBarContent) => {
  const [displaychildren, setDisplaychildren] = useState<boolean>(true);
  const { setIsOpen } = useStore(sidebarState);
  const ChivronComponent = () => {
    return displaychildren ? (
      <IoChevronDownOutline />
    ) : (
      // <LuMinus />
      // <LuPlus />
      <IoChevronForwardOutline />
    );
  };

  const hasChildren =
    menuActions &&
    menuActions.filter((action) => action.action !== null).length > 0;

  const pathname = usePathname();
  return (
    <>
      <Link
        href={path !== null ? `${path[0] == "/" ? "" : "/"}${path}` : ""}
        onClick={() => {
          if (menuActions && menuActions.length > 0)
            setDisplaychildren(!displaychildren);
          else if (path !== null) {
            if (path == "/auth/logout") {
              localStorage.removeItem("dp-sk-moto-user");
              localStorage.removeItem("dp-sk-moto-token");
            }
            if (window && window?.innerWidth < 1024) {
              setIsOpen(false);
            }
          }
        }}
        className={`px-2.5 py-2 text-nowrap flex gap-2 cursor-pointer hover:font-bold max-lg:text-xl ${
          !hasChildren && "max-lg:border-l-2 max-lg:border-foreground"
        } justify-between ${
          panding > 0 ? "hover:translate-x-1" : "hover:bg-bg-secondary"
        } ${path == pathname && "text-primary !font-bold"} transition-all`}
      >
        <span className="flex justify-between w-full items-center gap-3">
          <span
            className={`flex gap-2 items-center w-full text-wrap ${
              hasChildren ? "font-normal" : ""
            }`}
          >
            {hasChildren && (
              <span className="block w-fit p-1.5 rounded-md text-primary bg-[#04899620]">
                <SVGComponent
                  width="20"
                  icon={
                    icon && icon !== null
                      ? icon
                      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>'
                  }
                />
              </span>
            )}
            {translate(name, true)}
          </span>
          {menuActions &&
          menuActions.filter((action) => action.action !== null).length > 0 ? (
            <ChivronComponent />
          ) : (
            false
          )}
        </span>
      </Link>
      {displaychildren && menuActions.length > 0 ? (
        <div
          className="lg:border-l border-bg-secondary max-lg:border-foreground max-lg:pl-5 max-lg:gap-2 max-lg:flex max-lg:flex-col"
          style={{
            marginLeft: `${panding + 26}px`,
          }}
        >
          {menuActions &&
            menuActions
              .filter((action) => action.action !== null)
              .map((subMenu) => {
                return (
                  <NavSection
                    {...subMenu.action}
                    icon={""}
                    menuActions={[]}
                    key={subMenu.action.path}
                    // panding={panding + 30}
                  />
                );
              })}
        </div>
      ) : (
        false
      )}
    </>
  );
};

export default NavSection;
