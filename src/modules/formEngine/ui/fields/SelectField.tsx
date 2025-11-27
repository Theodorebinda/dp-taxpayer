/**
 * Composant pour les champs select
 * Wrapper autour de SelectInput existant
 */

"use client";

import React, { useState } from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import SelectInput from "@/components/form/inputs/selectInput";
import { useSelectOptions } from "../../hooks/useSelectOptions";

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
  const [searchTerm, setSearchTerm] = useState("");
  const {
    options: remoteOptions,
    isLoading,
    isFetching,
  } = useSelectOptions(field, searchTerm);
  const mergedOptions = remoteOptions?.length
    ? remoteOptions
    : field.options || [];
  const loading = isLoading || isFetching;

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
        options={mergedOptions}
        searchLoading={loading}
        onSearch={(term) => setSearchTerm(term)}
      />
    </FieldWrapper>
  );
}
