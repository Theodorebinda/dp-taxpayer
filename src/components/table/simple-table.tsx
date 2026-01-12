import { validateImageUrl } from "@/utils/utils";
import ImageWithFallback from "./components/table-image";
import { getNestedValue } from "./utils/utils";
import translate from "../store/dictionary";
import Link from "next/link";
import { LuEye } from "react-icons/lu";

interface Column {
  key: string;
  label: string;
  enum?: string[];
  type?: "date";
}

interface SimpleTableProps {
  data: any[];
  columns: Column[];
  displayIndex?: boolean;
  actions?: {
    view?: string;
    change?: string;
    delete?: string;
  };
}

const isLinkOrImagePath = (input: string): boolean => {
  const linkRegex = /^https?:\/\/.+/;

  const imagePathRegex = /(?:\/|^)[^\/]*\.(png|jpeg|jpg|svg)$/i;

  return linkRegex.test(input) || imagePathRegex.test(input);
};

const SimpleTable: React.FC<SimpleTableProps> = ({
  data,
  columns,
  displayIndex,
  actions,
}) => {
  const renderCell = (row: any, column: Column, rowIndex: number) => {
    const value = getNestedValue(row, column.key);

    if (isLinkOrImagePath(value)) {
      return (
        <td
          className="border border-foreground text-left p-2"
          key={`${rowIndex}-${column.key}`}
        >
          <ImageWithFallback
            src={validateImageUrl(value)}
            alt="a random images from the table"
            height={200}
            width={200}
            displayLinkOnError={true}
          />
        </td>
      );
    }

    if (column.type === "date") {
      return (
        <td
          className="border border-foreground text-left px-2"
          key={`${rowIndex}-${column.key}`}
        >
          {new Date(value).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </td>
      );
    }

    if (["string", "number"].includes(typeof value)) {
      return (
        <td
          className="border border-foreground text-left px-2"
          key={`${rowIndex}-${column.key}`}
        >
          {String(value)}
        </td>
      );
    }

    if (typeof value == "boolean") {
      return (
        <td
          className="border border-foreground text-left px-2"
          key={`${rowIndex}-${column.key}`}
        >
          {value ? "oui" : "non"}
        </td>
      );
    }

    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      return (
        <td
          className="border border-foreground text-left border-collapse "
          key={`${rowIndex}-${column.key}`}
        >
          <div className="p-0 m-0 border-collapse">
            <SimpleTable
              data={value}
              columns={Object.keys(value[0]).map((key) => ({
                key,
                label: key,
              }))}
            />
          </div>
        </td>
      );
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <td
          className="border border-foreground text-left border-collapse"
          key={`${rowIndex}-${column.key}`}
        >
          <div className="nested-table-container border-collapse">
            <SimpleTable
              data={[value]} // Transformer l'objet en tableau d'un élément
              columns={Object.keys(value).map((key) => ({
                key,
                label: key,
              }))}
            />
          </div>
        </td>
      );
    }

    return (
      <td
        className="border border-foreground text-left px-2"
        key={`${rowIndex}-${column.key}`}
      >
        {String(value ?? "N/A")}
      </td>
    );
  };

  return (
    <table className="w-full border-separate-0 overflow-x-auto">
      <thead>
        <tr>
          {displayIndex && (
            <th className="border border-foreground text-left p-2">N°</th>
          )}
          {columns.map((column) => (
            <th
              className="border border-foreground text-left px-2 py-1 text-nowrap"
              key={column.key}
            >
              {translate(column.label)}
            </th>
          ))}
          {actions?.view && (
            <th className="border border-foreground text-left font-light p-2">
              actions
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {displayIndex && (
              <td className="border border-foreground text-left font-light p-2">
                {index + 1}
              </td>
            )}
            {columns.map((column) => renderCell(row, column, index))}
            {actions?.view && actions?.view?.length > 0 && (
              <td className="border border-foreground font-light">
                <Link href={actions.view.replace("{{LINE_ID}}", row.id)} className="flex justify-center w-full h-full">
                  {" "}
                  <LuEye size={20} />{" "}
                </Link>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
