import { Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

export const DraggableItem: React.FC<{
  id: string;
  index: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disable?: boolean;
}> = ({ id, index, children, className = "", style, disable = false }) => (
  <Draggable draggableId={id} index={index} isDragDisabled={disable}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{ ...style, ...provided.draggableProps.style }}
        className={`group flex items-center gap-2 p-3 rounded-xl font-medium transition-all ${
          snapshot.isDragging
            ? "bg-primary text-primary-foreground scale-105 rotate-2"
            : "bg-primary/10 text-primary hover:bg-primary/20 cursor-grab"
        } ${className}`}
      >
        <GripVertical
          className={`w-4 h-4 opacity-0 ${
            !disable && "group-hover:opacity-100"
          } transition-opacity`}
        />
        {children}
      </div>
    )}
  </Draggable>
);
