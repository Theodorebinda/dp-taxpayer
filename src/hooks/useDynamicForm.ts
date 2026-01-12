"use client";

import { useForm, useWatch } from "react-hook-form";
import { useMemo } from "react";
import { generateZodSchema } from "@/lib/forms/zod-schema-generator";
import { createZodResolver } from "@/lib/forms/zod-resolver";
import type { ApiInputType, DisplayIf } from "@/types/types";

/**
 * Évalue les conditions displayIf pour déterminer si un champ doit être affiché
 */
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
          : current === c.value;
      case "IS":
      default:
        return current === c.value;
    }
  });
}

/**
 * Hook personnalisé qui combine React Hook Form, Zod et la logique de formulaires dynamiques
 */
export function useDynamicForm(
  fields: ApiInputType[],
  initialValues?: Record<string, unknown>
) {
  // S'assurer que fields est toujours un tableau
  const safeFields = useMemo(() => {
    return Array.isArray(fields) ? fields : [];
  }, [fields]);

  // Générer le schéma Zod dynamiquement
  const zodSchema = useMemo(() => {
    return generateZodSchema(safeFields);
  }, [safeFields]);

  // Créer le resolver Zod
  const resolver = useMemo(() => {
    return createZodResolver(zodSchema);
  }, [zodSchema]);

  // Initialiser React Hook Form
  const form = useForm({
    resolver,
    defaultValues: initialValues || {},
    mode: "onChange", // Validation en temps réel
  });

  // Surveiller les valeurs pour l'affichage conditionnel
  const watchedValues = useWatch({
    control: form.control,
  }) as Record<string, unknown>;

  // Filtrer les champs visibles basés sur displayIf
  const visibleFields = useMemo(() => {
    return safeFields.filter((field) =>
      evaluateDisplayIf(field.displayIf, watchedValues)
    );
  }, [safeFields, watchedValues]);

  return {
    form,
    zodSchema,
    visibleFields,
    watchedValues,
  };
}
