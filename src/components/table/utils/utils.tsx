export function getNestedValue<T>(obj: T, path: string): any {
  if (typeof obj === "boolean")
    return (
      <button
        type="button"
        role="switch"
        aria-checked={obj}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
          border-2 border-transparent transition-colors duration-200 ease-in-out
          ${obj ? "bg-primary" : "bg-gray-200"}
        `}
      >
        <span className="sr-only">{obj ? "On" : "Off"}</span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${obj ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    );
  if (typeof obj === "number")
    return <span className="bg-bg-secondary p-1.5 rounded-md">{obj}</span>;
  if (typeof obj === "string") return obj;
  if (!obj || !path) return "_____";
  if (obj == null) return "----";

  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current == null || current[key] === undefined) {
      return "----";
    }
    current = current[key];
  }

  return current;
}

export type FlattenedItem = Record<string, any> & {
  level: number;
  parentId?: string | number;
  isVisible?: boolean;
};

export function flattenData<T extends { id?: string | number; children?: T[] }>(
  data: T[],
  level: number = 0,
  parentId?: string | number
): FlattenedItem[] {
  const flattened: FlattenedItem[] = [];

  for (const item of data) {
    flattened.push({ ...item, level, parentId, isVisible: true });
  }

  return flattened;
}

export function resizeArray<T>(array: T[], newSize: number): (T | null)[] {
  if (newSize < 0) throw new Error("La taille doit être positive");

  if (array.length === newSize) return [...array];

  if (array.length < newSize) {
    // Ajoute des `null` jusqu'à atteindre la taille souhaitée
    return [...array, ...new Array(newSize - array.length).fill(null)];
  } else {
    // Tronque si le tableau est trop grand
    return array.slice(0, newSize);
  }
}
