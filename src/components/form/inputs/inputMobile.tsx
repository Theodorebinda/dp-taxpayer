import { InputType } from "@/types/types";
import React, { useState, useEffect } from "react";
import { IoMdAdd, IoMdRemove } from "react-icons/io";

const PhoneNumberInput: React.FC<InputType> = ({
  id,
  // type,
  placeholder,
  value,
  setValue,
  isOptional,
  property,
  multiple = false,
}) => {
  const [inputs, setInputs] = useState(() =>
    Array.isArray(value) ? value : []
  );
  const [selectedPrefix, setSelectedPrefix] = useState("+243");
  const [localValue, setLocalValue] = useState(value || "");
  const prefixes = ["+243"];

  useEffect(() => {
    if (multiple && !Array.isArray(value)) {
      setInputs([]);
      setValue?.([]);
    } else if (multiple) {
      setInputs((value as any) || []);
    }
  }, [multiple, value, setValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    // Keep only digits
    const newValue = e.target.value
      .replaceAll(" ", "")
      .replaceAll(/\D/g, "")
      .slice(-9);
    setLocalValue(newValue);
    if (multiple) {
      const updatedInputs = [...inputs];
      updatedInputs[index] = newValue;
      setInputs(updatedInputs);
      setValue?.(updatedInputs.map((input) => selectedPrefix + input));
    } else {
      setValue?.(selectedPrefix + newValue);
    }
  };

  const addInput = () => {
    setInputs([...inputs, ""]);
    setValue?.([...inputs, ""].map((input) => selectedPrefix + input));
  };

  const removeInput = (index: number) => {
    if (inputs.length > 1) {
      const updatedInputs = inputs.filter((_, i) => i !== index);
      setInputs(updatedInputs);
      setValue?.(updatedInputs.map((input) => selectedPrefix + input));
    }
  };

  const handlePrefixChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrefix(event.target.value);
    if (multiple) {
      setValue?.(inputs.map((input) => event.target.value + input));
    } else {
      setValue?.(event.target.value + localValue);
    }
  };

  const renderInput = (inputValue: string, index: number = 0) => (
    <div className="flex items-center gap-2">
      <select
        onChange={handlePrefixChange}
        value={selectedPrefix}
        className="px-2 py-2 text-sm text-background font-bold rounded bg-primary border border-primary"
      >
        {prefixes.map((prefix) => (
          <option key={prefix} value={prefix} className="">
            {prefix}
          </option>
        ))}
      </select>
      <div className="flex items-center w-full text-sm rounded font-light text-foreground gap-2 px-2 border-gray-400 border">
        <input
          type="tel"
          name={multiple ? `${property}-${index}` : property}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleChange(e, index)}
          required={!isOptional && (!multiple || index === 0)}
          onPaste={(e) => {
            e.preventDefault();
            handleChange(
              { target: { value: e.clipboardData.getData("text") } } as any,
              index
            );
          }}
          className="w-full p-2 focus-visible:outline-none bg-background"
          maxLength={9}
        />
        <span className="flex items-center text-sm">{inputValue.length}/9</span>
        {multiple && (
          <button
            type="button"
            onClick={() => removeInput(index)}
            className="text-red-500 focus:outline-none"
          >
            <IoMdRemove size={20} />
          </button>
        )}
      </div>
    </div>
  );

  return multiple ? (
    <div className="flex flex-col gap-2">
      {inputs.map((input, index) => (
        <div key={`${id}-${index}`}>{renderInput(input, index)}</div>
      ))}
      <button
        type="button"
        onClick={addInput}
        className="text-sm text-primary flex items-center gap-2 focus:outline-none"
      >
        <IoMdAdd size={20} /> Ajouter
      </button>
    </div>
  ) : (
    renderInput(localValue as any)
  );
};

export default PhoneNumberInput;
