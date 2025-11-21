import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ApiInputType } from "@/types/types";
import type { DeclarationType } from "@/types/declaration-types";

interface DynamicFormState {
  // État du formulaire
  formType: DeclarationType | null;
  formFields: ApiInputType[];
  initialValues: Record<string, unknown>;
  isEditMode: boolean;
  editId: string | null;

  // Actions
  setFormType: (type: DeclarationType | null) => void;
  setFormFields: (fields: ApiInputType[]) => void;
  setInitialValues: (values: Record<string, unknown>) => void;
  setEditMode: (isEdit: boolean, id?: string | null) => void;
  reset: () => void;
}

const initialState = {
  formType: null,
  formFields: [],
  initialValues: {},
  isEditMode: false,
  editId: null,
};

export const useDynamicFormStore = create<DynamicFormState>()(
  devtools(
    (set) => ({
      ...initialState,

      setFormType: (type) => set({ formType: type }),

      setFormFields: (fields) => set({ formFields: fields }),

      setInitialValues: (values) => set({ initialValues: values }),

      setEditMode: (isEdit, id = null) =>
        set({ isEditMode: isEdit, editId: id }),

      reset: () => set(initialState),
    }),
    { name: "dynamic-form-store" }
  )
);
