"use client";

import { Controller } from "react-hook-form";
import Input from "./inputs/input";
import type { ApiInputType, ValueType } from "@/types/types";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface DynamicFormFieldProps<T extends FieldValues> {
  field: ApiInputType;
  control: Control<T>;
  parentValue?: Record<string, unknown> | null;
  parentFields?: ApiInputType[];
  depth?: number;
  storePath?: string;
}

/**
 * Composant qui intègre Input avec React Hook Form Controller
 * pour la validation et la gestion des valeurs
 */
export function DynamicFormField<T extends FieldValues>({
  field,
  control,
  parentValue,
  parentFields,
  depth = 0,
  storePath,
}: DynamicFormFieldProps<T>) {
  const fieldName = field.property as FieldPath<T>;

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field: { onChange, value, ...fieldProps }, fieldState }) => {
        // Convertir la valeur pour le composant Input
        const inputValue: ValueType = value ?? null;

        // Créer les props pour Input
        const inputProps = {
          ...field,
          ...fieldProps,
          value: inputValue,
          parentValue: parentValue || {},
          parentFields: parentFields || [],
          depth,
          storePath: storePath || field.property,
          setValue: (newValue: ValueType) => {
            onChange(newValue);
          },
          // Passer l'erreur de validation si elle existe
          errorMessage: fieldState.error?.message,
        };

        return <Input {...inputProps} />;
      }}
    />
  );
}
