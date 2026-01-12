/**
 * Valide un formulaire complet avec tous ses champs
 * Inclut la validation récursive des champs children
 */

import type { ApiInputType, ValueType } from "@/types/types";
import type { FormValidationResult } from "../types";
import { validateField } from "./validateField";
import { evaluateDisplayIf } from "./evaluateDisplayIf";

/**
 * Valide un champ et tous ses enfants récursivement
 */
function validateFieldRecursive(
  field: ApiInputType,
  value: ValueType,
  formValues: Record<string, unknown>,
  path: string = field.property
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Valider le champ lui-même
  const fieldResult = validateField(field, value, formValues);
  if (!fieldResult.isValid && fieldResult.error) {
    errors[path] = fieldResult.error;
  }

  // Si c'est un champ children, valider récursivement les enfants
  if (
    field.type === "children" &&
    field.children &&
    field.children.length > 0
  ) {
    if (field.multiple) {
      // Tableau d'objets enfants
      const childrenArray = Array.isArray(value) ? value : [];
      childrenArray.forEach((childValue, index) => {
        if (typeof childValue === "object" && childValue !== null) {
          field.children!.forEach((childField) => {
            const childPath = `${path}.${index}.${childField.property}`;
            const childValueAtPath = (childValue as Record<string, unknown>)[
              childField.property
            ];
            const childErrors = validateFieldRecursive(
              childField,
              childValueAtPath as ValueType,
              childValue as Record<string, unknown>,
              childPath
            );
            Object.assign(errors, childErrors);
          });
        }
      });
    } else {
      // Objet unique enfant
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const childObject = value as Record<string, unknown>;
        field.children.forEach((childField) => {
          const childPath = `${path}.${childField.property}`;
          const childValue = childObject[childField.property];
          const childErrors = validateFieldRecursive(
            childField,
            childValue as ValueType,
            childObject,
            childPath
          );
          Object.assign(errors, childErrors);
        });
      }
    }
  }

  return errors;
}

/**
 * Valide un formulaire complet
 *
 * Ne valide que les champs visibles (basés sur displayIf)
 * Retourne toutes les erreurs de validation
 *
 * @param fields - Champs du formulaire
 * @param values - Valeurs actuelles du formulaire
 * @returns Résultat de validation avec toutes les erreurs
 */
export function validateForm(
  fields: ApiInputType[],
  values: Record<string, unknown>
): FormValidationResult {
  const errors: Record<string, string> = {};

  // Pour chaque champ
  for (const field of fields) {
    // Vérifier si le champ est visible
    const isVisible = evaluateDisplayIf(field.displayIf, values);

    // On ne valide que les champs visibles
    // (les champs cachés ne doivent pas être dans le payload final)
    if (!isVisible) {
      continue;
    }

    // Obtenir la valeur du champ
    const value = values[field.property] as ValueType;

    // Valider le champ et ses enfants récursivement
    const fieldErrors = validateFieldRecursive(
      field,
      value,
      values,
      field.property
    );
    Object.assign(errors, fieldErrors);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valide un seul champ par son chemin
 * Utile pour la validation en temps réel
 */
export function validateFieldByPath(
  fields: ApiInputType[],
  property: string,
  values: Record<string, unknown>
): { isValid: boolean; error?: string } {
  // Trouver le champ
  const field = fields.find((f) => f.property === property);

  if (!field) {
    return {
      isValid: false,
      error: "Champ non trouvé",
    };
  }

  // Vérifier si le champ est visible
  const isVisible = evaluateDisplayIf(field.displayIf, values);

  // Si caché, considéré comme valide (ne sera pas dans le payload)
  if (!isVisible) {
    return { isValid: true };
  }

  // Obtenir la valeur
  const value = values[property] as ValueType;

  // Valider
  const result = validateField(field, value, values);

  return {
    isValid: result.isValid,
    error: result.error,
  };
}
