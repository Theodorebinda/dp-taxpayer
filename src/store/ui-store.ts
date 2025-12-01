import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export const useUiStore = create<UiStoreState>()(
  persist(
    (set) => ({
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
      sidebarWidth: 320,
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
      isOpen: true,
      setIsOpen: (isOpen) => set({ isOpen, isSidebarOpen: isOpen }),
    }),
    {
      name: "ui-store", // Nom de la clé dans localStorage
      storage: createJSONStorage(() => localStorage),
      // Ne persister que l'état du sidebar (pas le displayLayout qui peut changer selon le contexte)
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        isOpen: state.isOpen,
        sidebarWidth: state.sidebarWidth,
      }),
      // Fonction merge personnalisée : l'état persisté écrase l'état initial pour les champs persistés
      merge: (persistedState, currentState) => {
        // persistedState contient uniquement les champs persistés (isSidebarOpen, isOpen, sidebarWidth)
        // On fusionne en donnant la priorité à l'état persisté
        return {
          ...currentState,
          ...(persistedState as Partial<UiStoreState>),
        };
      },
      // Callback pour déboguer l'hydratation
      onRehydrateStorage: () => (state) => {
        if (process.env.NODE_ENV !== "production") {
          console.log("[ui-store] État restauré depuis localStorage:", state);
        }
      },
    }
  )
);

// Exporter le store pour l'accès direct (nécessaire pour reset-client-state.ts)
export const uiStore = useUiStore;
