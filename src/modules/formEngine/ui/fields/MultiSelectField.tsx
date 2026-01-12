/**
 * Composant pour les champs multi-select
 * Wrapper autour de MultiSelectInput existant
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import MultiSelectInput from "@/components/form/inputs/multiSelectInput";

interface MultiSelectFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function MultiSelectField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: MultiSelectFieldProps) {
  const arrayValue = Array.isArray(value) ? value : [];

  // Utiliser isReadOnly au lieu de disabled car InputType n'a pas de prop disabled
  const readOnlyField = {
    ...field,
    isReadOnly: disabled || field.isReadOnly,
  };

  return (
    <FieldWrapper field={field} error={error}>
      <MultiSelectInput
        {...readOnlyField}
        value={arrayValue}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
        options={field.options || []}
      />
    </FieldWrapper>
  );
}
