export const containsFile = (obj: any): boolean => {
  if (obj instanceof File || obj instanceof Blob) return true;
  if (Array.isArray(obj)) return obj.some(containsFile);
  if (obj && typeof obj === "object") {
    return Object.values(obj).some(containsFile);
  }
  return false;
};

export const setDeep = (obj: any, path: string, value: any) => {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current = obj;

  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      current[k] = value;
    } else {
      if (!(k in current)) {
        current[k] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      }
      current = current[k];
    }
  });

  return current;
};

export const objectToFormData = (
  obj: Record<string, any>,
  formData = new FormData(),
  parentKey?: string,
  jsonAccumulator: any = {}
): FormData => {
  for (const [key, value] of Object.entries(obj)) {
    const path = parentKey ? `${parentKey}.${key}` : key;

    if (value instanceof File) {
      const newName = `${path}__${value.name}`;
      formData.append(
        "files",
        new File([value], newName, { type: value.type })
      );
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        const arrayPath = `${path}.${i}`;
        if (v instanceof File) {
          const newName = `${arrayPath.replaceAll(/\./g, "_")}__${v.name}`;
          formData.append("files", new File([v], newName, { type: v.type }));
        } else if (typeof v === "object" && v !== null) {
          objectToFormData(v, formData, arrayPath, jsonAccumulator);
        } else {
          setDeep(jsonAccumulator, arrayPath, v);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      objectToFormData(value, formData, path, jsonAccumulator);
    } else {
      setDeep(jsonAccumulator, path, value);
    }
  }

  if (!parentKey) {
    formData.append("json", JSON.stringify(jsonAccumulator));
  }

  return formData;
};
