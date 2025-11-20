/**
 * Types de déclarations disponibles dans l'application
 */
export type DeclarationType =
  | "ispf" // Impôt synthétique professionnel forfaitaire
  | "irl" // Revenus locatifs
  | "retenue-locative" // Retenue locative
  | "retenue-source" // Retenue à la source
  | "nouvelle-declaration" // Nouvelle déclaration générique
  | "document"; // Document

export type DeclarationTypeConfig = {
  type: DeclarationType;
  title: string;
  description: string;
  endpoint: string;
};

export const DECLARATION_TYPES: Record<DeclarationType, DeclarationTypeConfig> =
  {
    ispf: {
      type: "ispf",
      title: "Déclarer ISPF",
      description: "Impôt synthétique professionnel forfaitaire",
      endpoint: "/declarations/ispf/form",
    },
    irl: {
      type: "irl",
      title: "Déclarer IRL",
      description: "Revenus locatifs",
      endpoint: "/declarations/irl/form",
    },
    "retenue-locative": {
      type: "retenue-locative",
      title: "Retenue locative",
      description: "Déclarer vos retenues sur loyers",
      endpoint: "/declarations/retenue-locative/form",
    },
    "retenue-source": {
      type: "retenue-source",
      title: "Retenue à la source",
      description: "Gestion des retenues sur salaires",
      endpoint: "/declarations/retenue-source/form",
    },
    "nouvelle-declaration": {
      type: "nouvelle-declaration",
      title: "Nouvelle déclaration",
      description: "Démarrer un nouveau parcours guidé",
      endpoint: "/declarations/new/form",
    },
    document: {
      type: "document",
      title: "Mes documents",
      description: "Consulter vos pièces justificatives",
      endpoint: "/documents/form",
    },
  };
