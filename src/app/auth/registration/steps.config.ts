"use client";

export type SignupStep = {
  id: string;
  title: string;
  description: string;
  illustration: string;
  fields: string[];
};

export const signupSteps: SignupStep[] = [
  {
    id: "personal",
    title: "Informations personnelles",
    description: "Commençons par vos informations de base",
    illustration: "/public/images/main-input.webp",
    fields: ["category", "firstName", "middleName", "lastName", "sex"],
  },
  {
    id: "contact",
    title: "Contact",
    description: "Comment pouvons-nous vous joindre ?",
    illustration: "/public/images/main-input.webp",
    fields: ["mobile", "email", "password"],
  },
  {
    id: "additional",
    title: "Informations complémentaires",
    description: "Quelques détails supplémentaires",
    illustration: "/public/images/main-input.webp",
    fields: [
      "martialStatus",
      "birthDate",
      "birthPlace",
      "originEntityId",
      "physicalAddress",
      "currentEntityId",
    ],
  },
  {
    id: "identity",
    title: "Pièce d'identité",
    description: "Informations sur votre document d'identité",
    illustration: "/public/images/main-input.webp",
    fields: ["identityCard", "identityCardNumber"],
  },
];
