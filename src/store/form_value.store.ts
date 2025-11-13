import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Value = Record<string, unknown>;

interface FormValueStore {
  value: Value;
  setValue: (value: Record<string, unknown>) => void;
  setValueKey: (key: string, value: unknown) => void;

  reset: () => void;
}

export const formValueStore = create<FormValueStore>()(
  devtools(
    (set) => ({
      value: {},
      setValue: (value) => {
        if (typeof value !== "object" || value === null) {
          console.warn("setValue must receive an object");
          return;
        }
        set({ value });
      },
      setValueKey: (key, value) =>
        set((state) => ({ ...state, value: { ...state.value, [key]: value } })),
      reset: () => set({ value: {} }),
    }),
    { name: "form_value" }
  )
);
