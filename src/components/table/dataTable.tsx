import React from "react";
import { useParams } from "next/navigation";
import DataTableHeader from "./dataTableHeader";
import DataTableBody from "./dataTableBody";
import DataTablePagination from "./dataTablePagination";
import { TableProps } from "@/types/table";
import Loader from "../atoms/loader";

export function DataTable<T extends { id?: string | number; children?: T[] }>({
  data,
  columns,
  selectable = false,
  onRowSelect,
  searchable = true,
  searchKeys = [],
  setRefreshData,
  dataLength,
  onPageChange,
  currentPage,
  setRequestor,
  searching,
  setSearching,
  searchingError,
}: TableProps<T>) {
  const itemsPerPage = 20;
  const params: { app: string; model: string } = useParams();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState<T[]>([]);
  const [expandedRows, setExpandedRows] = React.useState(
    new Set<string | number>()
  );
  const [viewAction, setViewAction] = React.useState<{
    url?: string;
    label?: string;
    active: boolean;
  } | null>(null);

  const handleRowSelect = (rows: T[]) => {
    setSelectedRows(rows);
    onRowSelect?.(rows);
  };
  const toggleRowExpansion = (id: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearchChange = async (term: string) => {
    setSearchTerm(term);
    if (term.length == 0) {
      setRefreshData();
      return;
    }
    if (term.length < 2) {
      return;
    }
    setSearching(true);
    setRequestor({
      path: `search/${params.app}/${params.model}?search_value=${term}`,
      method: "GET",
    });
  };

  const handleFilterSubmit = async (filters: Record<string, any>) => {
    setSearching(true);
    await setRequestor({
      method: "POST",
      path: `filter/${params.app}/${params.model}`,
      body: filters,
    });
  };

  return (
    <div className="flex-1 flex flex-col gap-5">
      <DataTableHeader
        searchable={searchable}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        exportOptions={{
          data: data || [],
          columns: columns,
          fileName: "export-lignes",
        }}
        setFilterData={handleFilterSubmit}
        setRefreshData={setRefreshData}
        setViewAction={setViewAction}
      />
      {searching ? (
        <div>
          <Loader />
        </div>
      ) : searchingError ? (
        <>
          <div className="bg-background rounded-3xl flex flex-col justify-center items-center p-5 gap-5 min-h-56">
            <h1 className="text-3xl text-red-500 font-bold">
              {searchingError.code}
            </h1>
            <div className="px-5 py-3 rounded-full text-center w-full bg-bg-secondary max-w-5xl">
              {searchingError.message}
            </div>
          </div>
        </>
      ) : (
        <div className="flex gap-5 max-lg:flex-col-reverse">
          <div className="flex flex-col flex-1 overflow-auto">
            <DataTableBody
              data={data}
              columns={columns}
              searchable={searchable}
              searchTerm={""}
              selectable={selectable}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              expandedRows={expandedRows}
              toggleRowExpansion={toggleRowExpansion}
              params={params}
              searchKeys={searchKeys}
              viewAction={viewAction}
            />
            <DataTablePagination
              dataLength={dataLength}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
