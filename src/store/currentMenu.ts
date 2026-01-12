import { SideMenuType } from "@/types/application.type";
import { create } from "zustand";

type CurrentMenuType = {
  menus: SideMenuType[];
  setMenus: (data: SideMenuType[]) => void;
};

export const currentMenuStore = create<CurrentMenuType>()((set) => ({
  menus: [],
  setMenus: (menus) => {
    return set({ menus });
  },
}));
