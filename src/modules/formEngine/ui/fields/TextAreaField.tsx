/**
 * Composant pour les champs textarea
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import TextArea from "@/components/form/inputs/textArea";

interface TextAreaFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function TextAreaField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: TextAreaFieldProps) {
  const textValue = typeof value === "string" ? value : "";

  return (
    <FieldWrapper field={field} error={error}>
      <TextArea
        {...field}
        value={textValue}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
        // disabled={disabled || field.isReadOnly}
        // errorMessage={error}
      />
    </FieldWrapper>
  );
}
