/**
 * Store Zustand simplifié pour FormEngine 2.0
 * Stocke uniquement l'état UI (mode édition, navigation, etc.)
 *
 * ⚠️ Ne stocke PAS les valeurs du formulaire (gérées par useDynamicForm)
 * ⚠️ Ne stocke PAS les champs (gérés par TanStack Query)
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DynamicFormState {
  // État UI uniquement
  isEditMode: boolean;
  editId: string | null;

  // Navigation (pour multi-steps si nécessaire)
  currentStep?: number;
  maxSteps?: number;

  // Actions
  setEditMode: (isEdit: boolean, id?: string | null) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const initialState: Omit<
  DynamicFormState,
  "setEditMode" | "setStep" | "reset"
> = {
  isEditMode: false,
  editId: null,
  currentStep: undefined,
  maxSteps: undefined,
};

export const useDynamicFormStore = create<DynamicFormState>()(
  devtools(
    (set) => ({
      ...initialState,

      setEditMode: (isEdit, id = null) =>
        set({ isEditMode: isEdit, editId: id }),

      setStep: (step) =>
        set((state) => ({
          currentStep: step,
          maxSteps: state.maxSteps ? Math.max(state.maxSteps, step) : step,
        })),

      reset: () => set(initialState),
    }),
    { name: "dynamic-form-store" }
  )
);
