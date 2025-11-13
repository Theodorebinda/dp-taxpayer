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

export * from "@/store/form.store";
