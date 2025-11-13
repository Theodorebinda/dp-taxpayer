import { Draggable } from "@hello-pangea/dnd";
import { FormulaItem, Variable } from "./types";
import { Trash2, Plus, X, GripVertical } from "lucide-react";
import Modal from "@/components/atoms/modal";
import React, { useCallback, useMemo } from "react";

/* --- FormulaItemComponent --- */
export const FormulaItemComponent: React.FC<{
  item: FormulaItem;
  index: number;
  onRemove: (index: number) => void;
  onFunctionClick: (index: number, item: FormulaItem) => void;
}> = React.memo(({ item, index, onRemove, onFunctionClick }) => {
  const isFunction = item.type === "function";
  const isVariable = item.type === "variable";
  const isOperation = item.type === "operation";

  const label = useMemo(() => {
    if (isFunction) return `${item.name}()`;
    if (isVariable) return item.property;
    if (isOperation) return item.op;
    return item.value;
  }, [item]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(index);
    },
    [index, onRemove]
  );

  const handleClick = useCallback(() => {
    if (isFunction) onFunctionClick(index, item);
  }, [index, item, isFunction, onFunctionClick]);

  return (
    <Draggable draggableId={`formula-${index}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={`group relative inline-flex items-center gap-2 px-4 py-2.5 m-1 rounded-lg transition-all duration-200 select-none border ${
            snapshot.isDragging
              ? "bg-primary text-white scale-105 shadow-xl border-primary"
              : "bg-background hover:bg-primary/5 cursor-grab border-primary/20 hover:border-primary/40"
          }`}
        >
          <GripVertical className={`w-4 h-4 ${snapshot.isDragging ? "text-white/70" : "text-foreground/30"}`} />
          <span className={`font-medium ${snapshot.isDragging ? "text-white" : "text-foreground"}`}>
            {label}
          </span>

          <button
            onClick={handleRemove}
            aria-label="Supprimer cet élément"
            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all duration-200 ${
              snapshot.isDragging 
                ? "hover:bg-white/20" 
                : "hover:bg-primary/10"
            }`}
          >
            <Trash2 className={`w-4 h-4 ${snapshot.isDragging ? "text-white" : "text-primary"}`} />
          </button>
        </div>
      )}
    </Draggable>
  );
});
FormulaItemComponent.displayName = "FormulaItemComponent";

