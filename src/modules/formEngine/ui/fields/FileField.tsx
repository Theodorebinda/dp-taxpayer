/**
 * Composant pour les champs file (fichiers, webcam, id_scan)
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import InputFile from "@/components/form/inputs/inputFile";
import InputWebcam from "@/components/form/inputs/webCam";

interface FileFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function FileField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: FileFieldProps) {
  if (field.type === "webcam") {
    return (
      <FieldWrapper field={field} error={error}>
        <InputWebcam
          {...field}
          value={value}
          setValue={(newValue) => onChange(newValue as ValueType)}
          parentValue={parentValue}
          depth={depth}
          // disabled={disabled || field.isReadOnly}
          // errorMessage={error}
        />
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper field={field} error={error}>
      <InputFile
        {...field}
        value={value}
        setValue={(newValue) => onChange(newValue as ValueType)}
        parentValue={parentValue}
        depth={depth}
        // disabled={disabled || field.isReadOnly}
        // errorMessage={error}
      />
    </FieldWrapper>
  );
}
