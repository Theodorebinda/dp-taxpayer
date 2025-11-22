/**
 * Composant principal DynamicField
 * Dispatch vers les composants spécialisés selon le type de champ
 * Stateless - reçoit seulement props, pas de logique interne
 */

"use client";

import type { ApiInputType, ValueType } from "@/types/types";
import type { DynamicFieldProps } from "../types";
import { TextField } from "./fields/TextField";
import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";
import { MultiSelectField } from "./fields/MultiSelectField";
import { DateField } from "./fields/DateField";
import { BooleanField } from "./fields/BooleanField";
import { TextAreaField } from "./fields/TextAreaField";
import { FileField } from "./fields/FileField";
import { EmailField } from "./fields/EmailField";
import { PasswordField } from "./fields/PasswordField";
import { MobileField } from "./fields/MobileField";
import { JsonField } from "./fields/JsonField";
import { ChildrenField } from "./fields/ChildrenField";

/**
 * Composant DynamicField - point d'entrée unique pour tous les champs
 */
export function DynamicField({
  field,
  value,
  onChange,
  error,
  parentValue = {},
  depth = 0,
  disabled = false,
}: DynamicFieldProps) {
  // Props communes pour tous les champs
  const commonProps = {
    field,
    value,
    onChange,
    error,
    disabled,
    parentValue,
    depth,
  };

  // Dispatch vers le composant approprié selon le type
  switch (field.type) {
    case "text":
      return <TextField {...commonProps} />;

    case "number":
    case "float":
      return <NumberField {...commonProps} />;

    case "select":
      return <SelectField {...commonProps} />;

    case "multi_select":
      return <MultiSelectField {...commonProps} />;

    case "date":
      return <DateField {...commonProps} />;

    case "boolean":
      return <BooleanField {...commonProps} />;

    case "text_area":
      return <TextAreaField {...commonProps} />;

    case "email":
      return <EmailField {...commonProps} />;

    case "password":
      return <PasswordField {...commonProps} />;

    case "mobile":
      return <MobileField {...commonProps} />;

    case "json":
    case "code":
      return <JsonField {...commonProps} />;

    case "file":
    case "webcam":
    case "id_scan":
      return <FileField {...commonProps} />;

    case "children":
      return <ChildrenField {...commonProps} />;

    default:
      // Par défaut, utiliser TextField
      console.warn(
        `Type de champ non supporté: ${field.type}, utilisation de TextField par défaut`
      );
      return <TextField {...commonProps} />;
  }
}