/* --- FunctionConfigModal --- */
export const FunctionConfigModal: React.FC<{
  editingFunction: {
    index: number;
    name: string;
    args: Record<string, any>;
  } | null;
  flatVariables: (Variable & { level: number })[];
  onClose: () => void;
  onSave: () => void;
  onArgsChange: (args: Record<string, any>) => void;
}> = ({ editingFunction, flatVariables, onClose, onSave, onArgsChange }) => {
  // Ensure hooks are called unconditionally by providing safe defaults when editingFunction is null
  const name = editingFunction?.name ?? "";
  const args = editingFunction?.args ?? {};

  const updateArg = useCallback(
    (key: string, value: any) => {
      onArgsChange({ ...args, [key]: value });
    },
    [args, onArgsChange]
  );

  const updateConditions = useCallback(
    (conditions: any[]) => updateArg("conditions", conditions),
    [updateArg]
  );

  const conditionOptions = [
    { label: "==", value: "==" },
    { label: "!=", value: "!=" },
    { label: ">", value: ">" },
    { label: "<", value: "<" },
    { label: "≥", value: ">=" },
    { label: "≤", value: "<=" },
  ];

  const conditions = Array.isArray(args.conditions)
    ? args.conditions
    : [{ parent: "", condition: "", compareValue: "", then: "" }];

  const handleConditionChange = (index: number, key: string, value: string) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [key]: value };
    updateConditions(updated);
  };

  const addElseIf = () => {
    updateConditions([
      ...conditions,
      { parent: "", condition: "", compareValue: "", then: "" },
    ]);
  };

  const removeElseIf = (index: number) => {
    const updated = [...conditions];
    updated.splice(index, 1);
    updateConditions(updated);
  };

  return (
    <Modal isOpen={!!editingFunction} onClose={onClose} title={`Configurer ${name}`}>
      {name === "IF" && (
        <div className="space-y-6">
          {conditions.map((cond, i) => (
            <div
              key={i}
              className="relative border-2 border-primary/20 rounded-xl p-5 bg-background shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-3.5 left-4 bg-primary px-3 py-1 rounded-full text-sm font-semibold text-white shadow-sm">
                {i === 0 ? "IF" : `ELSE IF ${i}`}
              </div>

              <div className="space-y-4 mt-2  ">
                {/* Condition row: parent + condition + compare value */}
                <div className="flex gap-3 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Clé du parent
                    </label>
                    <select
                      className="w-full border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={cond.parent}
                      onChange={(e) =>
                        handleConditionChange(i, "parent", e.target.value)
                      }
                    >
                      <option value="">-- Sélectionner --</option>
                      {flatVariables.map((v, index) => (
                        <option
                          key={v.id + index}
                          value={v.id}
                          style={{ paddingLeft: `${v.level * 12}px` }}
                        >
                          {"─".repeat(v.level)} {v.property}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2 text-center">
                      Condition
                    </label>
                    <select
                      className="w-20 border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground text-center font-mono text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={cond.condition}
                      onChange={(e) =>
                        handleConditionChange(i, "condition", e.target.value)
                      }
                    >
                      <option value="">--</option>
                      {conditionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Valeur
                    </label>
                    <input
                      className="w-full border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="1000"
                      value={cond.compareValue || ""}
                      onChange={(e) =>
                        handleConditionChange(i, "compareValue", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Then */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Alors
                  </label>
                  <input
                    className="w-full border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Ex: prime = 10"
                    value={cond.then || ""}
                    onChange={(e) => handleConditionChange(i, "then", e.target.value)}
                  />
                </div>
              </div>

              {i > 0 && (
                <button
                  onClick={() => removeElseIf(i)}
                  className="absolute -top-2 -right-2 bg-primary text-white hover:bg-primary/90 rounded-full p-2 shadow-md transition-all hover:scale-110"
                  aria-label="Supprimer cette condition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addElseIf}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter un &#34;IF&#34;
          </button>

          {/* ELSE */}
          <div className="relative border-2 border-primary/20 rounded-xl p-5 bg-background shadow-sm">
            <div className="absolute -top-3.5 left-4 bg-foreground px-3 py-1 rounded-full text-sm font-semibold text-background shadow-sm">
              ELSE
            </div>
            <div className="mt-2">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Sinon
              </label>
              <input
                className="w-full border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Ex: prime = 0"
                value={args.else || ""}
                onChange={(e) => updateArg("else", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* SUM, PRODUCT */}
      {["SUM", "PRODUCT"].includes(name) && (
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Clé du parent
            </label>
            <select
              className="w-full border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={args.parent || ""}
              onChange={(e) => updateArg("parent", e.target.value)}
            >
              <option value="">-- Sélectionner --</option>
              {flatVariables.map((v, index) => (
                <option
                  key={v.id + index}
                  value={v.id}
                  style={{ paddingLeft: `${v.level * 12}px` }}
                >
                  {"─".repeat(v.level)} {v.property}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Formule des enfants
            </label>
            <input
              className="w-full border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Ex: child.salary * 4 + 1"
              value={args.childExpr || ""}
              onChange={(e) => updateArg("childExpr", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* COUNT */}
      {name === "COUNT" && (
        <div className="mt-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Clé du parent
          </label>
          <select
            className="w-full border-2 border-primary/20 rounded-lg p-2.5 bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={args.parent || ""}
            onChange={(e) => updateArg("parent", e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {flatVariables.map((v) => (
              <option
                key={v.id}
                value={v.id}
                style={{ paddingLeft: `${v.level * 12}px` }}
              >
                {"─".repeat(v.level)} {v.property}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 bg-background border-2 border-primary/20 rounded-lg font-semibold text-foreground hover:bg-primary/5 hover:border-primary/40 transition-all"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
        >
          Enregistrer
        </button>
      </div>
    </Modal>
  );
};