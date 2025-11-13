// src/components/Input/Input.tsx
import React, { useMemo } from "react";
import { InputType, DisplayIf } from "@/types/types";

import { capitalizeWords } from "@/utils/utils";
import { FieldDoc } from "../utils/docs";
import { InputPerType } from "../utils/inputPerType";

// Fonction utilitaire pour vérifier les conditions d'affichage
const checkCondition = (
  displayIf: DisplayIf,
  object: Record<string, any> | null | undefined
): boolean => {
  const valueInObj = object?.[displayIf.property];
  if (valueInObj === undefined) return false;

  switch (displayIf.condition) {
    case "IN":
      return Array.isArray(displayIf.value)
        ? displayIf.value.includes(valueInObj)
        : false;
    case "IS":
      return displayIf.value == valueInObj;
    case "LIKE":
      return JSON.stringify(displayIf.value)?.includes(
        JSON.stringify(valueInObj)
      );
    case "NOT":
      return !JSON.stringify(displayIf.value)?.includes(
        JSON.stringify(valueInObj)
      );
    case "NOT IN":
      return Array.isArray(displayIf.value)
        ? !displayIf.value.includes(valueInObj)
        : true;
    default:
      return displayIf.value == valueInObj;
  }
};

// Composant Input principal
const Input: React.FC<InputType> = (props) => {
  // Vérifier les conditions d'affichage
  const shouldDisplay = useMemo(() => {
    if (!props.displayIf || JSON.stringify(props.displayIf) === "{}")
      return true;

    if (Array.isArray(props.displayIf)) {
      return props.displayIf.every((condition) =>
        checkCondition(condition, props.parentValue)
      );
    }

    if (typeof props.displayIf === "object") {
      return checkCondition(props.displayIf, props.parentValue);
    }

    return false;
  }, [props.displayIf, props.parentValue]);

  if (!shouldDisplay) {
    if (props.parentValue) {
      props.parentValue[props.property] = null;
    }
    return null;
  }

  return (
    <div
      className={`w-full flex flex-col gap-2 ${
        (props.style?.colSpan === "full" || props.tag === "csv") &&
        "col-span-full"
      }`}
    >
      <label
        className={
          "font-medium text-foreground " +
          (props.type === "boolean" ? "flex gap-5 items-center" : "")
        }
        htmlFor={props.id || props.property}
      >
        {capitalizeWords(props.verbose || props.property)}
        {!props.isOptional && <span className="text-sm text-red-500">*</span>}
        {props.doc && <FieldDoc content={props.doc} />}
      </label>
      <InputPerType {...props} />
    </div>
  );
};

export default Input;
