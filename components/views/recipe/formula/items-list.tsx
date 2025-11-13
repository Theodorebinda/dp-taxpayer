import { Droppable } from "@hello-pangea/dnd";
import { Variable } from "./types";
import { DraggableItem } from "./draggable-item";
import { ChevronDown } from "lucide-react";

export const VariablesList: React.FC<{
  variables: (Variable & { level: number })[];
}> = ({ variables }) => (
  <Droppable droppableId="variables" isDropDisabled>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="bg-card rounded-2xl p-6 border-2 border-primary/20 overflow-scroll hover:border-primary/40 hover:shadow-xl transition-all max-h-[600px] overflow-y-auto space-y-2"
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          Variables
        </h3>
        {variables.map((v, index) => (
          <DraggableItem
            key={v.id + index}
            id={`var-${v.id}`}
            index={index}
            style={{ marginLeft: `${v.level * 16}px` }}
            disable={
              "children" in v &&
              v.children !== undefined &&
              v?.children.length > 0
            }
          >
            <div className="text-sm flex justify-start gap-2 w-full">
              {v.children && v.children?.length > 0 && (
                <ChevronDown size={16} />
              )}
              {v.property}
            </div>
          </DraggableItem>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export const OperationsList: React.FC<{ operations: string[] }> = ({
  operations,
}) => (
  <Droppable droppableId="operations" isDropDisabled>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="bg-card rounded-2xl p-6 border-2 overflow-scroll border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all space-y-2"
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          Opérations
        </h3>
        <div className="grid grid-cols-3 gap-2 max-lg:grid-cols-2">
          {operations.map((op, index) => (
            <DraggableItem
              key={`op-${index}`}
              id={`op-${index}`}
              index={index}
              className="justify-center"
            >
              <span className="text-lg font-semibold">{op}</span>
            </DraggableItem>
          ))}
        </div>
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export const FunctionsList: React.FC<{ functions: string[] }> = ({
  functions,
}) => (
  <Droppable droppableId="functions" isDropDisabled>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="bg-card rounded-2xl p-6 border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all max-h-[600px] overflow-y-auto space-y-2"
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          Fonctions
        </h3>
        {functions.map((func, index) => (
          <DraggableItem
            key={`func-${index}`}
            id={`func-${index}`}
            index={index}
          >
            <span className="text-sm font-mono">{func}</span>
          </DraggableItem>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);
