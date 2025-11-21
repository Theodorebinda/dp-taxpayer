import {
  Building2,
  CreditCard,
  FilePenLine,
  FileSpreadsheet,
  FolderOpen,
  LucideIcon,
  PlusCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { DeclarableRecipe } from "@/types/recipe.type";

type RecipeAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  disabled?: boolean;
  recipeId: string;
  href?: string;
};

// Mapping des types de recipes vers des icônes et couleurs
const recipeTypeConfig: Record<
  string,
  {
    icon: LucideIcon;
    accentBg: string;
    accentText: string;
    accentBorder: string;
  }
> = {
  TAX: {
    icon: FilePenLine,
    accentBg: "bg-gradient-to-br from-[#fff7ed] to-[#ffedd5]",
    accentText: "text-[#9a3412]",
    accentBorder: "border-[#9a3412]/40",
  },
  IMPOT: {
    icon: Building2,
    accentBg: "bg-gradient-to-br from-[#ecfccb] to-[#d9f99d]",
    accentText: "text-[#166534]",
    accentBorder: "border-[#16a34a]/40",
  },
  REDEVANCE: {
    icon: FileSpreadsheet,
    accentBg: "bg-gradient-to-br from-[#ede9fe] to-[#ddd6fe]",
    accentText: "text-[#5b21b6]",
    accentBorder: "border-[#7c3aed]/40",
  },
  default: {
    icon: PlusCircle,
    accentBg: "bg-gradient-to-br from-[#e0f2fe] to-[#dbeafe]",
    accentText: "text-[#075985]",
    accentBorder: "border-[#0ea5e9]/40",
  },
};

// Actions statiques (non basées sur les recipes)
const staticActions: RecipeAction[] = [
  {
    id: "documents",
    title: "Mes documents",
    subtitle: "Consulter vos pièces justificatives",
    icon: FolderOpen,
    accentBg: "bg-gradient-to-br from-[#f3e8ff] to-[#f5f3ff]",
    accentText: "text-[#7e22ce]",
    accentBorder: "border-[#a855f7]/40",
    href: "/list/documents",
    recipeId: "",
  },
  {
    id: "payments",
    title: "Paiements",
    subtitle: "Voir l'historique de vos paiements",
    icon: CreditCard,
    accentBg: "bg-gradient-to-br from-[#cffafe] to-[#e0f2fe]",
    accentText: "text-[#0f766e]",
    accentBorder: "border-[#0d9488]/40",
    href: "/list/payments",
    recipeId: "",
  },
];

/**
 * Convertit une liste de recipes déclarables en actions rapides
 */
export function mapRecipesToActions(
  recipes: DeclarableRecipe[]
): RecipeAction[] {
  const recipeActions: RecipeAction[] = recipes.map((recipe) => {
    const type = recipe.recipeType || "default";
    const config =
      recipeTypeConfig[type] || recipeTypeConfig.default;

    // Utiliser la description ou générer un sous-titre
    const subtitle =
      recipe.description ||
      recipe.generatingFact ||
      `${recipe.recipeType || "Déclaration"} - ${recipe.entity?.name || ""}`;

    return {
      id: recipe.id,
      title: recipe.name,
      subtitle: subtitle.length > 80 ? `${subtitle.substring(0, 80)}...` : subtitle,
      icon: config.icon,
      accentBg: config.accentBg,
      accentText: config.accentText,
      accentBorder: config.accentBorder,
      recipeId: recipe.id,
    };
  });

  // Combiner les recipes avec les actions statiques
  return [...recipeActions, ...staticActions];
}

