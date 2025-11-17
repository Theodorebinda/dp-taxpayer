import React, { useState } from "react";
import * as XLSX from "xlsx";
import { DataTableColumnType } from "@/types/table";
import { getNestedValue } from "../utils/utils";
import { LuDownload } from "react-icons/lu";
import Button from "@/components/commons/button";

type Props<T> = {
  data: T[];
  columns: DataTableColumnType<T>[];
  fileName?: string;
  active: boolean;
};

export function ExportToExcelModal<T>({
  active,
  data,
  columns,
  fileName = "export",
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.map((c) => String(c.property))
  );

  const toggleColumn = (property: string) => {
    setSelectedColumns((prev) =>
      prev.includes(property)
        ? prev.filter((p) => p !== property)
        : [...prev, property]
    );
  };

  const handleExport = () => {
    const exportData = data.map((row) => {
      const rowData: Record<string, any> = {};
      columns.forEach((col) => {
        if (selectedColumns.includes(String(col.property))) {
          rowData[col.verbose] = getNestedValue(row, String(col.property));
        }
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    setIsOpen(false);
  };

  return (
    <>
      <Button
        disabled={!active}
        onClick={() => setIsOpen(true)}
        className="py-3 px-5 rounded-full! max-lg:w-full"
      >
        <LuDownload size={15} />{" "}
        <span className="max-md:hidden text-nowrap">Exporter en Excel</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center">
          <div className="bg-background border border-bg-secondary rounded-xl p-6 w-full max-w-lg max-h-[90vh] max-lg:w-[90vw] overflow-y-auto flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Options d’exportation{" "}
                <span className="md:hidden">en fichier Excel</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Colonnes à inclure :</p>
              <div className="grid grid-cols-2 gap-2">
                {columns.map((col) => (
                  <label
                    key={String(col.property)}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(String(col.property))}
                      onChange={() => toggleColumn(String(col.property))}
                    />
                    <span className="text-sm">{col.verbose}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 text-sm text-app-blue"
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-xl bg-app-green hover:bg-app-green-700 text-white text-sm"
              >
                Exporter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExportToExcelModal;
