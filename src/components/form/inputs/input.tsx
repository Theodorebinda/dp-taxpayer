// src/components/Input/Input.tsx
import React, { useMemo, useState } from "react";
import { InputType } from "@/types/types";
import { evaluateDisplayIf } from "@/modules/formEngine/validators";

import { capitalizeWords } from "@/utils/utils";
import { FieldDoc } from "../utils/docs";
import { InputPerType } from "../utils/inputPerType";

// Composant Input principal
const Input: React.FC<InputType> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Vérifier les conditions d'affichage
  const shouldDisplay = useMemo(() => {
    return evaluateDisplayIf(props.displayIf, props.parentValue || {});
  }, [props.displayIf, props.parentValue]);

  if (!shouldDisplay) {
    return null;
  }

  const isFullSpan =
    props.style?.colSpan === "full" ||
    props.tag === "csv" ||
    (props.type === "children" && isExpanded);
  const showExpandToggle = props.type === "children";

  return (
    <div
      className={`w-full flex flex-col gap-2 ${isFullSpan && "col-span-full"}`}
    >
      {showExpandToggle ? (
        <div className="flex items-center justify-between">
          <label
            className="font-medium text-foreground"
            htmlFor={props.id || props.property}
          >
            {capitalizeWords(props.verbose || props.property)}
            {!props.isOptional && <span className="text-sm text-red-500">*</span>}
            {props.doc && <FieldDoc content={props.doc} />}
          </label>
          <button
            type="button"
            className="hidden lg:inline-flex items-center rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "><" : "<>"}
          </button>
        </div>
      ) : (
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
      )}
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
