import React from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import ImageWithFallback from "./components/table-image";
import { validateImageUrl } from "@/utils/utils";
import { getNestedValue } from "./utils/utils";
import { iconsDictionary } from "../store/icon";
import SVGComponent from "../atoms/displaySVG";
import { DataTableColumnType } from "@/types/table";
import { PhoneNumberCopy } from "./components/phoneCopy";
import { EmailCopy } from "./components/mailCopy";
import EnumDisplayer from "./components/enumDisplayer";
import { TextCopy } from "../atoms/textCopy";
import translate from "../store/dictionary";
// import { LuMinus, LuPlus } from "react-icons/lu";

interface Props<T> {
  item: Record<string, any> & { level: number; parentId?: string | number };
  columns: DataTableColumnType<T>[];
  selectable: boolean;
  selectedRows: T[];
  onRowSelect: (selectedRows: T[]) => void;
  params: { app: string; model: string };
  expandedRows: Set<string | number>;
  toggleRowExpansion: (id: string | number) => void;
  viewAction: {
    url?: string;
    label?: string;
    active: boolean;
  } | null;
  index: number;
}

const DataTableRow = <T extends { id?: string | number; children?: T[] }>({
  item,
  columns,
  selectable,
  selectedRows,
  onRowSelect,
  params,
  expandedRows,
  toggleRowExpansion,
  viewAction,
  index = 0,
}: Props<T>) => {
  const hasChildren = !!item.children?.length;
  const isExpanded = hasChildren && expandedRows.has(item.id ?? "");

  const handleCheckboxChange = () => {
    const newSelectedRows = selectedRows.includes(item.id as T)
      ? selectedRows.filter((row) => row !== item.id)
      : [...selectedRows, item.id as T];
    onRowSelect(newSelectedRows);
  };

  const renderCellContent = (column: DataTableColumnType<T>) => {
    const property = column.property as string;
    const [root, ...nested] = property.split(".");
    const value =
      getNestedValue(
        item[root],
        nested.length > 0 ? nested.join(".") : property
      ) ?? "---";

    if (column?.type) {
      switch (column.type) {
        case "copyable":
          <TextCopy>{value}</TextCopy>;
        case "mobile":
          return <PhoneNumberCopy mobile={value} />;
        case "email":
          return <EmailCopy email={value} />;
        case "enum":
          if (column.enumOptions) {
            return (
              <EnumDisplayer value={value} enumOptions={column.enumOptions} />
            );
          }
        case "photo":
          return (
            <ImageWithFallback
              src={validateImageUrl(value)}
              width={64}
              height={64}
              alt={`${property} image`}
              className="rounded-md h-fit max-h-16 min-h-14 min-w-14  w-fit"
            />
          );
        case "svg":
          const IconComponent =
            value in iconsDictionary
              ? iconsDictionary[value as keyof typeof iconsDictionary].component
              : null;
          return IconComponent ? (
            <IconComponent size={20} />
          ) : (
            <SVGComponent width="20" height="20" icon={value as string} />
          );
        default:
          break;
      }
    }

    switch (property) {
      case "url":
      case "photo":
        return (
          <ImageWithFallback
            src={validateImageUrl(value)}
            width={64}
            height={64}
            alt={`${property} image`}
            className="rounded-md h-fit max-h-16 min-h-14 min-w-14  w-fit"
          />
        );
      case "icon":
        const IconComponent =
          value in iconsDictionary
            ? iconsDictionary[value as keyof typeof iconsDictionary].component
            : null;
        return IconComponent ? (
          <IconComponent size={20} />
        ) : (
          <SVGComponent width="20" height="20" icon={value as string} />
        );

      case "createdAt":
        return value ? new Date(value).toLocaleDateString("fr-FR") : "---";

      // case "wallets.solde":
      //   const wallet = item.wallets?.[0];
      //   return wallet?.solde ? `${wallet.solde} fc` : "---";

      default:
        return (
          <span
            className={`${value.length >= 60 ? "text-wrap" : "text-nowrap"}`}
          >
            {translate(value)}
          </span>
        );
    }
  };

  return (
    <>
      <tr
        className={`group hover:bg-app-green-50 dark:hover:bg-app-blue-400 transition-colors text-base ${
          index % 2 === 0 ? "bg-background" : "bg-bg-secondary"
        }`}
      >
        {selectable && (
          <td className="px-4 py-2 whitespace-nowrap">
            <input
              type="checkbox"
              className="rounded "
              checked={selectedRows.includes(item.id as T)}
              onChange={handleCheckboxChange}
            />
          </td>
        )}
        <td className="px-2 py-2 w-fit">
          {hasChildren && (
            <button
              onClick={() => toggleRowExpansion(item.id!)}
              className="p-1 hover:bg-bg-secondary rounded-full text-primary"
              aria-label={isExpanded ? "Collapse row" : "Expand row"}
            >
              {isExpanded ? (
                <FiChevronDown className="w-4 h-4" />
              ) : (
                // <LuMinus className="w-4 h-4" />
                <FiChevronRight className="w-4 h-4" />
                // // <LuPlus className="w-4 h-4" />
              )}
            </button>
          )}
        </td>
        {columns.map((column, index) => (
          <td
            key={`${item.id ?? index}-${String(column.property)}-${item.level}`}
            className={`${
              // ""
              index == 0 && hasChildren ? "" : "px-4 py-2"
            } font-normal min-w-32`}
            style={{
              paddingLeft:
                index === 0 ? `${item.level * 20 + 20}px` : undefined,
            }}
          >
            {renderCellContent(column)}
          </td>
        ))}

        {viewAction !== null && viewAction.active && (
          <td
            className={`group-hover:bg-app-green-50 dark:group-hover:bg-app-blue-400 px-4 py-2 whitespace-nowrap w-fit bg-background z-10 transition-colors ${
              index % 2 === 0 ? "bg-background" : "bg-bg-secondary"
            }`}
          >
            <Link
              href={
                viewAction.url
                  ? viewAction.url.replace("{{ID}}", String(item.id))
                  : `/change/${params.app}/${params.model}/${item.id}`
              }
              className="text-sm font-semibold text-primary hover:underline"
            >
              {viewAction.label?.toUpperCase() ?? "AFFICHER"}
            </Link>
          </td>
        )}
      </tr>
      {isExpanded &&
        item.children?.map((childItem: T, childIndex: number) => (
          <DataTableRow
            key={`${childItem.id ?? childIndex}-${item.level + 1}`}
            item={{ ...childItem, level: item.level + 1, parentId: item.id }}
            columns={columns}
            selectable={selectable}
            selectedRows={selectedRows}
            index={childIndex}
            onRowSelect={onRowSelect}
            params={params}
            expandedRows={expandedRows}
            toggleRowExpansion={toggleRowExpansion}
            viewAction={viewAction}
          />
        ))}
    </>
  );
};

export default DataTableRow;
