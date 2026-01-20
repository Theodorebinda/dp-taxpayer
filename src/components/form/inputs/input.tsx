// src/components/Input/Input.tsx
import React, { useMemo } from "react";
import { InputType } from "@/types/types";
import { evaluateDisplayIf } from "@/modules/formEngine/validators";

import { capitalizeWords } from "@/utils/utils";
import { FieldDoc } from "../utils/docs";
import { InputPerType } from "../utils/inputPerType";

// Composant Input principal
const Input: React.FC<InputType> = (props) => {
  // Vérifier les conditions d'affichage
  const shouldDisplay = useMemo(() => {
    return evaluateDisplayIf(props.displayIf, props.parentValue || {});
  }, [props.displayIf, props.parentValue]);

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
