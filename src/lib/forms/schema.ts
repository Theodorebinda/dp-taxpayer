import { ApiInputType } from "@/types/types";

export type MappedInput =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "file"
  | "float"
  | "boolean"
  | "children"
  | "webcam"
  | "id_scan"
  | "mobile"
  | "email"
  | "password"
  | "text_area"
  | "json"
  | "code";

export type InputComponentKey =
  | "TextInput"
  | "NumberInput"
  | "SelectInput"
  | "MultiSelectInput"
  | "DateInput"
  | "FileInput"
  | "FloatInput"
  | "BooleanInput"
  | "ChildrenGroup"
  | "WebCamInput"
  | "IdScanInput"
  | "MobileInput"
  | "EmailInput"
  | "PasswordInput"
  | "TextAreaInput"
  | "JsonEditor"
  | "CodeEditor";

export function mapApiInputToComponentKey(
  input: Pick<ApiInputType, "type" | "tag">
): InputComponentKey {
  switch (input.type) {
    case "text":
      return "TextInput";
    case "number":
      return "NumberInput";
    case "select":
      return "SelectInput";
    case "multi_select":
      return "MultiSelectInput";
    case "date":
      return "DateInput";
    case "file":
      return "FileInput";
    case "float":
      return "FloatInput";
    case "boolean":
      return "BooleanInput";
    case "children":
      return "ChildrenGroup";
    case "webcam":
      return "WebCamInput";
    case "id_scan":
      return "IdScanInput";
    case "mobile":
      return "MobileInput";
    case "email":
      return "EmailInput";
    case "password":
      return "PasswordInput";
    case "text_area":
      return "TextAreaInput";
    case "json":
      return "JsonEditor";
    case "code":
      return "CodeEditor";
    default:
      return "TextInput";
  }
}
