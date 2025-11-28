import React, { useState, useRef, useEffect, useMemo } from "react";
import { InputType, InputOption } from "@/types/types";
import translate from "@/components/store/dictionary";

interface SearchableSelectInputProps extends InputType {
  options: InputOption[];
}

// Normalisation récursive
const normalizeOptions = (opts: InputOption[]): InputOption[] =>
  opts.map((opt) => {
    // 1 — si primitive
    if (typeof opt === "string" || typeof opt === "number") {
      return {
        label: String(opt),
        value: String(opt),
      };
    }

    // 2 — si objet sans value
    const value = opt.value ?? opt.label ?? null;

    return {
      ...opt,
      label: opt.label ?? value,
      value: value,
      children: opt.children ? normalizeOptions(opt.children) : undefined,
    };
  });

// Aplatir arbre => tableau simple
const flattenOptions = (opts: InputOption[]): InputOption[] =>
  opts.flatMap((opt) => [
    opt,
    ...(opt.children ? flattenOptions(opt.children) : []),
  ]);

const DropDown = ({
  option,
  selectedOptions,
  isMultiSelect,
  handleOptionClick,
  level = 0,
}: {
  option: InputOption;
  selectedOptions: InputOption[];
  isMultiSelect: boolean;
  handleOptionClick: (option: InputOption) => void;
  level?: number;
}) => {
  const isSelected = selectedOptions.some((o) => o.value === option.value);
  const label = translate(String(option.label), true);
  const indent = "—".repeat(level) + (level > 0 ? " " : "");

  return (
    <>
      <button
        onClick={() => handleOptionClick(option)}
        className={`
  px-3 py-2.5 text-sm w-full text-left cursor-pointer
  hover:bg-neutral-100
  ${isSelected ? "bg-primary/10 text-primary font-medium" : "text-neutral-800"}
`}
      >
        {isMultiSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="mr-2"
          />
        )}
        {indent}
        {label}
      </button>

      {option.children?.map((child, i) => (
        <DropDown
          key={child.value + "-" + i}
          option={child}
          selectedOptions={selectedOptions}
          isMultiSelect={isMultiSelect}
          handleOptionClick={handleOptionClick}
          level={level + 1}
        />
      ))}
    </>
  );
};

const SelectInput: React.FC<
  { searchLoading: boolean } & SearchableSelectInputProps
> = ({
  id,
  value,
  setValue,
  options,
  isOptional,
  property,
  type,
  onSearch,
  searchLoading,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputDirty, setIsInputDirty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMultiSelect = type === "multi_select";

  // Normalisation + flatten (memoized)
  const normalized = useMemo<InputOption[]>(
    () => normalizeOptions(options),
    [options]
  );
  const flat = useMemo<InputOption[]>(
    () => flattenOptions(normalized),
    [normalized]
  );

  const selectedOptions = useMemo(() => {
    if (isMultiSelect && Array.isArray(value)) {
      return flat.filter((opt) =>
        (value as any)?.includes(JSON.stringify(opt.value))
      );
    }

    if (!isMultiSelect && value) {
      const selected = flat.find((opt) => opt.value === value);
      return selected ? [selected] : [];
    }

    return [];
  }, [flat, isMultiSelect, value]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const singleSelectDisplayValue = useMemo(() => {
    if (isMultiSelect) return "";
    const selected = selectedOptions[0];
    return selected ? translate(String(selected.label), true) : "";
  }, [isMultiSelect, selectedOptions]);

  const inputDisplayValue = isMultiSelect
    ? searchTerm
    : isInputDirty
    ? searchTerm
    : singleSelectDisplayValue;

  // Click extérieur → fermer
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!isMultiSelect) setIsInputDirty(true);
    setIsOpen(true);
    setValue(isMultiSelect ? [] : "");
    onSearch?.(term);
  };

  // Filtrer options par label
  const filterOptions = (opts: InputOption[], level = 0): InputOption[] =>
    opts.flatMap((opt) => {
      const label = translate(String(opt.label), true).toLowerCase();
      const match = label.includes(searchTerm.toLowerCase());
      const children = opt.children
        ? filterOptions(opt.children, level + 1)
        : [];

      return [...(match ? [{ ...opt, level }] : []), ...children];
    });

  const filtered = searchTerm
    ? filterOptions(normalized)
    : normalized.map((o) => ({ ...o, level: 0 }));

  // Sélection/déselection
  const handleOptionClick = (option: InputOption) => {
    if (isMultiSelect) {
      const exists = selectedOptions.some((o) => o.value === option.value);
      const updated = exists
        ? selectedOptions.filter((o) => o.value !== option.value)
        : [...selectedOptions, option];

      setValue(updated.map((o) => o.value));
      setSearchTerm("");
      setIsInputDirty(false);
    } else {
      setValue(option.value as any);
      setSearchTerm(translate(String(option.label), true));
      setIsInputDirty(false);
      setIsOpen(false);
    }
  };

  const handleRemoveOption = (opt: InputOption) => {
    const updated = selectedOptions.filter((o) => o.value !== opt.value);
    setValue(updated.map((o) => o.value));
  };

  const handleClear = () => {
    setValue(isMultiSelect ? [] : "");
    setSearchTerm("");
    setIsInputDirty(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full min-w-52">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={property}
          value={inputDisplayValue}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          placeholder={
            isMultiSelect && selectedOptions.length
              ? `${selectedOptions.length} sélectionné(s)`
              : "Rechercher..."
          }
          className="
    w-full min-w-52 text-sm
    rounded-md border border-neutral-300 dark:border-primary/80
     px-3.5 py-3.5 pr-10
     font-light
    focus:ring-2 focus:ring-primary/40 
    focus:border-primary 
    transition-all
  "
          required={!isOptional && !selectedOptions.length}
        />

        {/* Bouton clear */}
        {(searchTerm || selectedOptions.length > 0) && (
          <button
            type="button"
            onClick={handleClear}
            className="
      absolute right-3 top-1/2 -translate-y-1/2
      text-neutral-400 hover:text-neutral-600
      transition
    "
          >
            ✕
          </button>
        )}
      </div>

      {/* Tags */}
      {isMultiSelect && selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedOptions.map((o) => (
            <span
              key={JSON.stringify(o.value)}
              className="
        inline-flex items-center gap-2
        px-2.5 py-1.5
        text-xs rounded-md
        bg-primary/10 text-primary
      "
            >
              {translate(String(o.label), true)}
              <button
                onClick={() => handleRemoveOption(o)}
                className="text-primary/70 hover:text-primary"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
    absolute z-50 w-full mt-1 rounded-md 
    border border-neutral-200 bg-white 
    shadow-lg max-h-60 overflow-y-auto
  "
        >
          {searchLoading
            ? "chargement..."
            : filtered.map((opt, i) => (
                <DropDown
                  key={opt.value + "-" + i}
                  option={opt}
                  selectedOptions={selectedOptions}
                  isMultiSelect={isMultiSelect}
                  handleOptionClick={handleOptionClick}
                />
              ))}
        </div>
      )}

      {/* Aucun résultat */}
      {isOpen && !searchLoading && searchTerm && filtered.length === 0 && (
        <div className="absolute z-50 w-full mt-1 p-3 border rounded bg-background text-sm">
          Aucun résultat trouvé
        </div>
      )}
    </div>
  );
};

export default SelectInput;
