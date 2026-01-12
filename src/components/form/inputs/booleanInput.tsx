"use client";
import React, { useEffect } from "react";
import { InputType } from "@/types/types";

const BooleanInput: React.FC<InputType> = ({ value, setValue }) => {
  useEffect(() => {
    if (value === undefined) {
      setValue?.(false);
    }
  });

  const handleChange = () => {
    setValue?.(!value);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!value}
      onClick={handleChange}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
        border-2 border-transparent bg-bg-secondary transition-colors duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${value ? "bg-primary" : "bg-background"}
      `}
    >
      <span className="sr-only">{value ? "On" : "Off"}</span>
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full 
          bg-background shadow ring-0 transition duration-200 ease-in-out 
          ${value ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default BooleanInput;
