/**
 * Évalue les conditions displayIf pour déterminer si un champ doit être affiché
 *
 * Centralisation de toute la logique displayIf - source unique de vérité
 * Utilisé par useDynamicForm et les composants UI
 */

import type { DisplayIf } from "@/types/types";

/**
 * Évalue une condition displayIf unique
 */
function evaluateSingleCondition(
  condition: DisplayIf,
  formValues: Record<string, unknown>
): boolean {
  const fieldValue = formValues[condition.property];

  // Si la valeur est undefined, la condition échoue
  if (fieldValue === undefined) {
    return false;
  }

  const { condition: operator = "IS", value: expectedValue } = condition;

  switch (operator) {
    case "IS":
      // Égalité stricte (== pour gérer string/number)
      return fieldValue == expectedValue;

    case "NOT":
      // Non égalité
      return fieldValue != expectedValue;

    case "IN":
      // La valeur du champ doit être dans le tableau attendu
      if (Array.isArray(expectedValue)) {
        return expectedValue.includes(fieldValue as never);
      }
      // Si expectedValue n'est pas un tableau, comparer directement
      return fieldValue === expectedValue;

    case "NOT IN":
      // La valeur du champ ne doit PAS être dans le tableau attendu
      if (Array.isArray(expectedValue)) {
        return !expectedValue.includes(fieldValue as never);
      }
      // Si expectedValue n'est pas un tableau, vérifier non-égalité
      return fieldValue !== expectedValue;

    case "LIKE":
      // Recherche de sous-chaîne (conversion en string)
      const fieldStr = String(fieldValue || "").toLowerCase();
      const expectedStr = String(expectedValue || "").toLowerCase();
      return fieldStr.includes(expectedStr);

    default:
      // Par défaut, égalité
      return fieldValue == expectedValue;
  }
}

/**
 * Évalue une condition displayIf ou un tableau de conditions
 *
 * Si c'est un tableau, toutes les conditions doivent être vraies (AND)
 *
 * @param conditions - Condition unique ou tableau de conditions
 * @param formValues - Valeurs actuelles du formulaire
 * @returns true si le champ doit être affiché, false sinon
 */
export function evaluateDisplayIf(
  conditions: DisplayIf | DisplayIf[] | undefined,
  formValues: Record<string, unknown>
): boolean {
  // Si pas de condition, le champ est toujours visible
  if (!conditions) {
    return true;
  }

  // Si c'est un objet vide, considéré comme pas de condition
  if (
    typeof conditions === "object" &&
    !Array.isArray(conditions) &&
    Object.keys(conditions).length === 0
  ) {
    return true;
  }

  // Normaliser en tableau
  const conditionsArray = Array.isArray(conditions) ? conditions : [conditions];

  // Toutes les conditions doivent être vraies (AND)
  return conditionsArray.every((condition) =>
    evaluateSingleCondition(condition, formValues)
  );
}

/**
 * Type guard pour vérifier si une valeur est un DisplayIf valide
 */
export function isDisplayIf(value: unknown): value is DisplayIf {
  return (
    typeof value === "object" &&
    value !== null &&
    "property" in value &&
    typeof (value as DisplayIf).property === "string"
  );
}
