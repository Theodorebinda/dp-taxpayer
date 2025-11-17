import { create } from "zustand";

type NavigationState = {
  currentApplicationId: string | null;
  setCurrentApplicationId: (id: string | null) => void;
  currentMenuId: string | null;
  setCurrentMenuId: (id: string | null) => void;
  pendingApplicationId: string | null;
  setPendingApplicationId: (id: string | null) => void;
};

export const useNavigationStore = create<NavigationState>()((set) => ({
  currentApplicationId: null,
  setCurrentApplicationId: (currentApplicationId) =>
    set({ currentApplicationId }),
  currentMenuId: null,
  setCurrentMenuId: (currentMenuId) => set({ currentMenuId }),
  pendingApplicationId: null,
  setPendingApplicationId: (pendingApplicationId) =>
    set({ pendingApplicationId }),
}));
