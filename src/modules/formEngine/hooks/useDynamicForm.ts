/**
 * Hook principal pour les formulaires dynamiques
 * Remplace l'ancien useDynamicForm avec validation custom (sans Zod)
 *
 * Fonctionnalités :
 * - Gestion des valeurs avec useState
 * - Validation custom en temps réel
 * - Filtrage des champs visibles via displayIf
 * - Support des champs children récursifs
 * - Génération du payload uniquement avec les champs visibles
 */

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import type { UseDynamicFormReturn, FormValidationResult } from "../types";
import {
  evaluateDisplayIf,
  validateForm,
  validateFieldByPath,
} from "../validators";

interface UseDynamicFormOptions {
  fields: ApiInputType[];
  initialValues?: Record<string, unknown>;
  validateOnChange?: boolean; // Validation en temps réel
  onSubmit?: (payload: Record<string, unknown>) => Promise<void>;
}

/**
 * Hook principal pour les formulaires dynamiques
 */
export function useDynamicForm({
  fields,
  initialValues = {},
  validateOnChange = true,
  onSubmit,
}: UseDynamicFormOptions): UseDynamicFormReturn {
  // État des valeurs du formulaire
  const [values, setValuesState] =
    useState<Record<string, unknown>>(initialValues);

  // État des erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // État de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État dirty
  const [isDirty, setIsDirty] = useState(false);

  // Mettre à jour les valeurs initiales si elles changent
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setValuesState((prev) => ({ ...prev, ...initialValues }));
      setIsDirty(false);
    }
  }, [initialValues]);

  // Calculer les champs visibles basés sur displayIf
  const visibleFields = useMemo(() => {
    return fields.filter((field) => evaluateDisplayIf(field.displayIf, values));
  }, [fields, values]);

  // Calculer les champs cachés
  const hiddenFields = useMemo(() => {
    return fields.filter(
      (field) => !evaluateDisplayIf(field.displayIf, values)
    );
  }, [fields, values]);

  // Mettre à jour une valeur
  const setValue = useCallback(
    (property: string, value: ValueType) => {
      setValuesState((prev) => {
        const next = { ...prev, [property]: value };
        setIsDirty(true);

        // Validation en temps réel si activée
        if (validateOnChange) {
          const fieldResult = validateFieldByPath(fields, property, next);
          setErrors((prevErrors) => {
            if (fieldResult.isValid) {
              const { [property]: _, ...rest } = prevErrors;
              return rest;
            } else {
              return {
                ...prevErrors,
                [property]: fieldResult.error || "Erreur de validation",
              };
            }
          });
        }

        return next;
      });
    },
    [fields, validateOnChange]
  );

  // Mettre à jour plusieurs valeurs
  const setValues = useCallback((newValues: Record<string, unknown>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
    setIsDirty(true);
  }, []);

  // Valider un champ spécifique
  const validateField = useCallback(
    (property: string): { isValid: boolean; error?: string } => {
      const result = validateFieldByPath(fields, property, values);
      if (!result.isValid) {
        setErrors((prev) => ({
          ...prev,
          [property]: result.error || "Erreur de validation",
        }));
      } else {
        setErrors((prev) => {
          const { [property]: _, ...rest } = prev;
          return rest;
        });
      }
      return result;
    },
    [fields, values]
  );

  // Valider tout le formulaire
  const validate = useCallback((): FormValidationResult => {
    const result = validateForm(fields, values);
    setErrors(result.errors);
    return result;
  }, [fields, values]);

  // Générer le payload avec uniquement les champs visibles
  const getPayload = useCallback((): Record<string, unknown> => {
    const payload: Record<string, unknown> = {};

    // Fonction récursive pour extraire les valeurs des champs visibles
    const extractVisibleValues = (
      fieldsToProcess: ApiInputType[],
      currentValues: Record<string, unknown>,
      prefix = ""
    ): void => {
      for (const field of fieldsToProcess) {
        const isVisible = evaluateDisplayIf(field.displayIf, currentValues);

        // Ignorer les champs cachés
        if (!isVisible) {
          continue;
        }

        const fieldPath = prefix
          ? `${prefix}.${field.property}`
          : field.property;
        const fieldValue = currentValues[field.property];

        // Si c'est un champ children, traiter récursivement
        if (
          field.type === "children" &&
          field.children &&
          field.children.length > 0
        ) {
          if (field.multiple && Array.isArray(fieldValue)) {
            // Tableau d'objets enfants
            const childrenArray = fieldValue.map((childObj, index) => {
              if (typeof childObj === "object" && childObj !== null) {
                const childPayload: Record<string, unknown> = {};
                field.children!.forEach((childField) => {
                  const childValue = (childObj as Record<string, unknown>)[
                    childField.property
                  ];
                  const childIsVisible = evaluateDisplayIf(
                    childField.displayIf,
                    childObj as Record<string, unknown>
                  );
                  if (childIsVisible && childValue !== undefined) {
                    childPayload[childField.property] = childValue;
                  }
                });
                return childPayload;
              }
              return childObj;
            });
            payload[field.property] = childrenArray;
          } else if (
            !field.multiple &&
            typeof fieldValue === "object" &&
            fieldValue !== null
          ) {
            // Objet unique enfant
            const childPayload: Record<string, unknown> = {};
            field.children.forEach((childField) => {
              const childValue = (fieldValue as Record<string, unknown>)[
                childField.property
              ];
              const childIsVisible = evaluateDisplayIf(
                childField.displayIf,
                fieldValue as Record<string, unknown>
              );
              if (childIsVisible && childValue !== undefined) {
                childPayload[childField.property] = childValue;
              }
            });
            payload[field.property] = childPayload;
          }
        } else {
          // Champ simple - ajouter si défini
          if (
            fieldValue !== undefined &&
            fieldValue !== null &&
            fieldValue !== ""
          ) {
            payload[field.property] = fieldValue;
          }
        }
      }
    };

    extractVisibleValues(fields, values);

    return payload;
  }, [fields, values]);

  // Soumettre le formulaire
  const submit = useCallback(
    async (onSuccess?: (payload: Record<string, unknown>) => void) => {
      // Valider avant de soumettre
      const validationResult = validate();

      if (!validationResult.isValid) {
        // Erreurs déjà mises à jour dans validate()
        return;
      }

      // Générer le payload avec uniquement les champs visibles
      const payload = getPayload();

      setIsSubmitting(true);

      try {
        // Si une fonction onSubmit est fournie, l'utiliser
        if (onSubmit) {
          await onSubmit(payload);
        }

        // Si une fonction onSuccess est fournie, l'appeler
        if (onSuccess) {
          onSuccess(payload);
        }
      } catch (error) {
        // L'erreur sera gérée par l'appelant (mutation TanStack Query)
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, getPayload, onSubmit]
  );

  // Réinitialiser le formulaire
  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Calculer isValid (aucune erreur)
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    // Valeurs
    values,
    setValue,
    setValues,

    // Champs
    allFields: fields,
    visibleFields,
    hiddenFields,

    // Validation
    errors,
    isValid,
    validate,
    validateField,

    // Soumission
    submit,
    getPayload,

    // État
    isSubmitting,
    isDirty,
    reset,
  };
}
