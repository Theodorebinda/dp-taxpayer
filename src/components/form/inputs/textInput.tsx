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
    if (typeof val === "string") return val.slice(0, 10);
    if (val instanceof Date && !Number.isNaN(val.getTime())) {
      return val.toISOString().slice(0, 10);
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
      <div className="flex flex-col gap-3">
        {inputs.map((input, index) => (
          <div key={`${id}-${index}`} className="relative">
            <input
              className="
                w-full min-w-52 text-sm rounded-md border border-neutral-300 
                 px-3.5 py font-light text-neutral-900
                focus:ring-2 focus:ring-primary/40 focus:border-primary 
                transition-all
              "
              type={type === "password" && isPasswordVisible ? "text" : type}
              name={`${property}-${index}`}
              placeholder={placeholder}
              disabled={props.isReadOnly}
              value={type === "date" ? formatDateValue(input) : input}
              onChange={(e) => handleChange(e, index)}
              required={!isOptional && index === 0}
            />

            {type === "password" && (
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-10 flex items-center text-neutral-500 hover:text-neutral-700"
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
              className="
                absolute inset-y-0 right-3 flex items-center text-red-500
                hover:text-red-600 transition
              "
            >
              <IoMdRemove size={20} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addInput}
          className="text-sm text-primary flex items-center gap-2 hover:opacity-80"
        >
          <IoMdAdd size={20} /> Ajouter
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        className="
          w-full min-w-52 text-sm rounded-md border border-neutral-300 dark:border-primary/90
           px-3.5 py-3 font-light text-neutral-900 dark:text-neutral-400
          focus:ring-2 focus:ring-primary/40 focus:border-primary 
          transition-all
        "
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
          className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-neutral-700"
        >
          {isPasswordVisible ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </button>
      )}
    </div>
  );
};

export default TextInput;
