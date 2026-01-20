// src/components/Input/IconInput.tsx
import React, { useEffect, useMemo, useState } from "react";
import { InputType } from "@/types/types";
import { useStore } from "zustand";
import { formValueStore } from "@/components/store/form_value.store";
import { getNestedValue, resizeArray } from "@/components/table/utils/utils";
import Input from "./input";

const bgColors: string[] = [
  "bg-green-100 dark:bg-green-500/30",
  "bg-blue-100 dark:bg-blue-500/30",
  "bg-red-100 dark:bg-red-500/30",
  "bg-emerald-100 dark:bg-emerald-500/30",
  "bg-violet-100 dark:bg-violet-500/30",
  "bg-cyan-100 dark:bg-cyan-500/30",
];

// Composant pour gérer le rendu des children
const ChildrenInput: React.FC<InputType & { depth: number }> = (props) => {
  const { depth } = props;
  const [displayAddChildButton, setDisplayAddChildButton] = useState<boolean>(
    props.multiple || false
  );
  const [childrenLimit, setChildrenLimit] = useState<number>(0);

  const formStore = useStore(formValueStore);

  const handleAddChild = () => {
    props.setValue(
      Array.isArray(props.value)
        ? [...((props.value as Record<string, any>[]) || []), {}]
        : [{}]
    );
  };

  const handleRemoveChild = (index: number) => {
    if (props.setValue) {
      props.setValue(
        (props.value as Record<string, any>[]).filter(
          (_: any, value_index: number) => value_index !== index
        )
      );
    }
  };

  const handleChildValueChange = (
    index: number,
    childProperty: string,
    value: any
  ) => {
    props.setValue(
      (props.value as any[]).map((current_value: any, child_index: number) => {
        if (index === child_index) {
          return {
            ...current_value,
            [childProperty]: value,
          };
        }
        return current_value;
      })
    );
  };

  const handleSingleChildValueChange = (childProperty: string, value: any) => {
    props.setValue({
      ...(props.value as Record<string, any>),
      [childProperty]: value,
    });
  };

  const getParentPropertyOptions = useMemo(() => {
    return (props.parentFields || [])
      .map((field) => {
        if (field.type === "children") return null;
        return {
          value: field.property,
          label: field.verbose,
        };
      })
      .filter((field) => field !== null);
  }, [props.parentFields]);

  useEffect(() => {
    if (props.multiple == undefined || props.multiple) {
      let limit = 0;
      let gateDisabled = false;
      const limitConfig = props.childrenConfig?.childrenLimit;
      const path = limitConfig?.returnFromStorePath;
      if (path) {
        const rawValue = getNestedValue(
          path.startsWith("{PARENT_PATH}")
            ? props.parentValue
            : formStore.value,
          path.split("{PARENT_PATH}.")[1]
        );

        if (typeof rawValue === "boolean") {
          gateDisabled = !rawValue;
          limit = 0;
        } else if (typeof rawValue === "number") {
          limit = rawValue;
        } else if (typeof rawValue === "string") {
          const parsed = Number(rawValue);
          if (Number.isFinite(parsed)) {
            limit = parsed;
          } else {
            gateDisabled = true;
            limit = 0;
          }
        } else if (rawValue == null) {
          gateDisabled = true;
          limit = 0;
        }
      } else if (limitConfig) {
        limit = limitConfig.return;
      }

      const valueLength = (Array.isArray(props.value) ? props.value : [])
        .length;

      if (gateDisabled) {
        setDisplayAddChildButton(false);
      } else if (!limit || limit == 0) {
        setDisplayAddChildButton(true);
      } else if (valueLength >= limit) {
        setDisplayAddChildButton(false);
      } else {
        setDisplayAddChildButton(props.multiple || true);
      }

      setChildrenLimit(limit);
    }
  }, [props.value, props.parentValue]);

  useEffect(() => {
    if (childrenLimit > 0) {
      const newChildren = resizeArray(
        Array.isArray(props.value) ? props.value : [],
        childrenLimit
      );
      props.setValue(newChildren);
    }
  }, [childrenLimit]);

  return (
    <div
      className={`rounded-lg shadow-sm ${
        bgColors[depth % bgColors.length]
      } p-5 flex flex-col gap-5 items-start w-full 
        ${depth < 2 && props.style?.childrenColumns && "lg:grid"}
        ${depth < 2 && props.style?.childrenColumns === 2 && "lg:grid-cols-2"}
        ${depth < 2 && props.style?.childrenColumns === 1 && "lg:grid-cols-1"}
      `}
    >
      {props.multiple || props.multiple === undefined ? (
        // Multiple children
        (Array.isArray(props.value) ? props.value : []).map((_, fieldIndex) => (
          <div key={`${props.property}-${fieldIndex}`} className="w-full">
            <div className="flex items-center justify-between">
              <h1 className="text-nowrap font-semibold">
                {props.childrenConfig?.childLabel || "Enfant"} #{fieldIndex + 1}
              </h1>
              {childrenLimit == 0 && (
                <button
                  type="button"
                  className="text-red-500 w-full text-right mb-2"
                  onClick={() => handleRemoveChild(fieldIndex)}
                >
                  Supprimer
                </button>
              )}
            </div>

            <div className="w-full bg-background rounded-lg p-5 space-y-5">
              {(props.children || []).map((child, childIndex) => {
                const options = child?.optionsTags?.getParentProperties
                  ? getParentPropertyOptions
                  : undefined;
                const key = `${child.property}-${depth + 1}-${childIndex}-${
                  props.property
                }`;
                return (
                  <Input
                    key={key}
                    depth={depth + 1}
                    {...{
                      ...child,
                      parentValue: (props.value as Record<string, any>[])?.[
                        fieldIndex
                      ],
                      grandparentValue: props.parentValue as Record<
                        string,
                        any
                      >,
                      value: (props.value as any[])?.[fieldIndex]?.[
                        child.property
                      ],
                      ...(options && { options }),
                      children: child.children ?? props.children,
                      setValue: (value) =>
                        handleChildValueChange(
                          fieldIndex,
                          child.property,
                          value
                        ),
                      parentFields: props.children || [],
                      storePath: `${props.storePath}?.${childIndex}?.${child.property}`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))
      ) : (
        // Single child
        <div key={`${props.property}-single`} className="w-full space-y-5">
          {props?.children?.map((field) => (
            <Input
              key={`${props.property}-${field.property}`}
              {...{
                ...field,
                depth: depth + 1,
                isOptional: props.isOptional ? true : field.isOptional,
                parentValue: props.value as Record<string, any>,
                grandparentValue: props.parentValue as Record<string, any>,
                value: (props.value as Record<string, any>)?.[field.property],
                setValue: (value) =>
                  handleSingleChildValueChange(field.property, value),
                parentFields: props.children || [],
                storePath: `${props.storePath}?.${field.property}`,
              }}
            />
          ))}
        </div>
      )}
      {displayAddChildButton && (
        <button type="button" className="text-sky-600" onClick={handleAddChild}>
          {props?.childrenConfig?.addChildButtonLabel || "Ajouter un enfant"}{" "}
          {JSON.stringify(props.multiple)}
        </button>
      )}
    </div>
  );
};

export default ChildrenInput;
