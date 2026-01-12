/**
 * Composant pour les champs mobile (téléphone)
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import PhoneNumberInput from "@/components/form/inputs/inputMobile";

interface MobileFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function MobileField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: MobileFieldProps) {
  const mobileValue = typeof value === "string" ? value : "";

  return (
    <FieldWrapper field={field} error={error}>
      <PhoneNumberInput
        {...field}
        value={mobileValue}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
        // disabled={disabled || field.isReadOnly}
        // errorMessage={error}
      />
    </FieldWrapper>
  );
}
