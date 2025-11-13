// src/components/Input/JsonEditor.tsx
import React from "react";
import { InputType } from "@/types/types";
import { X, Plus } from "lucide-react";

type EditableJson = Record<string, any>;

const JsonEditor: React.FC<InputType> = ({
  id,
  value,
  setValue,
  placeholder,
  isOptional,
  property,
}) => {
  const data: EditableJson = (value as any) || {};

  const updateNestedValue = (path: string[], newVal: string | EditableJson) => {
    const updated = { ...data };
    let current: any = updated;

    for (let i = 0; i < path.length - 1; i++) {
      const segment = path[i];
      if (!(segment in current)) current[segment] = {};
      current = current[segment];
    }

    current[path[path.length - 1]] = newVal;
    setValue?.(updated);
  };

  const deleteKeyAtPath = (path: string[]) => {
    const updated = { ...data };
    let current: any = updated;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    delete current[path[path.length - 1]];
    setValue?.(updated);
  };

  const renameKeyAtPath = (path: string[], newKey: string) => {
    if (!newKey) return;
    const updated = { ...data };
    let current: any = updated;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    const oldKey = path[path.length - 1];
    if (newKey === oldKey) return;

    const valueToMove = current[oldKey];
    delete current[oldKey];
    current[newKey] = valueToMove;

    setValue?.(updated);
  };

  const addKeyAtPath = (path: string[]) => {
    const newKey = "NOUVEAU CHAMPS";
    const updated = { ...data };
    let current: any = updated;

    for (let i = 0; i < path.length; i++) {
      const segment = path[i];
      if (!(segment in current)) current[segment] = {};
      current = current[segment];
    }

    let i = 1;
    let keyName = newKey;
    while (current[keyName] !== undefined) {
      keyName = `${newKey}_${i++}`;
    }

    current[keyName] = "";
    setValue?.(updated);
  };

  const renderObject = (
    obj: EditableJson,
    path: string[] = []
  ): React.ReactNode => {
    return (
      <>
        {Object.entries(obj).map(([key, val]) => {
          const fullPath = [...path, key];
          const keyId = fullPath.join(".");

          const handleRename = (e: React.ChangeEvent<HTMLInputElement>) => {
            renameKeyAtPath(fullPath, e.target.value);
          };

          if (typeof val === "object" && val !== null) {
            return (
              <div key={keyId} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => deleteKeyAtPath(fullPath)}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer ce champ"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                  <input
                    type="text"
                    value={key}
                    onChange={handleRename}
                    className="text-sm font-semibold border-b border-gray-300 bg-transparent focus:outline-none focus:border-app-blue-400"
                  />
                </div>
                <div className="border-l border-app-blue-400 pl-5 flex flex-col gap-3">
                  {renderObject(val, fullPath)}
                </div>
                <button
                  onClick={() => addKeyAtPath(fullPath)}
                  className="text-xs text-app-blue-400 mt-1 hover:underline"
                >
                  <Plus size={14} className="inline mr-1" /> Ajouter un champ
                </button>
              </div>
            );
          } else {
            return (
              <div key={keyId} className="flex gap-2 items-center">
                <div className="col-span-5 flex items-center gap-1">
                  <button
                    onClick={() => deleteKeyAtPath(fullPath)}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer ce champ"
                    type="button"
                  >
                    <X size={14} />
                  </button>
                  <input
                    type="text"
                    value={key}
                    onChange={handleRename}
                    className="w-full text-sm border-b border-gray-300 bg-transparent focus:outline-none focus:border-app-blue-400"
                  />
                </div>
                {" : "}
                <input
                  type="text"
                  className="col-span-7 px-2 border-b text-sm bg-background text-foreground border-app-blue-400"
                  value={val}
                  placeholder={placeholder}
                  name={property}
                  required={!isOptional}
                  onChange={(e) => updateNestedValue(fullPath, e.target.value)}
                />
              </div>
            );
          }
        })}

        <div className="mt-2">
          <button
            onClick={() => addKeyAtPath(path)}
            className="text-xs text-app-blue-400 hover:underline"
            type="button"
          >
            <Plus size={14} className="inline mr-1" /> Ajouter un champ
          </button>
        </div>
      </>
    );
  };

  return (
    <div
      className="flex flex-col gap-3 border border-app-blue-400 rounded-md p-5 bg-white"
      id={id}
    >
      {renderObject(data)}
    </div>
  );
};

export default JsonEditor;
