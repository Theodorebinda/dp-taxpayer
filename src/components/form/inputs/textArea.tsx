// src/components/Input/TextAreaInput.tsx
import { InputType } from "@/types/types";
import React from "react";

const TextAreaInput: React.FC<InputType> = ({
  id,
  // type,
  placeholder,
  value,
  setValue,
  isOptional,
  property,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue: string = e.target.value;
    setValue?.(newValue);
  };

  return (
    <div className="relative">
      <textarea
        className="w-full min-w-52 text-sm rounded border bg-gray px-3 py-2 font-light text-foreground border-gray-400 outline-none bg-background"
        rows={4}
        name={property}
        placeholder={placeholder}
        id={id}
        disabled={props.isReadOnly}
        value={(value as string) || ""}
        onChange={handleChange}
        required={!isOptional}
      />
    </div>
  );
};

export default TextAreaInput;
