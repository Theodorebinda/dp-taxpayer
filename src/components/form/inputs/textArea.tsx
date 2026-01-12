// src/components/Input/TextAreaInput.tsx
import { InputType } from "@/types/types";
import React from "react";

const TextAreaInput: React.FC<InputType> = ({
  id,
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
        className="
          w-full min-w-52 text-sm 
          rounded-md border border-neutral-300  dark:border-primary/90
          px-3.5 py-3.5 
          font-light 
          focus:ring-2 focus:ring-primary/40 
          focus:border-primary transition-all 
          resize-none
        "
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
