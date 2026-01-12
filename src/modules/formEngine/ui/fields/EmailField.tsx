/**
 * Composant pour les champs email
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { TextField } from "./TextField";

interface EmailFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function EmailField(props: EmailFieldProps) {
  // EmailField est essentiellement un TextField avec type="email"
  return <TextField {...props} />;
}
