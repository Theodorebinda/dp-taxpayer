import { useCallback, useMemo, useState } from "react";
import type { ApiInputType, ValueType, DisplayIf } from "@/types/types";
import { createFormDataFromObject } from "@/lib/forms/serialization";

export type DynamicFormStep = {
  id: string;
  title?: string;
  fields: ApiInputType[];
};

export type DynamicFormSchema = {
  steps?: DynamicFormStep[];
  fields?: ApiInputType[]; // fallback sans steps
  validations?: Record<string, unknown>;
};

function evaluateDisplayIf(
  conditions: DisplayIf | DisplayIf[] | undefined,
  values: Record<string, unknown>
): boolean {
  if (!conditions) return true;
  const list = Array.isArray(conditions) ? conditions : [conditions];
  return list.every((c) => {
    const current = values?.[c.property];
    switch (c.condition) {
      case "IN":
        return Array.isArray(c.value)
          ? (c.value as unknown[]).includes(current as unknown)
          : current === c.value;
      case "NOT":
        return current !== c.value;
      case "LIKE":
        return String(current ?? "")
          .toLowerCase()
          .includes(String(c.value ?? "").toLowerCase());
      case "NOT IN":
        return Array.isArray(c.value)
          ? !(c.value as unknown[]).includes(current as unknown)
          : current !== c.value;
      case "IS":
      default:
        return current === c.value;
    }
  });
}

function getByPath(obj: unknown, path: string): unknown {
  if (!obj) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (
      acc &&
      typeof acc === "object" &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function useFormEngine(
  schema: DynamicFormSchema,
  initialValues?: Record<string, unknown>
) {
  const [values, setValues] = useState<Record<string, unknown>>(
    initialValues ?? {}
  );

  const allFields = useMemo<ApiInputType[]>(() => {
    if (schema.steps?.length) return schema.steps.flatMap((s) => s.fields);
    return schema.fields ?? [];
  }, [schema]);

  const visibleFields = useMemo<ApiInputType[]>(
    () =>
      allFields.filter((f) =>
        evaluateDisplayIf(f.displayIf, values as Record<string, unknown>)
      ),
    [allFields, values]
  );

  const setFieldValue = useCallback((property: string, value: ValueType) => {
    setValues((prev) => {
      const next: Record<string, unknown> = { ...prev };
      // Support nested paths: a.b.c
      const parts = property.split(".");
      let ref: Record<string, unknown> = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i]!;
        ref[key] = (ref[key] as Record<string, unknown>) ?? {};
        ref = ref[key] as Record<string, unknown>;
      }
      ref[parts[parts.length - 1]!] = value as unknown;
      return next;
    });
  }, []);

  const addChild = useCallback((property: string) => {
    setValues((prev) => {
      const current = getByPath(prev, property);
      const arr = Array.isArray(current) ? current : [];
      const nextArr = [...(arr as unknown[]), {}];
      const parts = property.split(".");
      const next: Record<string, unknown> = {
        ...(prev as Record<string, unknown>),
      };
      let ref: Record<string, unknown> = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i]!;
        ref[key] = (ref[key] as Record<string, unknown>) ?? {};
        ref = ref[key] as Record<string, unknown>;
      }
      ref[parts[parts.length - 1]!] = nextArr as unknown;
      return next;
    });
  }, []);

  const removeChildAt = useCallback((property: string, index: number) => {
    setValues((prev) => {
      const current = getByPath(prev, property);
      const arr = Array.isArray(current) ? current : [];
      const nextArr = (arr as unknown[]).filter((_, i) => i !== index);
      const parts = property.split(".");
      const next: Record<string, unknown> = {
        ...(prev as Record<string, unknown>),
      };
      let ref: Record<string, unknown> = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i]!;
        ref[key] = (ref[key] as Record<string, unknown>) ?? {};
        ref = ref[key] as Record<string, unknown>;
      }
      ref[parts[parts.length - 1]!] = nextArr as unknown;
      return next;
    });
  }, []);

  const serialize = useCallback(() => {
    return createFormDataFromObject(values);
  }, [values]);

  return {
    values,
    setFieldValue,
    visibleFields,
    allFields,
    addChild,
    removeChildAt,
    serialize,
  };
}
