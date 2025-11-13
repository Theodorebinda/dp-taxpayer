// src/components/Input/TextInput.tsx
import { InputType } from "@/types/types";
import React, { useState, useEffect } from "react";
import { IoMdEye, IoMdEyeOff, IoMdAdd, IoMdRemove } from "react-icons/io";

const TextInput: React.FC<InputType> = ({
  id,
  type,
  placeholder,
  value,
  setValue,
  isOptional,
  property,
  multiple = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [inputs, setInputs] = useState<string[]>(
    Array.isArray(value) ? value : []
  );

  useEffect(() => {
    if (multiple && !Array.isArray(value)) {
      setInputs([]);
      setValue?.([]);
    } else if (multiple) {
      setInputs((value as string[]) || []);
    }
  }, [multiple, value, setValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue: string = e.target.value;
    const parsedValue = type === "date" ? new Date(newValue) : newValue;

    if (multiple) {
      const updatedInputs = [...inputs];
      updatedInputs[index] = parsedValue as string;
      setInputs(updatedInputs);
      setValue?.(updatedInputs);
    } else {
      setValue?.(parsedValue);
    }
  };

  const addInput = () => {
    setInputs([...inputs, ""]);
    setValue?.([...inputs, ""]);
  };

  const formatDateValue = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val.slice(0, 10); // cas ISO string
    if (val instanceof Date && !Number.isNaN(val.getTime())) {
      return val.toISOString().slice(0, 10); // yyyy-MM-dd
    }
    return "";
  };

  const removeInput = (index: number) => {
    if (inputs.length > 1) {
      const updatedInputs = inputs.filter((_, i) => i !== index);
      setInputs(updatedInputs);
      setValue?.(updatedInputs);
    }
  };

  if (multiple) {
    return (
      <div className="flex flex-col gap-2">
        {inputs.map((input, index) => (
          <div key={`${id}-${index}`} className="relative">
            <input
              className="w-full min-w-52 text-sm rounded border border-foreground invalid:border-red-500 bg-gray px-3 py-2 font-light bg-background text-foreground focus:border-background focus-visible:outline-none"
              type={type === "password" && isPasswordVisible ? "text" : type}
              name={`${property}-${index}`}
              placeholder={placeholder}
              // value={input}
              disabled={props.isReadOnly}
              value={type === "date" ? formatDateValue(input) : input}
              onChange={(e) => handleChange(e, index)}
              required={!isOptional && index === 0}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-10 flex items-center text-sm text-primary focus:outline-none"
              >
                {isPasswordVisible ? (
                  <IoMdEyeOff size={20} />
                ) : (
                  <IoMdEye size={20} />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => removeInput(index)}
              className="absolute inset-y-0 right-4 flex items-center text-sm text-red-500 focus:outline-none"
            >
              <IoMdRemove size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInput}
          className="text-sm text-primary flex items-center gap-2 focus:outline-none"
        >
          <IoMdAdd size={20} /> Ajouter
        </button>
      </div>
    );
  }

  // Pour les cas non multiples, on gère la valeur simple
  return (
    <div className="relative">
      <input
        className="w-full min-w-52 text-sm rounded border border-gray-400 bg-gray px-3 py-2 font-light bg-background text-foreground focus-visible:outline-none"
        type={type === "password" && isPasswordVisible ? "text" : type}
        name={property}
        placeholder={placeholder}
        id={id}
        disabled={props.isReadOnly}
        value={
          type === "date" ? formatDateValue(value) : (value as string) || ""
        }
        onChange={(e) => handleChange(e, 0)}
        required={!isOptional}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute inset-y-0 right-4 flex items-center text-sm text-primary focus:outline-none"
        >
          {isPasswordVisible ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </button>
      )}
    </div>
  );
};

export default TextInput;
