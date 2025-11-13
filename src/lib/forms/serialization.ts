export function createFormDataFromObject(
  obj: Record<string, unknown>
): FormData | Record<string, unknown> {
  const formData = new FormData();
  const files: Array<File> = [];

  const findFiles = (
    currentObj: Record<string, unknown>,
    currentPath: string
  ) => {
    for (const key in currentObj) {
      if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
        const value = currentObj[key] as unknown;
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (value instanceof File) {
          files.push(new File([value], newPath));
        } else if (typeof value === "object" && value !== null) {
          findFiles(value as Record<string, unknown>, newPath);
        }
      }
    }
  };

  findFiles(obj, "");

  const removeFiles = (currentObj: Record<string, unknown>) => {
    for (const key in currentObj) {
      if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
        const value = currentObj[key] as unknown;
        if (value instanceof File) {
          delete currentObj[key];
        } else if (typeof value === "object" && value !== null) {
          removeFiles(value as Record<string, unknown>);
        }
      }
    }
  };

  if (files.length === 0) return obj;
  files.forEach((file) => formData.append("files", file));

  const objWithoutFiles = JSON.parse(JSON.stringify(obj));
  removeFiles(objWithoutFiles as Record<string, unknown>);
  formData.append("json", JSON.stringify(objWithoutFiles));

  return formData;
}
