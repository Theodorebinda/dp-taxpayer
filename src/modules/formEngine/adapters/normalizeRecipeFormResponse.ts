/**
 * Adapter pour normaliser toutes les variantes de réponses API
 * en une structure unique NormalizedRecipeForm
 *
 * Gère les cas suivants :
 * - Tableau direct ApiInputType[]
 * - Tableau de FormStep[]
 * - Objet { data: ApiInputType[] | FormStep[] }
 * - Objet { data: { possessionForm: { fields: [...] }, ... } }
 * - Wrapper avec form initialValues
 */

import type { ApiInputType } from "@/types/types";
import type { NormalizedRecipeForm, FormStep } from "../types";

/**
 * Wrapper générique de l'API
 */
type ApiWrapper<T> = {
  code?: number;
  message?: string;
  data?: T;
  form?: Record<string, unknown>;
  meta?: unknown;
};

/**
 * Type pour une structure imbriquée avec fields
 */
type NestedFieldsStructure = {
  [key: string]: {
    fields?: ApiInputType[];
    [key: string]: unknown;
  };
};

/**
 * Extrait les valeurs initiales du formulaire depuis la réponse API
 */
function extractInitialValues(
  payload: unknown
): Record<string, unknown> | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;

  // Cas 1: form directement dans la réponse
  if ("form" in record && record.form && typeof record.form === "object") {
    return record.form as Record<string, unknown>;
  }

  // Cas 2: form dans data.form
  if ("data" in record && record.data && typeof record.data === "object") {
    const data = record.data as Record<string, unknown>;
    if ("form" in data && data.form && typeof data.form === "object") {
      return data.form as Record<string, unknown>;
    }
  }

  return undefined;
}

/**
 * Extrait le message depuis la réponse API
 */
function extractMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;
  const message = record.message;

  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  return undefined;
}

/**
 * Détecte si un tableau contient des FormStep ou des ApiInputType
 */
function isFormStepArray(arr: unknown[]): arr is FormStep[] {
  return (
    arr.length > 0 &&
    typeof arr[0] === "object" &&
    arr[0] !== null &&
    "fields" in arr[0] &&
    Array.isArray((arr[0] as FormStep).fields)
  );
}

/**
 * Normalise un tableau de FormStep ou ApiInputType en ApiInputType[]
 */
function normalizeFieldsArray(input: FormStep[] | ApiInputType[]): {
  fields: ApiInputType[];
  steps?: FormStep[];
} {
  if (input.length === 0) {
    return { fields: [] };
  }

  if (isFormStepArray(input)) {
    // C'est un tableau de FormStep
    const steps = input as FormStep[];
    const fields = steps.flatMap((step) => step.fields);
    return { fields, steps };
  } else {
    // C'est directement un tableau de ApiInputType
    return { fields: input as ApiInputType[] };
  }
}

/**
 * Extrait les fields d'une structure imbriquée
 * Exemple: { possessionForm: { fields: [...] }, taxpayerIdentity: { fields: [...] } }
 */
function extractFieldsFromNestedStructure(
  data: NestedFieldsStructure
): ApiInputType[] {
  const fields: ApiInputType[] = [];

  for (const key in data) {
    const value = data[key];
    if (
      value &&
      typeof value === "object" &&
      "fields" in value &&
      Array.isArray(value.fields)
    ) {
      fields.push(...(value.fields as ApiInputType[]));
    }
  }

  return fields;
}

/**
 * Déballe les wrappers API pour obtenir la donnée brute
 */
function unwrapApiResponse<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const record = response as ApiWrapper<unknown>;

  // Si data existe, on l'utilise
  if ("data" in record && record.data !== undefined) {
    const data = record.data;

    // Si data a aussi un data imbriqué, on le prend
    if (
      data &&
      typeof data === "object" &&
      "data" in data &&
      (data as Record<string, unknown>).data !== undefined
    ) {
      return (data as Record<string, unknown>).data as T;
    }

    return data as T;
  }

  // Sinon, on retourne la réponse telle quelle
  return response as T;
}

/**
 * Fonction principale de normalisation
 * Convertit n'importe quelle structure API en NormalizedRecipeForm
 */
export function normalizeRecipeFormResponse(
  response: unknown
): NormalizedRecipeForm | null {
  if (!response) {
    return null;
  }

  // Déballer la réponse API
  const unwrapped = unwrapApiResponse<unknown>(response);

  if (!unwrapped) {
    return null;
  }

  let fields: ApiInputType[] = [];
  let steps: FormStep[] | undefined = undefined;

  // Cas 1: Tableau direct
  if (Array.isArray(unwrapped)) {
    const normalized = normalizeFieldsArray(unwrapped);
    fields = normalized.fields;
    steps = normalized.steps;
  }
  // Cas 2: Objet avec data
  else if (typeof unwrapped === "object" && unwrapped !== null) {
    const obj = unwrapped as Record<string, unknown>;

    // Cas 2a: data contient un tableau
    if ("data" in obj && Array.isArray(obj.data)) {
      const normalized = normalizeFieldsArray(
        obj.data as FormStep[] | ApiInputType[]
      );
      fields = normalized.fields;
      steps = normalized.steps;
    }
    // Cas 2b: data contient une structure imbriquée
    else if (
      "data" in obj &&
      typeof obj.data === "object" &&
      obj.data !== null
    ) {
      fields = extractFieldsFromNestedStructure(
        obj.data as NestedFieldsStructure
      );
    }
    // Cas 2c: L'objet lui-même contient des fields (structure directe)
    else if ("fields" in obj && Array.isArray(obj.fields)) {
      fields = obj.fields as ApiInputType[];
      if ("steps" in obj && Array.isArray(obj.steps)) {
        steps = obj.steps as FormStep[];
      }
    }
    // Cas 2d: Structure imbriquée directement
    else {
      fields = extractFieldsFromNestedStructure(
        unwrapped as NestedFieldsStructure
      );
    }
  }

  // Extraire les valeurs initiales et le message
  const initialValues = extractInitialValues(response);
  const message = extractMessage(response);

  return {
    fields,
    steps,
    initialValues,
    message,
  };
}
