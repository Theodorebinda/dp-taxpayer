import { ApplicationType } from "@/types/application.type";
import { create } from "zustand";

type ApplictionsStore = {
  displayLayout: "grid" | "list";
  setDisplayLayout: (layout: "grid" | "list") => void;
  applications: ApplicationType[];
  currentApplication: ApplicationType | null;
  isLoading: boolean;
  setApplications: (data: ApplicationType[]) => void;
  setCurrentApplication: (data: ApplicationType | null) => void;
  setIsLoading: (data: boolean) => void;
  error:
    | {
        code: number;
        message: string;
        [key: string]: any;
      }
    | undefined;
  setError: (
    error:
      | {
          code: number;
          message: string;
          [key: string]: any;
        }
      | undefined
  ) => void;
};

export const applictionsStore = create<ApplictionsStore>()((set) => ({
  displayLayout: "list",
  applications: [],
  isLoading: true,
  error: undefined,
  currentApplication: null,

  setIsLoading: (isLoading) => set({ isLoading }),
  setApplications: (applications) => set({ applications }),
  setCurrentApplication: (currentApplication) => set({ currentApplication }),
  setError: (error) => set({ error }),
  setDisplayLayout: (layout) => set({ displayLayout: layout }),
}));
