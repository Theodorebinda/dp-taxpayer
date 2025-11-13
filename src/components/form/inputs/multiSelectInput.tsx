import { InputOption, InputType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

interface MultiSelectInputProps extends InputType {
  options: InputOption[];
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  // id,
  value,
  setValue,
  options,
  // isOptional,
}) => {
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});
  const [selectedValueLength, setSelectedValueLength] = useState<number>(
    (value as any)?.length || 0
  );

  const toggleNode = (nodeValue: string | number) => {
    setOpenNodes((prev) => ({
      ...prev,
      [nodeValue]: !prev[nodeValue],
    }));
  };

  const handleMultiSelectChange = (
    selectedValue: string | number,
    children?: InputOption[]
  ) => {
    const currentValues = Array.isArray(value) ? value : [];
    let newValue = [...currentValues];

    const toggleSelection = (val: string | number) => {
      if (newValue.includes(val)) {
        newValue = newValue.filter((v) => v !== val);
      } else {
        newValue.push(val);
      }
    };

    const handleRecursiveSelection = (options: InputOption[]) => {
      options.forEach((opt) => {
        toggleSelection(opt.value as string | number);
        if (opt.children && opt.children.length > 0)
          handleRecursiveSelection(opt.children);
      });
    };

    toggleSelection(selectedValue);
    if (children && children.length > 0) handleRecursiveSelection(children);

    setValue?.(newValue);
  };

  useEffect(() => {
    if (value) {
      setSelectedValueLength((value as any)?.length || 0);
    }
  }, [value]);

  // const handleRemoveSelectedValue = (selectedValue: string | number) => {
  //   const newValue = value.value.filter((val: any) => val !== selectedValue);
  //   setValue?.({ ...value, value: newValue });
  // };

  return (
    <div className=" w-full min-w-52 text-sm">
      {/* {Array.isArray(value?.value) && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value?.value.map((val) => (
            <span
              key={String(val)}
              className="flex items-center gap-1 rounded bg-primary text-white px-3 py-1 text-sm"
            >
              {options.find((option) => option.value === val)?.label || val}
              <button
                type="button"
                className="text-white hover:text-gray-200"
                onClick={() => handleRemoveSelectedValue(val)}
              >
                <IoCloseCircle size={16} />
              </button>
            </span>
          ))}
        </div>
      )} */}
      <div className="max-h-80 relative overflow-y-auto border border-app-blue-400 rounded-md bg-background">
        {selectedValueLength > 0 && (
          <div className="bg-app-green-500 text-white px-3 py-1 text-sm sticky top-0">{`${selectedValueLength} élément${
            selectedValueLength > 1 && "s"
          } selectionné${selectedValueLength > 1 && "s"}`}</div>
        )}
        {options.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-background text-foreground">
            <span className="text-sm">Aucune donnée pour l&apos;instant</span>
          </div>
        ) : (
          options.map((option) => (
            <TreeNode
              key={String(option.value)}
              option={option}
              selectedValues={value as (string | number)[]}
              onSelect={handleMultiSelectChange}
              toggleNode={toggleNode}
              isOpen={openNodes[option.value as string] || false}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TreeNode: React.FC<{
  option: InputOption;
  selectedValues: (string | number)[];
  onSelect: (value: string | number, children?: InputOption[]) => void;
  toggleNode: (value: string | number) => void;
  isOpen: boolean;
  level?: number;
}> = ({ option, selectedValues, onSelect, toggleNode, isOpen, level = 0 }) => {
  const hasChildren = option.children && option.children.length > 0;
  return (
    <div
      className={`py-1`}
      style={{
        paddingLeft: `${level * 20 + (hasChildren ? 0 : 23)}px`,
      }}
    >
      <div
        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#26293f]"
        onClick={() =>
          onSelect(option.value as string | number, option.children)
        }
      >
        {hasChildren && (
          <button
            type="button"
            className="text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode(option.value as string | number);
            }}
          >
            {isOpen ? (
              <IoChevronDown size={14} />
            ) : (
              <IoChevronForward size={14} />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option.value as string | number, option.children);
          }}
          className={`w-4 h-4 border bg-backgound border-gray-400 rounded flex items-center justify-center`}
        >
          {selectedValues?.includes(option.value as string | number) ? (
            <span className="block w-2.5 h-2.5 bg-primary rounded-sm"></span>
          ) : (
            false
          )}
        </button>

        <span className="text-sm">{option.label}</span>
      </div>

      {isOpen &&
        option.children &&
        option.children.length > 0 &&
        option.children.map((child) => (
          <TreeNode
            key={String(child.value)}
            option={child}
            selectedValues={selectedValues}
            onSelect={onSelect}
            toggleNode={toggleNode}
            isOpen={isOpen}
            level={level + 1}
          />
        ))}
    </div>
  );
};

export default MultiSelectInput;
