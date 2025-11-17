import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

export type DisplayLayout = "grid" | "list";

export type UiStoreState = {
  displayLayout: DisplayLayout;
  setDisplayLayout: (layout: DisplayLayout) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  /**
   * Legacy aliases kept for backward compatibility with components
   * still reading `isOpen` / `setIsOpen`.
   */
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const uiStore = createStore<UiStoreState>((set) => ({
  displayLayout: "grid",
  setDisplayLayout: (displayLayout) => set({ displayLayout }),
  isSidebarOpen: true,
  setSidebarOpen: (isSidebarOpen) =>
    set({ isSidebarOpen, isOpen: isSidebarOpen }),
  toggleSidebar: () =>
    set((state) => {
      const next = !state.isSidebarOpen;
      return { isSidebarOpen: next, isOpen: next };
    }),
  sidebarWidth: 360,
  setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen, isSidebarOpen: isOpen }),
}));

export function useUiStore<T>(selector: (state: UiStoreState) => T): T {
  return useStore(uiStore, selector);
}
