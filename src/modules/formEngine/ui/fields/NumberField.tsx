/**
 * Composant pour les champs numériques
 * Wrapper autour de TextInput existant
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import TextInput from "@/components/form/inputs/textInput";

interface NumberFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function NumberField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: NumberFieldProps) {
  const inputValue =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
      ? value
      : "";

  const handleChange = (newValue: ValueType) => {
    const str =
      typeof newValue === "string" ? newValue : String(newValue ?? "");
    const num = str ? Number.parseFloat(str) : null;
    onChange(num !== null && !Number.isNaN(num) ? num : null);
  };

  // Utiliser isReadOnly au lieu de disabled car InputType n'a pas de prop disabled
  const readOnlyField = {
    ...field,
    isReadOnly: disabled || field.isReadOnly,
  };

  return (
    <FieldWrapper field={field} error={error}>
      <TextInput
        {...readOnlyField}
        type={field.type === "float" ? "text" : "number"}
        value={inputValue}
        setValue={(newValue) => handleChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
      />
    </FieldWrapper>
  );
}
