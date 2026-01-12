import { useState, useRef } from "react";
import { GoGrabber } from "react-icons/go";

interface ResizableComponentProps {
  children: React.ReactNode;
  shouldResize?: boolean;
  initialWidth?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  resizeHandlePosition?: "left" | "right";
}

const ResizableComponent = ({
  children,
  shouldResize = true,
  initialWidth = "33.33%",
  minWidth = "10%",
  maxWidth = "90%",
  resizeHandlePosition = "left",
}: ResizableComponentProps) => {
  const [width, setWidth] = useState(initialWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;

    const startX = e.clientX;
    const startWidth = containerRef.current?.offsetWidth || 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      const deltaX = e.clientX - startX;
      const newWidth =
        resizeHandlePosition === "right"
          ? startWidth + deltaX
          : startWidth - deltaX;
      const parentWidth =
        containerRef.current?.parentElement?.offsetWidth || window.innerWidth;
      const minWidthPx =
        typeof minWidth === "string" && minWidth.endsWith("%")
          ? (parseFloat(minWidth) / 100) * parentWidth
          : parseFloat(minWidth as string);
      const maxWidthPx =
        typeof maxWidth === "string" && maxWidth.endsWith("%")
          ? (parseFloat(maxWidth) / 100) * parentWidth
          : parseFloat(maxWidth as string);

      const clampedWidth = Math.min(Math.max(newWidth, minWidthPx), maxWidthPx);

      if (containerRef.current) {
        containerRef.current.style.width = `${clampedWidth}px`;
      }
    };

    const handleMouseUp = () => {
      isResizing.current = false;

      if (containerRef.current) {
        setWidth(`${containerRef.current.offsetWidth}px`);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-fit max-md:w-full!"
      style={{ width: shouldResize ? width : initialWidth }}
    >
      {shouldResize && (
        <div
          className={`absolute max-md:hidden top-0 bottom-0 w-2 cursor-ew-resize bg-background border-r border-bg-secondary flex justify-center items-center ${
            resizeHandlePosition === "right" ? "right-0" : "left-0"
          }`}
          onMouseDown={handleMouseDown}
        >
          <GoGrabber size={25} className="text-foreground" />
        </div>
      )}
      {children}
    </div>
  );
};

export default ResizableComponent;
