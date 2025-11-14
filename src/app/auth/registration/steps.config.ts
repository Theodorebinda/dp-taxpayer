"use client";

import banner from "@/../public/images/banner.webp";
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
    illustration: banner.src,
    fields: ["category", "firstName", "middleName", "lastName", "sex"],
  },
  {
    id: "contact",
    title: "Contact",
    description: "Comment pouvons-nous vous joindre ?",
    illustration: banner.src,
    fields: ["mobile", "email", "password"],
  },
  {
    id: "additional",
    title: "Informations complémentaires",
    description: "Quelques détails supplémentaires",
    illustration: banner.src,
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
    illustration: banner.src,
    fields: ["identityCard", "identityCardNumber"],
  },
];
