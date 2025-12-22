import React, { useState, ReactElement } from "react";
import { flattenData, getNestedValue } from "./utils/utils";
import DataTableRow from "./dataTableBodyRow";
import { DataTableColumnType } from "@/types/table";

interface Props<T> {
  data: T[];
  columns: DataTableColumnType<T>[];
  searchable: boolean;
  searchTerm: string;
  selectable: boolean;
  selectedRows: T[];
  onRowSelect: (selectedRows: T[]) => void;
  expandedRows: Set<string | number>;
  toggleRowExpansion: (id: string | number) => void;
  params: { app: string; model: string };
  searchKeys: (keyof T)[];
  viewAction: {
    url?: string;
    label?: string;
    active: boolean;
  } | null;
}

const DataTableBody = <
  FlattenedItem extends { id?: string | number; children?: FlattenedItem[] }
>({
  data,
  columns,
  searchable,
  searchTerm,
  selectable = false,
  selectedRows,
  onRowSelect,
  params,
  searchKeys,
  viewAction,
}: Props<FlattenedItem>): ReactElement => {
  const [expandedRows, setExpandedRows] = useState(new Set<string | number>());

  const validatedSearchKeys = React.useMemo(
    () =>
      searchKeys.length > 0
        ? searchKeys
        : columns.map((column) => column.property),
    [columns, searchKeys]
  );

  const filteredData = React.useMemo(() => {
    let filtered = data;
    if (searchable && searchTerm) {
      filtered = data.filter((item) =>
        validatedSearchKeys.some((key) => {
          const value = getNestedValue(item, key as string);
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
    return flattenData(filtered);
  }, [data, searchable, searchTerm, validatedSearchKeys]);

  const toggleRowExpansion = (id: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="overflow-x-auto  rounded-xl text-foreground">
      <table className="min-w-full divide-y divide-foreground/30">
        <thead className="bg-foreground/10">
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  className="rounded b bg-bg-secondary text-foreground"
                  checked={selectedRows.length === filteredData.length}
                  onChange={() => {
                    // const selected = e.target.checked ? filteredData : [];
                    // setSelectedRows(selected);
                    // onRowSelect?.(selected);
                  }}
                />
              </th>
            )}
            <td></td>
            {columns.map((column) => (
              <th
                key={String(column.property)}
                className={`px-5 py-3 text-left text-base text-wrap font-bold text-foreground tracking-wider ${
                  column.property == "id" ? "w-40" : column.width || ""
                } ${
                  String(column.property)?.length >= 60
                    ? "text-wrap"
                    : "text-nowrap"
                }`}
              >
                {column.verbose.toUpperCase()}
              </th>
            ))}
            {viewAction && viewAction.active && (
              <th className="px-4 py-3 text-left font-bold text-foreground tracking-wider w-30 z-10">
                {"ACTION"}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-foreground/30">
          {filteredData.map((item: any, index) => (
            <DataTableRow
              key={`${item.id || index}-${item.level}`}
              item={item}
              columns={columns}
              index={index}
              selectable={selectable}
              selectedRows={selectedRows}
              onRowSelect={onRowSelect}
              params={params}
              expandedRows={expandedRows}
              toggleRowExpansion={toggleRowExpansion}
              viewAction={viewAction}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableBody;
