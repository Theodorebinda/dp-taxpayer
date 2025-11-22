/**
 * Moteur de validation custom pour un champ individuel
 * Remplace Zod - validation runtime basée sur la définition API
 */

import type { ApiInputType, ValueType } from "@/types/types";
import type { FieldValidationResult, FieldValidationConfig } from "../types";

/**
 * Extrait la configuration de validation depuis un champ API
 */
function extractValidationConfig(field: ApiInputType): FieldValidationConfig {
  // Pour l'instant, on utilise les propriétés existantes du champ
  // TODO: Si l'API ajoute des règles de validation supplémentaires, les extraire ici
  return {
    required: !field.isOptional,
    // min/max peuvent être ajoutés si l'API les fournit
    // pattern peut être ajouté si l'API le fournit
  };
}

/**
 * Valide une valeur string
 */
function validateString(
  value: unknown,
  config: FieldValidationConfig
): string | null {
  const str = typeof value === "string" ? value : String(value ?? "");

  // Required
  if (config.required && (!str || str.trim().length === 0)) {
    return `${config.required ? "Ce champ est requis" : ""}`;
  }

  // MinLength
  if (config.minLength !== undefined && str.length < config.minLength) {
    return `Doit contenir au moins ${config.minLength} caractère(s)`;
  }

  // MaxLength
  if (config.maxLength !== undefined && str.length > config.maxLength) {
    return `Ne doit pas dépasser ${config.maxLength} caractère(s)`;
  }

  // Pattern (regex)
  if (config.pattern && !new RegExp(config.pattern).test(str)) {
    return "Format invalide";
  }

  return null;
}

/**
 * Valide une valeur number
 */
function validateNumber(
  value: unknown,
  config: FieldValidationConfig
): string | null {
  // Conversion en nombre
  const num =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseFloat(value)
      : null;

  // Required
  if (config.required && (num === null || Number.isNaN(num))) {
    return "Ce champ est requis";
  }

  // Si pas required et valeur invalide, retourner null (valide car optionnel)
  if (num === null || Number.isNaN(num)) {
    return null;
  }

  // Min
  if (config.min !== undefined && num < config.min) {
    return `Doit être supérieur ou égal à ${config.min}`;
  }

  // Max
  if (config.max !== undefined && num > config.max) {
    return `Doit être inférieur ou égal à ${config.max}`;
  }

  return null;
}

/**
 * Valide une valeur array
 */
function validateArray(
  value: unknown,
  config: FieldValidationConfig
): string | null {
  const arr = Array.isArray(value) ? value : [];

  // Required
  if (config.required && arr.length === 0) {
    return "Au moins un élément est requis";
  }

  // MinLength (nombre minimum d'éléments)
  if (config.minLength !== undefined && arr.length < config.minLength) {
    return `Au moins ${config.minLength} élément(s) requis`;
  }

  // MaxLength (nombre maximum d'éléments)
  if (config.maxLength !== undefined && arr.length > config.maxLength) {
    return `Maximum ${config.maxLength} élément(s) autorisé(s)`;
  }

  return null;
}

/**
 * Valide une valeur boolean
 */
function validateBoolean(
  value: unknown,
  config: FieldValidationConfig
): string | null {
  // Pour les booléens, on vérifie surtout si required
  if (config.required && value === null && value === undefined) {
    return "Ce champ est requis";
  }

  return null;
}

/**
 * Valide un email
 */
function validateEmail(
  value: unknown,
  config: FieldValidationConfig
): string | null {
  const str = typeof value === "string" ? value : String(value ?? "");

  // Required
  if (config.required && (!str || str.trim().length === 0)) {
    return "L'email est requis";
  }

  // Si pas required et vide, valide
  if (!str || str.trim().length === 0) {
    return null;
  }

  // Format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(str)) {
    return "Format d'email invalide";
  }

  return null;
}

/**
 * Valide un numéro de téléphone mobile
 */
function validateMobile(
  value: unknown,
  config: FieldValidationConfig
): string | null {
  const str = typeof value === "string" ? value : String(value ?? "");

  // Required
  if (config.required && (!str || str.trim().length === 0)) {
    return "Le numéro de téléphone est requis";
  }

  // Si pas required et vide, valide
  if (!str || str.trim().length === 0) {
    return null;
  }

  // Format international E.164
  const mobileRegex = /^\+?[1-9]\d{1,14}$/;
  if (!mobileRegex.test(str.replace(/\s/g, ""))) {
    return "Format de numéro de téléphone invalide (format international requis)";
  }

  return null;
}

