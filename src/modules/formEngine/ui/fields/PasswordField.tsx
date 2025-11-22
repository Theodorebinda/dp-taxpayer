/**
 * Composant pour les champs password
 */

"use client";

import React from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { TextField } from "./TextField";

interface PasswordFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function PasswordField(props: PasswordFieldProps) {
  // PasswordField est essentiellement un TextField avec type="password"
  return <TextField {...props} />;
}
