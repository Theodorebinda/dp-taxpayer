import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import HttpClient from "@/utils/http-client";
import FilterForm from "./components/filterForm";
import { DataTableColumnType } from "@/types/table";
import ExportToExcelModal from "./components/exporter";
import { LuRefreshCcw } from "react-icons/lu";
import Button from "../commons/button";

interface Props {
  searchable: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  setFilterData: (data: Record<string, any>) => void;
  setRefreshData: (state: boolean) => void;
  exportOptions?: {
    data: any[];
    columns: DataTableColumnType<any>[];
    fileName?: string;
  };
  setViewAction: (action: {
    url?: string;
    label?: string;
    active: boolean;
  }) => void;
}

const DataTableHeader: React.FC<Props> = ({
  searchTerm,
  onSearchChange,
  setFilterData,
  setRefreshData,
  exportOptions,
  setViewAction,
}) => {
  const params: { app: string; model: string } = useParams();
  const router = useRouter();
  type ActionKey = "create" | "export" | "filter" | "view" | "search";
  type ActionMap = {
    [K in ActionKey]: { url?: string; label?: string; active: boolean };
  };
  const [actions, setActions] = useState<ActionMap | null>(null);
  const [_metas, setMetas] = useState<{
    filterOptions: {
      property: string;
      verbose: string;
      type: "text" | "number" | "boolean" | "enum" | "date";
      options?: { label: string; value: string }[];
    }[];
  }>({ filterOptions: [] });

  useEffect(() => {
    const requester = async () => {
      const httpClient = new HttpClient();
      const data:
        | {
            code: number;
            message: string;
            data: {
              [K in ActionKey]: {
                url?: string;
                label?: string;
                active: boolean;
              };
            };
            _meta?: {
              filterOptions: {
                property: string;
                verbose: string;
                type: "text" | "number" | "boolean" | "enum" | "date";
                options?: { label: string; value: string }[];
              }[];
            };
          }
        | false = await httpClient.get(`actions/${params.app}/${params.model}`);

      if (!data) {
        console.error(httpClient.error);
      } else {
        setActions(data.data);
        setViewAction(data.data.view || null);
        if (data?._meta) setMetas(data?._meta);
      }
    };

    requester();
  }, [params.app, params.model]);

  if (!actions) {
    return false;
  }
  return (
    <div className="flex justify-end items-center gap-3 max-md:flex-col">
      <div
        className={`w-full flex items-center px-7 focus:outline-none focus:ring-2 rounded-full bg-background border-background gap-4 ${
          actions?.search?.active
            ? "text-foreground"
            : "cursor-not-allowed opacity-70 text-foreground"
        }`}
      >
        <input
          type="text"
          disabled={!actions?.search?.active}
          placeholder="Rechercher..."
          className={`w-full flex-1 bg-background outline-none h-10 py-5 ${
            actions?.search?.active ? "text-foreground" : "cursor-not-allowed"
          }`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <FiSearch
          size={15}
          className={`${actions?.search?.active ? "" : "text-gray-50"}`}
        />
      </div>

      <div className="flex gap-2 items-center max-lg:w-full justify-between">
        <FilterForm
          active={actions?.filter?.active}
          fields={_metas?.filterOptions}
          onSubmit={(data) => {
            if (setFilterData) {
              setFilterData(data);
            }
          }}
        />

        <Button
          disabled={!actions?.create?.active}
          onClick={() => {
            router.push(
              actions.create?.url
                ? actions.create.url[0]
                  ? "/" + actions.create.url
                  : actions.create.url
                : `/create/${params.app}/${params.model}`
            );
          }}
          className="py-3 px-5 !rounded-full max-lg:w-full"
        >
          <FiPlus size={15} />
          <span className="w-full max-md:hidden">
            {actions.create?.label ?? "Ajouter"}
          </span>
        </Button>

        <ExportToExcelModal
          {...{
            data: exportOptions?.data || [],
            columns: exportOptions?.columns || [],
            fileName: exportOptions?.fileName || "",
            active:
              actions?.export?.active && typeof exportOptions !== "undefined",
          }}
        />
        {setRefreshData && (
          <Button
            onClick={() => {
              if (setRefreshData) {
                setRefreshData(true);
              }
            }}
            className="py-3 px-5 !rounded-full max-lg:w-full"
          >
            <LuRefreshCcw size={15} />
            <span className="w-full max-md:hidden">Refraichir</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataTableHeader;
