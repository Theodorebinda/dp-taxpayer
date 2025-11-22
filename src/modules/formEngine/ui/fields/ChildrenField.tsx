/**
 * Composant pour les champs children (champs imbriqués)
 * Support complet des champs imbriqués avec récursion
 *
 * Supporte :
 * - Objets simples (multiple: false)
 * - Tableaux d'objets (multiple: true)
 * - Affichage conditionnel récursif
 * - Validation récursive
 */

"use client";

import React, { useCallback } from "react";
import type { ApiInputType, ValueType } from "@/types/types";
import { FieldWrapper } from "../FieldWrapper";
import { DynamicField } from "../DynamicField";
import { evaluateDisplayIf } from "../../validators";

interface ChildrenFieldProps {
  field: ApiInputType;
  value: ValueType;
  onChange: (value: ValueType) => void;
  error?: string;
  disabled?: boolean;
  parentValue?: Record<string, unknown>;
  depth?: number;
}

export function ChildrenField({
  field,
  value,
  onChange,
  error,
  disabled = false,
  parentValue = {},
  depth = 0,
}: ChildrenFieldProps) {
  // S'assurer que le champ a des children
  if (!field.children || field.children.length === 0) {
    return (
      <FieldWrapper field={field} error={error}>
        <div className="text-sm text-muted-foreground">
          Aucun champ enfant défini
        </div>
      </FieldWrapper>
    );
  }

  // Mode multiple (tableau d'objets)
  if (field.multiple) {
    const childrenArray = Array.isArray(value) ? value : [];

    const handleAddChild = () => {
      const newChild: Record<string, unknown> = {};
      onChange([...childrenArray, newChild] as ValueType);
    };

    const handleRemoveChild = (index: number) => {
      const newArray = childrenArray.filter((_, i) => i !== index);
      onChange(newArray as ValueType);
    };

    const handleChildChange = (
      childIndex: number,
      childProperty: string,
      childValue: ValueType
    ) => {
      const newArray = [...childrenArray];
      if (!newArray[childIndex]) {
        newArray[childIndex] = {};
      }
      (newArray[childIndex] as Record<string, unknown>)[childProperty] =
        childValue;
      onChange(newArray as ValueType);
    };

    const childLabel = field.childrenConfig?.childLabel || "Élément";
    const addButtonLabel =
      field.childrenConfig?.addChildButtonLabel || "Ajouter un élément";

    return (
      <FieldWrapper field={field} error={error}>
        <div className="flex flex-col gap-4">
          {childrenArray.map((childObj, index) => {
            if (typeof childObj !== "object" || childObj === null) {
              return null;
            }

            const childValues = childObj as Record<string, unknown>;

            return (
              <div
                key={`${field.property}-${index}`}
                className="rounded-lg border border-border bg-background p-4 space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">
                    {childLabel} #{index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChild(index)}
                    className="text-sm text-red-500 hover:text-red-700"
                    disabled={disabled}
                  >
                    Supprimer
                  </button>
                </div>

                <div
                  className={`grid gap-4 ${
                    field.style?.childrenColumns === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {(field.children || [])
                    .filter((childField) =>
                      evaluateDisplayIf(childField.displayIf, childValues)
                    )
                    .map((childField) => (
                      <DynamicField
                        key={childField.property}
                        field={childField}
                        value={
                          (childValues[childField.property] as ValueType) ??
                          null
                        }
                        onChange={(childValue) =>
                          handleChildChange(
                            index,
                            childField.property,
                            childValue
                          )
                        }
                        parentValue={childValues}
                        depth={depth + 1}
                        disabled={disabled}
                      />
                    ))}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddChild}
            className="text-sm text-primary hover:text-primary/80"
            disabled={disabled}
          >
            {addButtonLabel}
          </button>
        </div>
      </FieldWrapper>
    );
  }

  // Mode simple (objet unique)
  else {
    const childObject =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};

    const handleChildChange = (
      childProperty: string,
      childValue: ValueType
    ) => {
      const newObject = { ...childObject, [childProperty]: childValue };
      onChange(newObject as ValueType);
    };

    // Filtrer les enfants visibles
    const visibleChildren = field.children.filter((childField) =>
      evaluateDisplayIf(childField.displayIf, childObject)
    );

    return (
      <FieldWrapper field={field} error={error}>
        <div
          className={`grid gap-4 rounded-lg border border-border bg-background p-4 ${
            field.style?.childrenColumns === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {visibleChildren.map((childField) => (
            <DynamicField
              key={childField.property}
              field={childField}
              value={(childObject[childField.property] as ValueType) ?? null}
              onChange={(childValue) =>
                handleChildChange(childField.property, childValue)
              }
              parentValue={childObject}
              depth={depth + 1}
              disabled={disabled}
            />
          ))}
        </div>
      </FieldWrapper>
    );
  }
}
