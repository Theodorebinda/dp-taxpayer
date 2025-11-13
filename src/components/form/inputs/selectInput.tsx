import React, { useState, useRef, useEffect } from "react";
import { InputType, InputOption } from "@/types/types";
import translate from "@/components/store/dictionary";

interface SearchableSelectInputProps extends InputType {
  options: InputOption[];
}

// Normalisation récursive
const normalizeOptions = (opts: InputOption[]): InputOption[] =>
  opts.map((opt) => ({
    ...opt,
    label: opt.label ?? opt.value,
    value: opt.value,
    children: opt.children ? normalizeOptions(opt.children) : undefined,
  }));

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
        className={`px-3 py-2 cursor-pointer text-sm hover:bg-foreground/10 w-full text-left ${
          isSelected ? "bg-primary/10 text-primary font-medium" : ""
        }`}
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<InputOption[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMultiSelect = type === "multi_select";

  // Normalisation + flatten
  const normalized = normalizeOptions(options);
  const flat = flattenOptions(normalized);

  // Initialiser selectedOptions
  useEffect(() => {
    if (isMultiSelect && Array.isArray(value)) {
      setSelectedOptions(
        flat.filter((opt) =>
          (value as any)?.includes(JSON.stringify(opt.value))
        )
      );
    } else if (!isMultiSelect && value) {
      const selected = flat.find((opt) => opt.value === value);
      if (selected) {
        setSelectedOptions([selected]);
        setSearchTerm(translate(String(selected.label), true));
      }
    }
  }, [value, options]);

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

      setSelectedOptions(updated);
      setValue(updated.map((o) => o.value));
      setSearchTerm("");
    } else {
      setSelectedOptions([option]);
      setValue(option.value as any);
      setSearchTerm(translate(String(option.label), true));
      setIsOpen(false);
    }
  };

  const handleRemoveOption = (opt: InputOption) => {
    const updated = selectedOptions.filter((o) => o.value !== opt.value);
    setSelectedOptions(updated);
    setValue(updated.map((o) => o.value));
  };

  const handleClear = () => {
    setSelectedOptions([]);
    setValue(isMultiSelect ? [] : "");
    setSearchTerm("");
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
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          placeholder={
            isMultiSelect && selectedOptions.length
              ? `${selectedOptions.length} sélectionné(s)`
              : "Rechercher..."
          }
          className="w-full text-sm rounded border px-3 py-2 pr-8"
          required={!isOptional && !selectedOptions.length}
        />

        {(searchTerm || selectedOptions.length > 0) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tags */}
      {isMultiSelect && selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((o) => (
            <span
              key={JSON.stringify(o.value)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded"
            >
              {translate(String(o.label), true)}
              <button onClick={() => handleRemoveOption(o)}>✕</button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded shadow max-h-60 overflow-y-auto">
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
