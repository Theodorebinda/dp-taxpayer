import { Search } from "lucide-react";
import { RecipeCard } from "./recipeCard";
import { Recipe } from "./types";

export const SearchSection: React.FC<{
  searchTerm: string;
  onSearchChange: (value: string) => void;
}> = ({ searchTerm, onSearchChange }) => (
  <section
    className={`w-full mx-auto text-center flex flex-col justify-center items-center p-5 rounded-xl space-y-5 ${
      searchTerm ? "" : " min-h-96 max-lg:h-full bg-background"
    }`}
  >
    <h2 className="text-2xl md:text-3xl font-bold">
      Recherche d&apos;informations fiscales
    </h2>
    <p>
      Trouvez rapidement des formulaires, des déductions et des articles d&apos;aide.
    </p>

    <div className="bg-background flex gap-5 items-center w-full max-w-3xl px-5 py-2 border border-foreground/40 rounded-xl">
      <Search size={20} />
      <input
        type="search"
        placeholder="Rechercher un formulaire, une déduction, un article d'aide..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full outline-none font-semibold"
      />
    </div>
  </section>
);

export const SearchResults: React.FC<{
  loading: boolean;
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  onSelectRecipe: (recipe: Recipe) => void;
}> = ({ loading, recipes, selectedRecipe, onSelectRecipe }) => (
  <section className="max-w-3xl mx-auto space-y-5">
    <h3 className="text-lg font-semibold">Résultats de la recherche</h3>
    {loading ? (
      <div className="flex justify-center py-12">Chargement...</div>
    ) : (
      <div className="space-y-4 min-h-20 flex flex-col">
        {recipes.length === 0 ? (
          <div className="min-h-72 flex items-center justify-center">
            Aucun résultat trouvé
          </div>
        ) : (
          recipes.map((item) => (
            <RecipeCard
              key={item.id}
              recipe={item}
              isSelected={selectedRecipe?.id === item.id}
              onClick={() => onSelectRecipe(item)}
            />
          ))
        )}
      </div>
    )}
  </section>
);
