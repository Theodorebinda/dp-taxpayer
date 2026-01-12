/**
 * Types partagés pour le FormEngine 2.0
 * Centralisation de tous les types liés aux formulaires dynamiques
 */

import type { ApiInputType, ValueType } from "@/types/types";

/**
 * Structure normalisée d'un formulaire après normalisation API
 */
export interface NormalizedRecipeForm {
  fields: ApiInputType[];
  steps?: FormStep[];
  initialValues?: Record<string, unknown>;
  message?: string;
}

/**
 * Structure d'un étape de formulaire
 */
export interface FormStep {
  id: string;
  property: string;
  title: string;
  description?: string;
  fields: ApiInputType[];
}

/**
 * Résultat de validation d'un champ
 */
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Résultat de validation complète du formulaire
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Configuration de validation pour un champ
 * Extrait de ApiInputType pour faciliter la validation
 */
export interface FieldValidationConfig {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern
  customValidator?: (
    value: unknown,
    formValues: Record<string, unknown>
  ) => string | null;
}

/**
 * Champ avec sa valeur et son état de validation
 */
export interface FieldWithValue {
  field: ApiInputType;
  value: ValueType;
  isValid: boolean;
  error?: string;
  isVisible: boolean;
}

/**
 * Props pour un composant de champ dynamique
 */
export interface DynamicFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  parentValue?: Record<string, unknown>;
  depth?: number;
  disabled?: boolean;
}

/**
 * Hook de formulaire dynamique retourné
 */
export interface UseDynamicFormReturn {
  // Valeurs du formulaire
  values: Record<string, unknown>;
  setValue: (property: string, value: ValueType) => void;
  setValues: (values: Record<string, unknown>) => void;

  // Champs
  allFields: ApiInputType[];
  visibleFields: ApiInputType[];
  hiddenFields: ApiInputType[];

  // Validation
  errors: Record<string, string>;
  isValid: boolean;
  validate: () => FormValidationResult;
  validateField: (property: string) => FieldValidationResult;

  // Soumission
  submit: (
    onSuccess?: (payload: Record<string, unknown>) => void
  ) => Promise<void>;
  getPayload: () => Record<string, unknown>; // Retourne uniquement les champs visibles

  // État
  isSubmitting: boolean;
  isDirty: boolean;
  reset: () => void;
}
