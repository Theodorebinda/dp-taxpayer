// components/FormattedText.tsx
import React, { JSX } from "react";

interface FormattedTextProps {
  text: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  // Définition des motifs de formatage et leurs styles
  const formatRules = [
    {
      pattern: /\*\*([^*]+)\*\*/g, // Gras avec *
      replacer: (match: string, content: string) => (
        <strong key={match + content} className="font-bold">
          {content}
        </strong>
      ),
    },
    {
      pattern: /`([^`]+)`/g, // Code avec `
      replacer: (match: string, content: string) => (
        <code
          key={match + content}
          className="font-mono bg-bg-secondary text-forebackground p-1.5 px-1 rounded"
        >
          {content}
        </code>
      ),
    },
    {
      pattern: /--([^--]+)--/g, // Italique avec --
      replacer: (match: string, content: string) => (
        <em key={match + content} className="italic">
          {content}
        </em>
      ),
    },
    // Ajoutez d'autres règles ici si besoin
  ];

  // Fonction pour parser et formater le texte
  const parseText = (input: string): (string | JSX.Element)[] => {
    const elements: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    // Trouver toutes les correspondances pour tous les motifs
    const matches: {
      start: number;
      end: number;
      match: string;
      content: string;
      replacer: any;
    }[] = [];

    formatRules.forEach((rule) => {
      let match;
      while ((match = rule.pattern.exec(input)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          match: match[0],
          content: match[1],
          replacer: rule.replacer,
        });
      }
    });

    // Trier les correspondances par position pour les traiter dans l'ordre
    matches.sort((a, b) => a.start - b.start);

    // Traiter chaque correspondance
    matches.forEach(({ start, end, match, content, replacer }) => {
      if (start > lastIndex) {
        // Ajouter le texte non formaté avant la correspondance
        elements.push(input.slice(lastIndex, start));
      }
      // Ajouter l'élément formaté
      elements.push(replacer(match, content));
      lastIndex = end;
    });

    // Ajouter le texte restant après la dernière correspondance
    if (lastIndex < input.length) {
      elements.push(input.slice(lastIndex));
    }

    return elements.length > 0 ? elements : [input];
  };

  return <span>{parseText(text)}</span>;
};

export default FormattedText;
