import { ApiInputType } from "@/types/types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
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
    children: { property: string; value: any }[],
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
    object: Record<string, any>
  ) => FormData | Record<string, any>;
}

const ensureId = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => ensureId(item));
  } else if (typeof obj === "object" && obj !== null) {
    return { id: obj.id || uuidv4(), ...obj };
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
          // const transformApiInputToFormField = (
          //   apiInput: ApiInputType
          // ): FormField => {
          //   let formField: FormField = apiInput.type === "children" ? [] : "";
          //   if (apiInput.type === "children" && apiInput.children) {
          //     const inputData = apiInput.children.reduce((acc, apiInput) => {
          //       acc[apiInput.property] = transformApiInputToFormField(apiInput);
          //       return acc;
          //     }, {} as Record<string, FormField>);
          //     formField =
          //       apiInput.multiple == undefined || apiInput.multiple
          //         ? [inputData]
          //         : inputData;
          //   }
          //   return formField;
          // };
          // const newFields = apiInputs.reduce((acc, apiInput) => {
          //   acc[apiInput.property] = transformApiInputToFormField(apiInput);
          //   return acc;
          // }, {} as Record<string, FormField>);
          // set({ fields: newFields });
        },

      addChild: (parentKey, child, isMultiple = true) => {
        set((state) => {
          const fieldsAsObject = child.reduce(
            (acc, field) => ({ ...acc, [field.property]: field.value }),
            {}
          );

          const addRecursively: any = (
            currentFields: FormField,
            keys: (string | number)[]
          ) => {
            if (keys.length == 0 && isMultiple) {
              return [
                ...(Array.isArray(currentFields) ? currentFields : []),
                fieldsAsObject,
              ];
            } else if (keys.length == 0 && isMultiple === false) {
              return fieldsAsObject;
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
              );
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
              } as FormField;
            }
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
              );
            } else if (["string", "number", "boolean"].includes(typeof field)) {
              return value || field;
            } else if (typeof field === "object" && field !== null) {
              return {
                ...(field as Record<string, string | number | boolean>),
                [keys[0]]: updateFieldRecursive(
                  (field as Record<string, FormField>)[keys[0]],
                  keys.slice(1)
                ) as any,
              };
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
              // On est arrivé au parent du tableau, on filtre l'élément ciblé
              if (!isKeyMulitiple) return null;
              if (Array.isArray(field)) {
                return field.filter((_, index) => index !== childIndex);
              }
              return field;
            } else if (Array.isArray(field) && !Number.isNaN(+keys[0])) {
              const index = +keys[0];
              if (index < 0 || index >= field.length) return field;

              return field.map((item: any, i) =>
                i === index ? removeChildRecursive(item, keys.slice(1)) : item
              );
            } else if (typeof field === "object" && field !== null) {
              return {
                ...field,
                [keys[0]]: removeChildRecursive(
                  (field as Record<string, FormField>)[keys[0]],
                  keys.slice(1)
                ),
              } as any;
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
        obj: Record<string, any>
      ): FormData | Record<string, any> => {
        const formData = new FormData();
        const files: Array<File> = [];

        const findFiles = (currentObj: any, currentPath: string) => {
          for (const key in currentObj) {
            if (currentObj.hasOwnProperty(key)) {
              const value = currentObj[key];
              const newPath = currentPath ? `${currentPath}.${key}` : key;

              if (value instanceof File) {
                files.push(new File([value], newPath));
              } else if (typeof value === "object" && value !== null) {
                findFiles(value, newPath);
              }
            }
          }
        };

        findFiles(obj, "");

        const removeFiles = (currentObj: any) => {
          for (const key in currentObj) {
            if (currentObj.hasOwnProperty(key)) {
              const value = currentObj[key];
              if (value instanceof File) {
                delete currentObj[key];
              } else if (typeof value === "object" && value !== null) {
                removeFiles(value);
              }
            }
          }
        };

        if (files.length == 0) return obj;
        else files.forEach((file) => formData.append(`files`, file));
        const objWithoutFiles = JSON.parse(JSON.stringify(obj));
        removeFiles(objWithoutFiles);

        formData.append("json", JSON.stringify(objWithoutFiles));

        return formData;
      },
    }),
    { name: "form-state" }
  )
);
