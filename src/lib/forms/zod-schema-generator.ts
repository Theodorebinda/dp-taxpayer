import { z } from "zod";
import type { ApiInputType } from "@/types/types";

/**
 * Génère un schéma Zod dynamique à partir d'un tableau de champs API
 */
export function generateZodSchema(
  fields: ApiInputType[],
  parentPath = ""
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  // S'assurer que fields est un tableau
  if (!Array.isArray(fields)) {
    console.warn("generateZodSchema: fields is not an array", fields);
    return z.object({});
  }

  fields.forEach((field) => {
    if (field.type === "children") {
      // Pour les champs enfants, on crée un schéma récursif
      if (field.children && field.children.length > 0) {
        if (field.multiple) {
          // Tableau d'objets
          shape[field.property] = z.array(
            generateZodSchema(field.children, `${parentPath}.${field.property}`)
          );
        } else {
          // Objet unique
          shape[field.property] = generateZodSchema(
            field.children,
            `${parentPath}.${field.property}`
          );
        }
      }
      return;
    }

    let fieldSchema: z.ZodTypeAny;

    // Générer le schéma de base selon le type
    switch (field.type) {
      case "text":
      case "text_area":
      case "code":
      case "json":
        fieldSchema = z.string();
        break;

      case "email":
        fieldSchema = z.string().email("Format d'email invalide");
        break;

      case "password":
        fieldSchema = z
          .string()
          .min(8, "Le mot de passe doit contenir au moins 8 caractères");
        break;

      case "number":
      case "float":
        fieldSchema = z.number({
          invalid_type_error: "Ce champ doit être un nombre",
        });
        break;

      case "date":
        fieldSchema = z.string().or(z.date());
        break;

      case "boolean":
        fieldSchema = z.boolean();
        break;

      case "select":
        if (field.options && field.options.length > 0) {
          const optionValues = field.options.map((opt) =>
            typeof opt === "string" || typeof opt === "number" ? opt : opt.value
          );
          fieldSchema = z.enum(optionValues as [string, ...string[]], {
            errorMap: () => ({
              message: "Valeur non valide",
            }),
          });
        } else {
          fieldSchema = z.string();
        }
        break;

      case "multi_select":
        if (field.options && field.options.length > 0) {
          const optionValues = field.options.map((opt) =>
            typeof opt === "string" || typeof opt === "number" ? opt : opt.value
          );
          fieldSchema = z.array(z.enum(optionValues as [string, ...string[]]));
        } else {
          fieldSchema = z.array(z.string());
        }
        break;

      case "file":
      case "webcam":
      case "id_scan":
        // Les fichiers sont gérés différemment, on accepte string ou File
        fieldSchema = z.union([z.string(), z.instanceof(File)]).optional();
        break;

      case "mobile":
        fieldSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, {
          message: "Format de numéro de téléphone invalide",
        });
        break;

      default:
        // Par défaut, on accepte n'importe quelle valeur
        fieldSchema = z.unknown();
    }

    // Rendre optionnel si le champ est marqué comme optionnel
    if (field.isOptional) {
      fieldSchema = fieldSchema.optional().or(z.literal(""));
    } else {
      // Ajouter un message d'erreur personnalisé pour les champs requis
      // Pour les strings, on utilise min(1), pour les autres types on utilise refine
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, {
          message: `${field.verbose || field.property} est requis`,
        });
      } else if (fieldSchema instanceof z.ZodNumber) {
        // Les nombres sont déjà validés, on peut ajouter un refine si nécessaire
        fieldSchema = fieldSchema.refine(
          (val) => val !== null && val !== undefined,
          {
            message: `${field.verbose || field.property} est requis`,
          }
        );
      } else if (fieldSchema instanceof z.ZodArray) {
        fieldSchema = fieldSchema.min(1, {
          message: `${field.verbose || field.property} est requis`,
        });
      } else {
        // Pour les autres types, on utilise refine
        fieldSchema = fieldSchema.refine(
          (val) => val !== null && val !== undefined && val !== "",
          {
            message: `${field.verbose || field.property} est requis`,
          }
        );
      }
    }

    // Gérer les valeurs null
    if (field.isOptional) {
      fieldSchema = fieldSchema.nullable();
    }

    shape[field.property] = fieldSchema;
  });

  return z.object(shape);
}
