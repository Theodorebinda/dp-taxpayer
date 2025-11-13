// src/components/Input/CsvExcelImportInput.tsx
import React, { useState, useRef, useEffect } from "react";
import { InputType, ApiInputType } from "@/types/types";
import translate from "@/components/store/dictionary";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { LuDelete, LuFolder } from "react-icons/lu";
import { Download, Trash, Trash2 } from "lucide-react";
import Button from "@/components/commons/button";

interface CsvExcelImportInputProps extends InputType {
  children?: ApiInputType[];
}

interface ColumnMapping {
  fieldProperty: string;
  fieldVerbose: string;
  fileColumn: string | null;
  fieldType: string;
}

const CsvExcelImportInput: React.FC<CsvExcelImportInputProps> = ({
  id,
  value,
  setValue,
  children = [],
  isOptional,
  property,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [step, setStep] = useState<"upload" | "mapping" | "preview">("upload");
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    property: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les données existantes depuis value
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      setTableData(value as any[]);
      setStep("preview");
    }
  }, []);

  // Initialiser les mappings de colonnes
  const initializeColumnMappings = (columns: string[]) => {
    const mappings: ColumnMapping[] = children.map((field) => ({
      fieldProperty: field.property,
      fieldVerbose: field.verbose,
      fileColumn: null,
      fieldType: field.type,
    }));

    // Essayer de mapper automatiquement par nom similaire
    mappings.forEach((mapping) => {
      const matchingColumn = columns.find(
        (col) =>
          col.toLowerCase().trim() ===
            mapping.fieldVerbose.toLowerCase().trim() ||
          col.toLowerCase().trim() ===
            mapping.fieldProperty.toLowerCase().trim()
      );
      if (matchingColumn) {
        mapping.fileColumn = matchingColumn;
      }
    });

    setColumnMappings(mappings);
  };

  // Télécharger le template
  const downloadTemplate = (format: "csv" | "xlsx") => {
    if (children.length === 0) {
      alert("Aucune colonne définie pour générer le template");
      return;
    }

    // Créer les en-têtes
    const headers = children.map((field) => field.verbose);
    const headerRow: Record<string, string> = {};
    children.forEach((field) => {
      headerRow[field.verbose] = "";
    });

    if (format === "csv") {
      // Générer CSV
      const csv = Papa.unparse([headerRow], {
        header: true,
        columns: headers,
      });

      // Télécharger
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `template_${property}.csv`;
      link.click();
    } else {
      // Générer Excel
      const worksheet = XLSX.utils.json_to_sheet([headerRow]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      // Télécharger
      XLSX.writeFile(workbook, `template_${property}.xlsx`);
    }
  };

  // Lire le fichier CSV
  const readCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const columns = Object.keys(results.data[0] as object);
          setFileColumns(columns);
          setRawData(results.data);
          initializeColumnMappings(columns);
          setStep("mapping");
        } else {
          alert("Le fichier CSV est vide");
        }
      },
      error: (error) => {
        console.error("Erreur lors de la lecture du CSV:", error);
        alert("Erreur lors de la lecture du fichier CSV");
      },
    });
  };

  // Lire le fichier Excel
  const readExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0] as object);
          setFileColumns(columns);
          setRawData(jsonData);
          initializeColumnMappings(columns);
          setStep("mapping");
        } else {
          alert("Le fichier Excel est vide");
        }
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier Excel:", error);
        alert("Erreur lors de la lecture du fichier Excel");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
      readCSV(file);
    } else if (["xlsx", "xls"].includes(extension || "")) {
      readExcel(file);
    } else {
      alert("Format de fichier non supporté. Utilisez CSV ou Excel.");
    }
  };

  // Déclencher le clic sur l'input file
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Gérer le changement de mapping
  const handleMappingChange = (fieldProperty: string, fileColumn: string) => {
    setColumnMappings((prev) =>
      prev.map((mapping) =>
        mapping.fieldProperty === fieldProperty
          ? { ...mapping, fileColumn: fileColumn || null }
          : mapping
      )
    );
  };

  // Valider et transformer les données
  const handleValidateMapping = () => {
    const transformedData = rawData.map((row) => {
      const transformedRow: Record<string, any> = {};

      columnMappings.forEach((mapping) => {
        if (mapping.fileColumn) {
          let value = row[mapping.fileColumn];

          // Conversion selon le type
          switch (mapping.fieldType) {
            case "number":
            case "float":
              value = value ? parseFloat(value) : null;
              break;
            case "boolean":
              value = Boolean(value);
              break;
            case "date":
              value = value
                ? new Date(value).toISOString().split("T")[0]
                : null;
              break;
            default:
              value = value?.toString() || "";
          }

          transformedRow[mapping.fieldProperty] = value;
        } else {
          transformedRow[mapping.fieldProperty] = null;
        }
      });

      return transformedRow;
    });

    setTableData(transformedData);
    setValue(transformedData);
    setStep("preview");
  };

  // Ajoute cette fonction au-dessus du return
  const handleCellValueChange = (
    rowIndex: number,
    property: string,
    newValue: any
  ) => {
    setTableData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [property]: newValue };
      return updated;
    });
  };

  // Modifie handleCellEdit pour ne plus couper l’édition :
  const handleCellEdit = (rowIndex: number, property: string) => {
    // On active juste l’édition sans modifier la valeur
    setEditingCell({ rowIndex, property });
  };

  // Valide la modification au blur :
  const handleCellBlur = (rowIndex: number, property: string) => {
    setValue(tableData); // on synchronise les données finales
    setEditingCell(null); // on quitte le mode édition
  };

  // Supprimer une ligne
  const handleDeleteRow = (rowIndex: number) => {
    const updatedData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(updatedData);
    setValue(updatedData);
  };

  // Ajouter une ligne vide
  const handleAddRow = () => {
    const emptyRow: Record<string, any> = {};
    children.forEach((field) => {
      emptyRow[field.property] = null;
    });
    const updatedData = [...tableData, emptyRow];
    setTableData(updatedData);
    setValue(updatedData);
  };

  // Réinitialiser
  const handleReset = () => {
    setFileName("");
    setFileColumns([]);
    setColumnMappings([]);
    setRawData([]);
    setTableData([]);
    setStep("upload");
    setValue([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4 bg-bg-secondary p-5 rounded-lg">
      {/* Étape 1: Upload */}
      {step === "upload" && (
        <div className="space-y-4">
          {/* Zone de téléchargement du template */}
          <div className="bg-primary/10 border border-primary/40 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                <Download />{" "}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Télécharger un template</h4>
                <p className="text-sm text-primary mb-3">
                  Téléchargez un fichier modèle avec les colonnes pré-définies
                </p>
                <div className="flex gap-5 w-full">
                  <button
                    type="button"
                    onClick={() => downloadTemplate("csv")}
                    className="w-full max-w-lg px-3 py-1.5 text-sm bg-blue-600 text-background rounded hover:bg-blue-700"
                  >
                    Template CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadTemplate("xlsx")}
                    className="w-full max-w-lg px-3 py-1.5 text-sm bg-green-600 text-background rounded hover:bg-green-700"
                  >
                    Template Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Zone d'upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              id={id}
              name={property}
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              required={!isOptional}
            />
            <div className="space-y-4">
              <div className="text-4xl flex justify-center">
                {" "}
                <LuFolder />{" "}
              </div>
              <div>
                <div className="font-medium text-lg mb-2">
                  Importer un fichier CSV ou Excel
                </div>
                <div className="text-sm mb-4">
                  Formats acceptés: .csv, .xlsx, .xls
                </div>
              </div>
              <button
                type="button"
                onClick={handleImportClick}
                className="px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary/80 transition-colors"
              >
                Choisir un fichier
              </button>
            </div>
            {fileName && (
              <div className="mt-4 text-sm">
                Fichier sélectionné: <strong>{fileName}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Étape 2: Mapping des colonnes */}
      {step === "mapping" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Mapper les colonnes du fichier
            </h3>
            <Button variant="outline" onClick={handleReset}>
              ↻ Réimporter
            </Button>
          </div>

          <div className="bg-bg-secondary p-4 rounded border border-foreground/40">
            <div className="grid grid-cols-3 gap-4 font-semibold text-sm mb-2 pb-2 border-b">
              <div>Champ requis</div>
              <div>Type</div>
              <div>Colonne du fichier</div>
            </div>

            {columnMappings.map((mapping) => (
              <div
                key={mapping.fieldProperty}
                className="grid grid-cols-3 gap-4 items-center py-2 border-b last:border-b-0"
              >
                <div className="text-sm font-medium">
                  {translate(mapping.fieldVerbose, true)}
                </div>
                <div className="text-sm">{mapping.fieldType}</div>
                <select
                  value={mapping.fileColumn || ""}
                  onChange={(e) =>
                    handleMappingChange(mapping.fieldProperty, e.target.value)
                  }
                  className="text-sm rounded border border-foreground/40 px-2 py-1"
                >
                  <option
                    className="text-background hover:text-background hover:font-semibold"
                    value=""
                  >
                    -- Non mappé --
                  </option>
                  {fileColumns.map((col) => (
                    <option
                      className="text-background hover:text-background hover:font-semibold"
                      key={col}
                      value={col}
                    >
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleValidateMapping}
              //   className="px-4 py-2 bg-blue-600 text-background rounded hover:bg-blue-700"
            >
              Valider et prévisualiser
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              //   className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Étape 3: Prévisualisation et édition */}
      {step === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Données importées ({tableData.length} ligne(s))
            </h3>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAddRow}
                className="px-3 py-1 text-sm"
              >
                + Ajouter une ligne
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="px-3 py-1 text-sm"
              >
                ↻ Réimporter
              </Button>
            </div>
          </div>

          <div className="border rounded overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-foreground/10 border-b">
                <tr>
                  {children.map((field) => (
                    <th
                      key={field.property}
                      className="px-3 py-2 text-left font-semibold"
                    >
                      {translate(field.verbose, true)}
                    </th>
                  ))}
                  <th className="px-3 py-2 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b hover:bg-foreground/15">
                    {children.map((field) => {
                      const isEditing =
                        editingCell?.rowIndex === rowIndex &&
                        editingCell?.property === field.property;

                      return (
                        <td
                          key={field.property}
                          className="px-3 py-2 cursor-pointer"
                          onClick={() =>
                            setEditingCell({
                              rowIndex,
                              property: field.property,
                            })
                          }
                        >
                          {isEditing ? (
                            <input
                              type={
                                field.type === "number" ||
                                field.type === "float"
                                  ? "number"
                                  : field.type === "date"
                                  ? "date"
                                  : "text"
                              }
                              value={row[field.property] ?? ""}
                              onChange={(e) =>
                                handleCellValueChange(
                                  rowIndex,
                                  field.property,
                                  e.target.value
                                )
                              }
                              onBlur={() =>
                                handleCellBlur(rowIndex, field.property)
                              }
                              autoFocus
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            <button
                              className="block truncate"
                              onClick={() =>
                                handleCellEdit(rowIndex, field.property)
                              }
                            >
                              {row[field.property]?.toString() || "-"}
                            </button>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(rowIndex)}
                        className="text-red-600 hover:text-red-800 w-full flex justify-center"
                        title="Supprimer"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvExcelImportInput;
