"use client";

import Input from "@/components/commons/dynamicInput";
import { ApiInputType, ValueType } from "@/types/types";

type StepFormProps = {
  fields: ApiInputType[];
  formData: Record<string, unknown>;
  onChange: (property: string, value: ValueType) => void;
};

export default function StepForm({
  fields,
  formData,
  onChange,
}: StepFormProps) {
  // console.log("formData", formData);
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.property}>
          <Input
            {...field}
            value={(formData[field.property] as ValueType) ?? ""}
            setValue={(value: ValueType) => onChange(field.property, value)}
          />
        </div>
      ))}
    </div>
  );
}
