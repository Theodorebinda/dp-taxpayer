import { useState, useEffect } from "react";

export interface ColumnConfig<T> {
  key: string; // Chemin d'accès comme "user.name" ou "address.street"
  label: string;
  editable?: boolean;
  inputType?: "text" | "number" | "date" | "checkbox";
  render?: (value: any, row: T) => React.ReactNode;
  searchable?: boolean;
}

interface EditableTableProps<T> {
  data: T[];
  setData: (data: T[]) => void;
  columns: ColumnConfig<T>[];
  pageSize?: number;
  pagination?: boolean;
  search?: boolean;
  onRowUpdate?: (updatedRow: T, originalRow: T) => Promise<void>;
  activeEdition: boolean;
}

// Helper function to get nested property
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

// Helper function to set nested property
const setNestedValue = (obj: any, path: string, value: any) => {
  const parts = path.split(".");
  const last = parts.pop();
  const parent = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  if (last) parent[last] = value;
};

// Fonction de recherche générique
const searchData = <T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  columns: ColumnConfig<T>[]
): T[] => {
  if (!searchTerm) return data;

  return data.filter((item) => {
    return columns.some((column) => {
      if (column.searchable === false) return false;

      const value = getNestedValue(item, column.key);
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
};

const EditableTable = <T extends Record<string, any>>({
  data,
  setData,
  columns,
  pageSize = 10,
  pagination = false,
  search = true,
  onRowUpdate,
  activeEdition = true,
}: EditableTableProps<T>) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<T>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [isSaving, setIsSaving] = useState(false);

  // Effet pour filtrer les données quand searchTerm ou data change
  useEffect(() => {
    const result = searchData(data, searchTerm, columns);
    setFilteredData(result);
    setCurrentPage(1); // Reset à la première page après une recherche
  }, [searchTerm, data, columns]);

  // Ajouter l'index original aux données filtrées pour référence
  const enhancedFilteredData = filteredData.map((item) => ({
    ...item,
    originalIndex: data.findIndex(
      (d) => JSON.stringify(d) === JSON.stringify(item)
    ),
  }));

  // Calcul des données paginées
  // const totalPages = Math.ceil(enhancedFilteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, enhancedFilteredData.length);
  const paginatedData = pagination
    ? enhancedFilteredData.slice(startIndex, endIndex)
    : enhancedFilteredData;

  const startEditing = (id: number, item: T) => {
    setEditingId(id);
    setEditData({ ...item });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEditing = async () => {
    if (editingId === null) return;

    setIsSaving(true);
    try {
      const rowData = paginatedData[editingId];
      const originalIndex = rowData.originalIndex;
      const originalRow = data[originalIndex];
      const updatedItem = { ...originalRow };

      // Appliquer toutes les modifications
      Object.keys(editData).forEach((key) => {
        setNestedValue(updatedItem, key, editData[key as keyof T]);
      });

      // Appeler la fonction de callback si elle existe
      if (onRowUpdate) {
        await onRowUpdate(updatedItem, originalRow);
      }

      // Mettre à jour les données locales
      const newData = [...data];
      newData[originalIndex] = updatedItem;
      setData(newData);

      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error("Error saving row:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setEditData((prev) => {
      const newData = { ...prev };
      setNestedValue(newData, key, value);
      return newData;
    });
  };

  return (
    <div className="overflow-x-hidden relative">
      {/* Barre de recherche */}
      {search && (
        <div className="">
          <div className="flex gap-5 items-center">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-bg-secondary bg-background rounded-lg focus:outline-2 focus:outline-bg-secondary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className=" right-3 top-2.5 text-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
          <div className="text-sm text-foreground/80 mt-1">
            {filteredData.length} résultats trouvés
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-background border border-bg-secondary">
          <thead>
            <tr className="bg-bg-secondary ">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-2 px-4 border-b border-bg-secondary text-left text-sm font-semibold text-foreground"
                >
                  {column.label}
                </th>
              ))}
              {activeEdition && (
                <th className="py-2 px-4 border-b border-bg-secondary text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr
                  key={startIndex + rowIndex}
                  className="hover:bg-bg-secondary"
                >
                  {columns.map((column, colIndex) => {
                    const value =
                      editingId === rowIndex
                        ? getNestedValue(editData, column.key)
                        : getNestedValue(item, column.key);

                    return (
                      <td
                        key={colIndex}
                        className="py-2 px-4 border-b border-bg-secondary text-sm min-w-32 text-foreground"
                      >
                        {editingId === rowIndex && column.editable ? (
                          column.inputType === "checkbox" ? (
                            <input
                              type="checkbox"
                              checked={!!value}
                              onChange={(e) =>
                                handleChange(column.key, e.target.checked)
                              }
                              className="w-5 h-5"
                            />
                          ) : column.inputType === "date" ? (
                            <input
                              type="date"
                              value={value ? String(value).slice(0, 10) : ""}
                              onChange={(e) =>
                                handleChange(column.key, e.target.value)
                              }
                              className="w-full px-4 py-2 text-sm border border-bg-secondary rounded-lg focus:outline-2 focus:outline-bg-secondary"
                            />
                          ) : (
                            <input
                              type={column.inputType || "text"}
                              value={value ?? ""}
                              onChange={(e) =>
                                handleChange(
                                  column.key,
                                  column.inputType === "number"
                                    ? Number(e.target.value)
                                    : e.target.value
                                )
                              }
                              className="w-full px-2 py-2 text-sm border border-foreground/40 rounded-lg focus:outline-2 focus:outline-bg-secondary"
                            />
                          )
                        ) : column.render ? (
                          column.render(value, item)
                        ) : column.inputType === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={!!value}
                            disabled
                            className="w-5 h-5"
                          />
                        ) : column.inputType === "date" && value ? (
                          new Date(value).toLocaleDateString()
                        ) : value ? (
                          String(value)
                        ) : (
                          "-------"
                        )}
                      </td>
                    );
                  })}
                  {activeEdition && (
                    <td className="py-2 px-4 border-b border-bg-secondary text-sm">
                      {editingId === rowIndex ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveEditing}
                            disabled={isSaving}
                            className="px-3 py-1 bg-app-green-500 text-background rounded hover:bg-app-green-600 disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="px-3 py-1 bg-app-blue-300 text-background rounded hover:bg-app-blue-400 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(rowIndex, item)}
                          className="px-3 py-1 bg-app-green-500 text-background rounded hover:bg-app-green-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-4 text-center text-gray-500"
                >
                  Aucun résultat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditableTable;

/*

{pagination && filteredData.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="text-sm text-foreground">
            Affichage de {startIndex + 1} à {endIndex} sur {filteredData.length}{" "}
            résultats
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === pageNum ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-3 py-1">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages ? "bg-blue-500 text-white" : ""
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>
      )}

*/
