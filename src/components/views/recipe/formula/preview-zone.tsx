import { KeyboardEvent, useState } from "react";
import { FormulaItem } from "./types";
import { Droppable } from "@hello-pangea/dnd";
import { FormulaItemComponent } from "./utils";
import { Trash2 } from "lucide-react";
// import { MathJax } from "better-react-mathjax";
import HttpClient from "@/utils/http-client";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/commons/button";

export const FormulaZone: React.FC<{
  items: FormulaItem[];
  onClear: () => void;
  onRemoveItem: (index: number) => void;
  onFunctionClick: (index: number, item: FormulaItem) => void;
  onAddNumber: (e: KeyboardEvent<HTMLInputElement>) => void;
}> = ({ items, onClear, onRemoveItem, onFunctionClick, onAddNumber }) => (
  <Droppable droppableId="formulaZone" direction="horizontal">
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={`rounded-2xl p-8 border-2 transition-all ${
          snapshot.isDraggingOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-primary/20"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <h3 className="font-bold text-xl text-foreground">
              Configurez votre formule
            </h3>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Effacer tout
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="w-full text-center py-8 text-muted-foreground">
            Glissez des éléments ici pour construire votre formule
          </div>
        ) : (
          items.map((item, i) => (
            <FormulaItemComponent
              key={`formula-${i}`}
              item={item}
              index={i}
              onRemove={onRemoveItem}
              onFunctionClick={onFunctionClick}
            />
          ))
        )}

        <div className="mt-4">
          <label className="font-medium text-foreground mb-2 block">
            Ajouter une constante numérique
          </label>
          <input
            type="number"
            onKeyDown={onAddNumber}
            placeholder="Tapez un nombre et appuyez sur Entrée"
            className="w-full border-2 border-input bg-background rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Appuyez sur Entrée pour ajouter la constante à la formule
          </p>
        </div>

        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded text-sm transition-all font-normal"
    >
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
};

/**
 * Convertit une formule en notation LaTeX pour un rendu mathématique
 * @param items - Les éléments de la formule
 * @returns La formule au format LaTeX
 */
const convertToLatex = (items: FormulaItem[]): string => {
  let latex = "";
  let i = 0;

  while (i < items.length) {
    const item = items[i];

    if (item.type === "variable") {
      // Utilise le nom de la propriété en texte
      latex += `\\text{${item.property}}`;
    } else if (item.type === "operation") {
      if (item.op === "/") {
        // Détecte une division et crée une fraction
        // Récupère le numérateur (tout ce qui précède)
        const numeratorMatch = latex.match(/(.+)$/);
        const numerator = numeratorMatch ? numeratorMatch[1] : "";

        // Retire le numérateur du latex actuel
        latex = latex.slice(0, -numerator.length);

        // Récupère le dénominateur (l'élément suivant)
        i++;
        if (i < items.length) {
          const nextItem = items[i];
          let denominator = "";

          if (nextItem.type === "variable") {
            denominator = `\\text{${nextItem.property}}`;
          } else if (nextItem.type === "constant") {
            denominator = nextItem.value;
          } else if (nextItem.type === "operation" && nextItem.op === "(") {
            // Gère les expressions entre parenthèses
            denominator = "(";
            i++;
            let parenCount = 1;
            while (i < items.length && parenCount > 0) {
              const subItem = items[i];
              if (subItem.type === "operation") {
                if (subItem.op === "(") parenCount++;
                if (subItem.op === ")") parenCount--;
                denominator += subItem.op;
              } else if (subItem.type === "variable") {
                denominator += `\\text{${subItem.property}}`;
              } else if (subItem.type === "constant") {
                denominator += subItem.value;
              }
              i++;
            }
            i--; // Ajuste car la boucle while incrémente une fois de trop
          }

          // Crée la fraction LaTeX
          latex += `\\frac{${numerator}}{${denominator}}`;
        }
      } else if (item.op === "*") {
        latex += " \\times ";
      } else if (item.op === "^") {
        // Gestion des puissances
        const baseMatch = latex.match(/(.+)$/);
        const base = baseMatch ? baseMatch[1] : "";
        latex = latex.slice(0, -base.length);

        i++;
        if (i < items.length) {
          const nextItem = items[i];
          let exponent = "";
          if (nextItem.type === "constant") {
            exponent = nextItem.value;
          } else if (nextItem.type === "variable") {
            exponent = `\\text{${nextItem.property}}`;
          }
          latex += `{${base}}^{${exponent}}`;
        }
      } else {
        latex += ` ${item.op} `;
      }
    } else if (item.type === "constant") {
      latex += item.value;
    } else if (item.type === "function") {
      const args = Object.values(item.args || {}).join(", ");
      latex += `\\text{${item.name}}(${args})`;
    }

    i++;
  }

  return latex;
};

const TOAST_CONFIG = {
  position: "top-right" as const,
  duration: 5000,
  className: "p-5",
  style: {
    background: "#048996",
    color: "#fff",
  },
};

export const FormulaPreview: React.FC<{
  items: FormulaItem[];
  displayFormula: string;
  rawFormula: string;
  recipeId: string;
}> = ({ items, displayFormula, rawFormula, recipeId }) => {
  const latexFormula = convertToLatex(items);

  const submitForm = async () => {
    const client = new HttpClient();
    const response = await client.post(`/create/recipe/formula`, {
      items,
      displayFormula,
      rawFormula,
      recipeId,
      name: "Formule de calcule de la recette ",
      variables: items
        .filter((item) => "id" in item)
        .map((item) => ({ formFieldId: item.id }))
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.formFieldId === item.formFieldId)
        ),
    });

    if (!response) {
      toast.error(client.error?.message || "Erreur lors de la mise à jour");
      return;
    }
    toast.success(response.message);
  };

  return (
    <div className="mt-8 bg-card rounded-2xl hover:shadow-lg p-8 border-2 border-primary/20 space-y-5">
      <Toaster {...TOAST_CONFIG} />
      <h4 className="text-foreground font-bold text-lg ">
        Aperçu de la formule
      </h4>

      {/* Affichage mathématique avec LaTeX */}
      <div className="bg-muted/50 p-6 rounded-xl text-center w-full overflow-auto mb-6 bg-primary/10">
        <div className="text-xl">
          {/* <MathJax dynamic>{`\\[${rawFormula}\\]`}</MathJax> */}
        </div>
      </div>

      <details className="">
        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground transition-colors">
          Voir la formule simple
        </summary>
        <div className="bg-bg-secondary p-4 rounded-xl mt-2 text-center">
          {displayFormula}
        </div>
      </details>

      <h4 className="mt-6 font-bold text-lg flex justify-between">
        <span>Formule technique</span> <CopyButton text={latexFormula} />
      </h4>
      <pre className="bg-muted p-5 rounded-xl mt-2 flex justify-between items-start font-mono bg-bg-secondary overflow-auto">
        <code>{rawFormula}</code>
      </pre>
      <Button
        onClick={() => {
          submitForm();
        }}
      >
        Mettre à jour la formule de calcule
      </Button>
    </div>
  );
};
