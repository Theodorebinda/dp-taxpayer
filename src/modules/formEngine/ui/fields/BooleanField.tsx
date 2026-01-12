/**
 * Composant pour les champs boolean (checkbox)
 * Wrapper autour de BooleanInput existant
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import BooleanInput from "@/components/form/inputs/booleanInput";

interface BooleanFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function BooleanField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: BooleanFieldProps) {
  const boolValue = typeof value === "boolean" ? value : false;

  // Utiliser isReadOnly au lieu de disabled car InputType n'a pas de prop disabled
  // BooleanInput ne supporte pas disabled non plus, donc on le passe via isReadOnly
  const readOnlyField = {
    ...field,
    isReadOnly: disabled || field.isReadOnly,
  };

  return (
    <FieldWrapper field={field} error={error}>
      <BooleanInput
        {...readOnlyField}
        value={boolValue}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
      />
    </FieldWrapper>
  );
}
