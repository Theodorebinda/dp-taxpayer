import BooleanInput from "@/components/form/inputs/booleanInput";
import { RecipeViewModel } from "@/types/recipe-view";
import { Pen } from "lucide-react";
import Link from "next/link";

const ViewRecipeQuickStatusAction = ({ data }: { data: RecipeViewModel }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 w-fit">
        <span className="">
          Cette recette est{" "}
          <strong>{data.isActive ? "actif" : "inactif"}</strong>{" "}
          <span className="max-lg:hidden">dans le système.</span>
        </span>
        <BooleanInput
          {...{
            property: "hello",
            type: "boolean",
            value: { value: data.isActive },
            verbose: "hello",
            // setValue: (value: InputValueType) => setActive(value.value),
            setValue: () => {},
          }}
        />
      </div>
      <Link
        className="flex items-center gap-2 px-5 py-2.5 bg-primary/50 rounded-full"
        href={`/change/core/recipe/${data.id}`}
      >
        <Pen size={20} /> <span className="max-lg:hidden">Editer</span>
      </Link>
    </div>
  );
};

export default ViewRecipeQuickStatusAction;
