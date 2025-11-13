import { CheckCircle2 } from "lucide-react";
import { Recipe } from "./types";

export const RecipeCard: React.FC<{
  recipe: Recipe;
  isSelected: boolean;
  onClick: () => void;
}> = ({ recipe, isSelected, onClick }) => (
  <div
    className={`bg-background cursor-pointer rounded-xl gap-5 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow ${
      isSelected && "border-2 border-primary"
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col gap-2 flex-1 items-start mb-2">
      <h4 className="text-primary font-semibold cursor-pointer hover:underline">
        {recipe.name}
      </h4>
      <p className="leading-relaxed">{recipe.description}</p>
    </div>
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-md ${
        recipe.recipeType === "IMPOT"
          ? "bg-blue-100 text-blue-600"
          : "bg-green-100 text-green-600"
      }`}
    >
      {recipe.recipeType}
    </span>
    {isSelected && (
      <span className="text-primary">
        <CheckCircle2 />
      </span>
    )}
  </div>
);
