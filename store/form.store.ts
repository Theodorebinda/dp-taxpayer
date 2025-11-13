import { ApiInputType } from "@/types/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type FormField =
  | string
  | number
  | boolean
  | null
  | Record<string, string | number | boolean>
  | ({ id?: string } & { [key: string]: FormField })
  | ({ id?: string } & { [key: string]: FormField })[];

type FormFieldStore = { id?: string } & { [key: string]: FormField };

interface FormStore {
  fields: FormFieldStore;
  updateField: (
    keys: string,
    property?: string,
    value?: string | FormField[],
    index?: number
  ) => void;
  addChild: (
    parentKey: string,
    children: { property: string; value: unknown }[],
    isMultiple?: boolean
  ) => void;
  removeChild: (
    parentKey: string,
    childIndex: number,
    isKeyMulitiple?: boolean
  ) => void;
  initializeFields: (apiInputs: ApiInputType[]) => void;
  setFields: (fields: FormFieldStore) => void;
  createFormDataFromObject: (
    object: Record<string, unknown>
  ) => FormData | Record<string, unknown>;
}

const generateId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2)}`;
};

const ensureId = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => ensureId(item));
  } else if (typeof obj === "object" && obj !== null) {
    const rec = obj as Record<string, unknown> & { id?: string };
    return { id: rec.id || generateId(), ...rec };
  }
  return obj;
};

const transformPath = (path: string): Array<string | number> => {
  const keys: Array<string | number> = [];
  path.split(".").forEach((segment) => {
    if (segment.includes("[")) {
      segment.split("[").forEach((subSegment) => {
        if (subSegment.includes("]")) {
          const content = subSegment.slice(0, subSegment.indexOf("]"));
          if (!Number.isNaN(Number(content))) {
            keys.push(Number(content));
          } else {
            const cleanedContent = content.replace(/['"]/g, "");
            keys.push(cleanedContent);
          }
        } else if (subSegment) {
          keys.push(subSegment);
        }
      });
    } else if (segment) {
      keys.push(segment);
    }
  });
  return keys.filter((key) => String(key).length > 0);
};

export const useFormStore = create<FormStore>()(
  devtools(
    (set) => ({
      fields: {},

      setFields: (fields) => set({ fields }),

      initializeFields: () =>
        // apiInputs
        {
          // See original file for idea: transformer API inputs en structure fields
        },

      addChild: (parentKey, child, isMultiple = true) => {
        set((state) => {
          const fieldsAsObject = child.reduce(
            (acc: Record<string, unknown>, field) => ({
              ...acc,
              [field.property]: field.value,
            }),
            {} as Record<string, unknown>
          );

          const addRecursively = (
            currentFields: FormField,
            keys: (string | number)[]
          ): FormField => {
            if (keys.length == 0 && isMultiple) {
              return [
                ...(Array.isArray(currentFields) ? currentFields : []),
                fieldsAsObject,
              ] as unknown as FormField;
            } else if (keys.length == 0 && isMultiple === false) {
              return fieldsAsObject as unknown as FormField;
            }

            const currentKey = keys[0];
            const remainingKeys = keys.slice(1);

            if (typeof currentKey == "number") {
              const arrayValue = Array.isArray(currentFields)
                ? currentFields
                : [];
              return arrayValue.map((item, index) =>
                index === currentKey
                  ? addRecursively(item, remainingKeys)
                  : item
              ) as unknown as FormField;
            } else if (
              typeof currentFields === "object" &&
              currentFields !== null
            ) {
              return {
                ...(currentFields as Record<string, FormField>),
                [currentKey]: addRecursively(
                  (currentFields as Record<string, FormField>)[currentKey],
                  remainingKeys
                ),
              } as unknown as FormField;
            }
            return currentFields;
          };

          const keys = transformPath(parentKey);
          const newData = {
            fields: {
              ...state.fields,
              [keys[0]]: addRecursively(state.fields[keys[0]], keys.slice(1)),
            },
          };
          return newData;
        });
      },

      updateField: (path, value) => {
        set((state) => {
          const keys = transformPath(path);

          const updateFieldRecursive = (
            field: FormField,
            keys: Array<string | number>
          ): FormField => {
            if (keys.length == 0) {
              return value || "";
            } else if (Array.isArray(field) && !Number.isNaN(+keys[0])) {
              const oldData: FormField[] = field as FormField[];
              oldData[+keys[0]] = updateFieldRecursive(
                oldData[+keys[0]],
                keys.slice(1)
              );
              return oldData.map((item) =>
                typeof item === "object" && item !== null
                  ? ensureId(item)
                  : item
              ) as unknown as FormField;
            } else if (["string", "number", "boolean"].includes(typeof field)) {
              return value || field;
            } else if (typeof field === "object" && field !== null) {
              return {
                ...(field as Record<string, string | number | boolean>),
                [keys[0]]: updateFieldRecursive(
                  (field as Record<string, FormField>)[keys[0]],
                  keys.slice(1)
                ) as unknown as FormField,
              } as unknown as FormField;
            } else {
              return field;
            }
          };
          return {
            fields: {
              ...state.fields,
              [keys[0]]: updateFieldRecursive(
                state.fields[keys[0]],
                keys.slice(1)
              ),
            },
          };
        });
      },

      removeChild: (path, childIndex, isKeyMulitiple = true) => {
        console.log("path::::::::::", path);
        console.log("childIndex::::::::::", childIndex);
        set((state) => {
          const keys = transformPath(path);

          const removeChildRecursive = (
            field: FormField,
            keys: Array<string | number>
          ): FormField => {
            if (keys.length === 0) return null;
            if (keys.length === 1) {
              if (!isKeyMulitiple) return null;
              if (Array.isArray(field)) {
                return field.filter((_, index) => index !== childIndex);
              }
              return field;
            } else if (Array.isArray(field) && !Number.isNaN(+keys[0])) {
              const index = +keys[0];
              if (index < 0 || index >= field.length) return field;

              return field.map((item: unknown, i) =>
                i === index
                  ? removeChildRecursive(item as FormField, keys.slice(1))
                  : (item as FormField)
              ) as unknown as FormField;
            } else if (typeof field === "object" && field !== null) {
              return {
                ...field,
                [keys[0]]: removeChildRecursive(
                  (field as Record<string, FormField>)[keys[0]],
                  keys.slice(1)
                ),
              } as unknown as FormField;
            }
            return field;
          };
          return {
            fields: {
              ...state.fields,
              [keys[0]]: removeChildRecursive(
                state.fields[keys[0]],
                keys.slice(1)
              ),
            },
          };
        });
      },

      createFormDataFromObject: (
        obj: Record<string, unknown>
      ): FormData | Record<string, unknown> => {
        const formData = new FormData();
        const files: Array<File> = [];

        const findFiles = (
          currentObj: Record<string, unknown>,
          currentPath: string
        ) => {
          for (const key in currentObj) {
            if (currentObj.hasOwnProperty(key)) {
              const value = currentObj[key] as unknown;
              const newPath = currentPath ? `${currentPath}.${key}` : key;

              if (value instanceof File) {
                files.push(new File([value], newPath));
              } else if (typeof value === "object" && value !== null) {
                findFiles(value as Record<string, unknown>, newPath);
              }
            }
          }
        };

        findFiles(obj, "");

        const removeFiles = (currentObj: Record<string, unknown>) => {
          for (const key in currentObj) {
            if (currentObj.hasOwnProperty(key)) {
              const value = currentObj[key] as unknown;
              if (value instanceof File) {
                delete currentObj[key];
              } else if (typeof value === "object" && value !== null) {
                removeFiles(value as Record<string, unknown>);
              }
            }
          }
        };

        if (files.length == 0) return obj;
        else files.forEach((file) => formData.append(`files`, file));
        const objWithoutFiles = JSON.parse(JSON.stringify(obj));
        removeFiles(objWithoutFiles as Record<string, unknown>);

        formData.append("json", JSON.stringify(objWithoutFiles));

        return formData;
      },
    }),
    { name: "form-state" }
  )
);
