import SVGComponent from "@/components/atoms/displaySVG";
import translate from "@/components/store/dictionary";
import { DataTableColumnType } from "@/types/table";

interface EnumDisplayerProps {
  value: string;
  enumOptions: DataTableColumnType<"enumOptions">["enumOptions"];
}

const getColor = (
  color:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "purple"
    | "indigo"
    | "pink"
    | "gray"
    | "teal"
    | "cyan"
    | "orange"
) => {
  switch (color) {
    case "red":
      return "bg-red-100 text-red-500";
    case "green":
      return "bg-green-100 text-green-500";
    case "blue":
      return "bg-blue-100 text-blue-500";
    case "yellow":
      return "bg-yellow-100 text-yellow-500";
    case "purple":
      return "bg-purple-100 text-purple-500";
    case "indigo":
      return "bg-indigo-100 text-indigo-500";
    case "pink":
      return "bg-pink-100 text-pink-500";
    case "gray":
      return "bg-gray-100 text-gray-500";
    case "teal":
      return "bg-teal-100 text-teal-500";
    case "cyan":
      return "bg-cyan-100 text-cyan-500";
    case "orange":
      return "bg-orange-100 text-orange-500";
  }
};

const EnumDisplayer = ({ value, enumOptions }: EnumDisplayerProps) => {
  const option = enumOptions?.find((option) => option.key === value);
  if (option) {
    return (
      <div
        className={`w-fit flex items-center gap-2 ${getColor(
          option.color
        )} py-1 px-2 rounded-md`}
      >
        {option.startIcon && (
          <SVGComponent width="20" height="20" icon={option.startIcon} />
        )}
        <span className={`text-nowrap`}>
          {translate(option.key).toUpperCase()}
        </span>
        {option.endIcon && (
          <SVGComponent width="20" height="20" icon={option.endIcon} />
        )}
      </div>
    );
  }
};

export default EnumDisplayer;