/**
 * Valide une valeur selon le type du champ
 */
function validateByType(
  value: unknown,
  field: ApiInputType,
  config: FieldValidationConfig
): string | null {
  // Si le champ est optionnel et la valeur est vide/null, valide
  if (
    !config.required &&
    (value === null || value === undefined || value === "")
  ) {
    return null;
  }

  switch (field.type) {
    case "text":
    case "text_area":
    case "code":
    case "json":
      return validateString(value, config);

    case "number":
    case "float":
      return validateNumber(value, config);

    case "email":
      return validateEmail(value, config);

    case "password":
      const passwordError = validateString(value, {
        ...config,
        minLength: 8, // Minimum 8 caractères pour les mots de passe
      });
      return passwordError;

    case "mobile":
      return validateMobile(value, config);

    case "boolean":
      return validateBoolean(value, config);

    case "select":
      // Pour select, vérifier si la valeur est dans les options
      if (
        config.required &&
        (value === null || value === undefined || value === "")
      ) {
        return "Veuillez sélectionner une option";
      }
      if (field.options && field.options.length > 0) {
        const validValues = field.options.map((opt) =>
          typeof opt === "string" || typeof opt === "number" ? opt : opt.value
        );
        if (
          value !== null &&
          value !== undefined &&
          !validValues.includes(value as never)
        ) {
          return "Valeur non valide";
        }
      }
      return null;

    case "multi_select":
      // Pour multi_select, c'est un tableau
      if (config.required) {
        const arrError = validateArray(value, config);
        if (arrError) return arrError;
      }
      // Vérifier que toutes les valeurs sont dans les options
      if (field.options && field.options.length > 0) {
        const validValues = field.options.map((opt) =>
          typeof opt === "string" || typeof opt === "number" ? opt : opt.value
        );
        const values = Array.isArray(value) ? value : [];
        const invalidValues = values.filter(
          (v) => !validValues.includes(v as never)
        );
        if (invalidValues.length > 0) {
          return "Certaines valeurs ne sont pas valides";
        }
      }
      return null;

    case "date":
      // Pour date, vérifier si c'est une date valide
      if (
        config.required &&
        (value === null || value === undefined || value === "")
      ) {
        return "La date est requise";
      }
      if (value && typeof value === "string") {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return "Format de date invalide";
        }
      }
      return null;

    case "file":
    case "webcam":
    case "id_scan":
      // Pour les fichiers, vérifier seulement si required
      if (config.required && (value === null || value === undefined)) {
        return "Un fichier est requis";
      }
      return null;

    case "children":
      // Les children sont validés récursivement dans validateForm
      // Ici, on vérifie seulement si required
      if (config.required) {
        if (field.multiple) {
          // Tableau d'objets
          const arr = Array.isArray(value) ? value : [];
          if (arr.length === 0) {
            return "Au moins un élément est requis";
          }
        } else {
          // Objet unique
          if (!value || typeof value !== "object") {
            return "Ce champ est requis";
          }
        }
      }
      return null;

    default:
      // Pour les types inconnus, vérifier seulement required
      if (
        config.required &&
        (value === null || value === undefined || value === "")
      ) {
        return "Ce champ est requis";
      }
      return null;
  }
}

/**
 * Valide un champ individuel
 *
 * @param field - Définition du champ depuis l'API
 * @param value - Valeur à valider
 * @param formValues - Toutes les valeurs du formulaire (pour validation dépendante)
 * @returns Résultat de validation
 */
export function validateField(
  field: ApiInputType,
  value: ValueType,
  formValues: Record<string, unknown> = {}
): FieldValidationResult {
  // Si le champ n'a pas de property, c'est invalide
  if (!field.property) {
    return {
      isValid: false,
      error: "Champ invalide : propriété manquante",
    };
  }

  // Extraire la configuration de validation
  const config = extractValidationConfig(field);

  // Valider selon le type
  const error = validateByType(value, field, config);

  // Validation personnalisée si fournie
  if (!error && config.customValidator) {
    const customError = config.customValidator(value, formValues);
    if (customError) {
      return {
        isValid: false,
        error: customError,
      };
    }
  }

  if (error) {
    return {
      isValid: false,
      error,
    };
  }

  return {
    isValid: true,
  };
}
