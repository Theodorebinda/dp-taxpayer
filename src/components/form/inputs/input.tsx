// src/components/Input/Input.tsx
import React, { useEffect, useMemo } from "react";
import { InputType, DisplayIf, DisplayIfValueType } from "@/types/types";

import { capitalizeWords } from "@/utils/utils";
import { FieldDoc } from "../utils/docs";
import { InputPerType } from "../utils/inputPerType";

// Fonction utilitaire pour vérifier les conditions d'affichage
const checkCondition = (
  displayIf: DisplayIf,
  object: Record<string, unknown> | null | undefined
): boolean => {
  const valueInObj = object?.[displayIf.property] as
    | DisplayIfValueType
    | undefined;
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

  // Si le champ ne doit pas s'afficher, on nettoie sa valeur via setValue (sans muter les props)
  const { setValue } = props;
  useEffect(() => {
    if (!shouldDisplay && typeof setValue === "function") {
      // on remet la valeur à null pour refléter l'absence d'entrée utilisateur
      setValue(null);
    }
  }, [shouldDisplay, setValue]);

  if (!shouldDisplay) {
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
      {(() => {
        const errorMessage = (props as InputType & { errorMessage?: string })
          .errorMessage;
        return (
          errorMessage &&
          typeof errorMessage === "string" && (
            <p className="mt-1 text-xs text-red-500" role="alert">
              {errorMessage}
            </p>
          )
        );
      })()}
    </div>
  );
};

export default Input;
