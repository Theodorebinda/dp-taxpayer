/**
 * Composant pour les champs select
 * Wrapper autour de SelectInput existant
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import SelectInput from "@/components/form/inputs/selectInput";

interface SelectFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function SelectField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: SelectFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <SelectInput
        {...field}
        value={value}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
        // disabled={disabled || field.isReadOnly}
        // errorMessage={error}
        options={field.options || []}
        searchLoading={false}
      />
    </FieldWrapper>
  );
}
