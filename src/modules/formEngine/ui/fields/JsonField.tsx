/**
 * Composant pour les champs JSON/Code
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import JsonEditor from "@/components/form/inputs/jsonEditor";

interface JsonFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function JsonField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: JsonFieldProps) {
  const jsonValue =
    typeof value === "string"
      ? value
      : value !== null && value !== undefined
      ? JSON.stringify(value, null, 2)
      : "";

  return (
    <FieldWrapper field={field} error={error}>
      <JsonEditor
        {...field}
        value={jsonValue}
        setValue={(newValue) => {
          // Essayer de parser le JSON, sinon garder comme string
          if (typeof newValue === "string") {
            try {
              const parsed = JSON.parse(newValue);
              onChange(parsed as ValueType);
            } catch {
              onChange(newValue as ValueType);
            }
          } else {
            onChange(newValue as ValueType);
          }
        }}
        parentValue={parentValue}
        depth={depth}
        // disabled={disabled || field.isReadOnly}
        // errorMessage={error}
      />
    </FieldWrapper>
  );
}
