import { useState, useEffect } from "react";
import { SimpleIndicatorProps } from "@/types/types";
import SVGComponent from "../atoms/displaySVG";

const SimpleIndicator: React.FC<SimpleIndicatorProps> = ({
  icon,
  value,
  progressComment,
  title,
  color,
  background = "bg-app-primary",
  unit,
  width = "w-72",
}) => {
  const [iconSize, setIconSize] = useState<string>("30");

  useEffect(() => {
    const updateIconSize = () => {
      if (window.innerWidth < 640) {
        setIconSize("20");
      } else if (window.innerWidth < 1024) {
        setIconSize("25");
      } else {
        setIconSize("30");
      }
    };

    updateIconSize();
    window.addEventListener("resize", updateIconSize);

    return () => window.removeEventListener("resize", updateIconSize);
  }, []);

  return (
    <div
      className={`rounded-3xl max-md:w-full !text-white p-5 max-md:p-3 ${background} ${width} gap-5 h-auto flex flex-col justify-between text-foreground max-md:flex-col max-md:gap-3`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span
            className={`${color} p-2 rounded-full w-fit bg-bg-secondary max-md:hidden`}
          >
            <SVGComponent icon={icon} width={iconSize} height={iconSize} />
          </span>
        )}
        <span className="text-xl font-medium max-md:w-full">{title}</span>
      </div>
      <span>
        <span className="">{`${value} ${
          unit || ""
        } | ${progressComment}`}</span>
      </span>

      {/* <div className="w-full max-md:hidden h-2 bg-app-blue-500 rounded-full mt-2">
        <div
          className={`h-full rounded-full bg-white`}
          style={{
            width:
              unit == "%" && !isNaN(+value)
                ? `${Math.min(Math.max(+value, 0), 100)}%`
                : "100%",
            transition: "width 0.4s ease",
          }}
        />
      </div> */}
    </div>
  );
};

export default SimpleIndicator;
