/**
 * Wrapper commun pour tous les champs
 * Gère le label, l'erreur, la documentation, etc.
 */

"use client";

import React from "react";
import type { ApiInputType } from "@/types/types";
import { capitalizeWords } from "@/utils/utils";
import { FieldDoc } from "@/components/form/utils/docs";

interface FieldWrapperProps {
  field: ApiInputType;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper commun pour tous les champs dynamiques
 */
export function FieldWrapper({
  field,
  error,
  children,
  className = "",
}: FieldWrapperProps) {
  const isFullWidth = field.style?.colSpan === "full" || field.tag === "csv";

  const isBoolean = field.type === "boolean";

  return (
    <div
      className={`w-full flex flex-col gap-2 ${
        isFullWidth ? "col-span-full" : ""
      } ${className}`}
    >
      {/* Label */}
      <label
        className={`font-medium text-foreground ${
          isBoolean ? "flex gap-5 items-center" : ""
        }`}
        htmlFor={field.id || field.property}
      >
        {capitalizeWords(field.verbose || field.property)}
        {!field.isOptional && (
          <span className="text-sm text-red-500" aria-label="requis">
            *
          </span>
        )}
        {field.doc && <FieldDoc content={field.doc} />}
      </label>

      {/* Champ */}
      {children}

      {/* Message d'erreur */}
      {error && typeof error === "string" && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      {/* Description optionnelle */}
      {field.placeholder && !error && (
        <p className="mt-1 text-xs text-muted-foreground">
          {field.placeholder}
        </p>
      )}
    </div>
  );
}
