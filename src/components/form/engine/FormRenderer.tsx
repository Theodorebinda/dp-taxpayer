"use client";
import type {
  ApiInputType,
  ValueType,
  InputType as EngineInputType,
} from "@/types/types";
import TextInput from "@/components/form/inputs/textInput";
import SelectInput from "@/components/form/inputs/selectInput";
import BooleanInput from "@/components/form/inputs/booleanInput";
import TextArea from "@/components/form/inputs/textArea";
import JsonEditor from "@/components/form/inputs/jsonEditor";
import MultiSelectInput from "@/components/form/inputs/multiSelectInput";
import InputFile from "@/components/form/inputs/inputFile";
import MobileInput from "@/components/form/inputs/inputMobile";
import WebCamInput from "@/components/form/inputs/webCam";
import ChildrenRenderer from "./ChildrenRenderer";
import { useMemo } from "react";

type Props = {
  fields: ApiInputType[];
  values: Record<string, unknown>;
  onChange: (property: string, value: ValueType) => void;
  addChild: (property: string) => void;
  removeChildAt: (property: string, index: number) => void;
};

export default function FormRenderer({
  fields,
  values,
  onChange,
  addChild,
  removeChildAt,
}: Props) {
  const items = useMemo(() => fields, [fields]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((field) => {
        const v = field.property
          .split(".")
          .reduce<unknown>((acc: unknown, key) => {
            if (
              acc &&
              typeof acc === "object" &&
              key in (acc as Record<string, unknown>)
            ) {
              return (acc as Record<string, unknown>)[key];
            }
            return undefined;
          }, values);
        const setValue = (val: ValueType) => onChange(field.property, val);
        const label = field.verbose ?? field.property;
        const baseProps: EngineInputType = {
          ...(field as EngineInputType),
          id: field.id ?? field.property,
          value: v as ValueType,
          setValue,
        };
        switch (field.type) {
          case "select":
            return (
              <div key={field.property}>
                <label className="block text-sm mb-1">{label}</label>
                <SelectInput
                  {...baseProps}
                  searchLoading={false}
                  options={baseProps.options ?? []}
                />
              </div>
            );
          case "multi_select":
            return (
              <div key={field.property}>
                <label className="block text-sm mb-1">{label}</label>
                <MultiSelectInput
                  {...baseProps}
                  options={baseProps.options ?? []}
                />
              </div>
            );
          case "boolean":
            return (
              <div key={field.property}>
                <label className="block text-sm mb-1">{label}</label>
                <BooleanInput {...baseProps} />
              </div>
            );
          case "text_area":
            return (
              <div key={field.property} className="md:col-span-2">
                <label className="block text-sm mb-1">{label}</label>
                <TextArea {...baseProps} />
              </div>
            );
          case "json":
            return (
              <div key={field.property} className="md:col-span-2">
                <label className="block text-sm mb-1">{label}</label>
                <JsonEditor {...baseProps} />
              </div>
            );
          case "file":
            return (
              <div key={field.property}>
                <label className="block text-sm mb-1">{label}</label>
                <InputFile {...baseProps} />
              </div>
            );
          case "mobile":
            return (
              <div key={field.property}>
                <label className="block text-sm mb-1">{label}</label>
                <MobileInput {...baseProps} />
              </div>
            );
          case "webcam":
            return (
              <div key={field.property} className="md:col-span-2">
                <label className="block text-sm mb-1">{label}</label>
                <WebCamInput {...baseProps} />
              </div>
            );
          case "children":
            return (
              <div key={field.property} className="md:col-span-2">
                <label className="block text-sm mb-1">{label}</label>
                <ChildrenRenderer
                  field={field}
                  values={values}
                  onChange={onChange}
                  addChild={addChild}
                  removeChildAt={removeChildAt}
                />
              </div>
            );
          default:
            return (
              <div key={field.property}>
                <label className="block text-sm mb-1">{label}</label>
                <TextInput {...baseProps} />
              </div>
            );
        }
      })}
    </div>
  );
}
