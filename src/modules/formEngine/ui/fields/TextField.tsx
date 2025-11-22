/**
 * Composant pour les champs texte
 * Wrapper autour de TextInput existant
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import TextInput from "@/components/form/inputs/textInput";

interface TextFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function TextField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: TextFieldProps) {
  const inputValue = typeof value === "string" ? value : "";

  return (
    <FieldWrapper field={field} error={error}>
      <TextInput
        {...field}
        value={inputValue}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
        // disabled={disabled || field.isReadOnly}
        // errorMessage={error}
      />
    </FieldWrapper>
  );
}
