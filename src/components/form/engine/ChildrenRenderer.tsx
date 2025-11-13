"use client";
import type { ApiInputType } from "@/types/types";
import FormRenderer from "./FormRenderer";

type Props = {
  field: ApiInputType;
  values: Record<string, any>;
  onChange: (property: string, value: any) => void;
  addChild: (property: string) => void;
  removeChildAt: (property: string, index: number) => void;
};

export default function ChildrenRenderer({
  field,
  values,
  onChange,
  addChild,
  removeChildAt,
}: Props) {
  const property = field.property;
  const items: any[] =
    property
      .split(".")
      .reduce((acc: any, key) => (acc ? acc[key] : undefined), values) ?? [];
  const children = field.children ?? [];
  const label = field?.childrenConfig?.childLabel ?? "Enfant";
  return (
    <div className="flex flex-col gap-3">
      {items.map((_, idx) => (
        <div
          key={`${property}-${idx}`}
          className="rounded-md border border-foreground/15 p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              {label} #{idx + 1}
            </div>
            <button
              type="button"
              className="text-red-500 text-sm"
              onClick={() => removeChildAt(property, idx)}
            >
              Supprimer
            </button>
          </div>
          <FormRenderer
            fields={children.map((c) => ({
              ...c,
              property: `${property}.${idx}.${c.property}`,
            }))}
            values={values}
            onChange={onChange}
            addChild={addChild}
            removeChildAt={removeChildAt}
          />
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-primary"
        onClick={() => addChild(property)}
      >
        {field?.childrenConfig?.addChildButtonLabel ?? "Ajouter un élément"}
      </button>
    </div>
  );
}
