export type Variable = {
  id: string;
  property: string;
  children?: Variable[];
};

export type FormulaItem =
  | { type: "variable"; id: string; property: string }
  | { type: "operation"; op: string }
  | { type: "constant"; value: string }
  | { type: "function"; name: string; args?: Record<string, string> };
