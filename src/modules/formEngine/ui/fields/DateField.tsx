/**
 * Composant pour les champs date
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import TextInput from "@/components/form/inputs/textInput";

interface DateFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function DateField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: DateFieldProps) {
  const dateValue =
    typeof value === "string"
      ? value
      : value instanceof Date
      ? value.toISOString().split("T")[0]
      : "";

  return (
    <FieldWrapper field={field} error={error}>
      <TextInput
        {...field}
        type="date"
        value={dateValue}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
        // disabled={disabled || field.isReadOnly}
        // errorMessage={error}
      />
    </FieldWrapper>
  );
}
