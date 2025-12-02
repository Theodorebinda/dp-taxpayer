"use client";

import personelInfo from "@/../public/images/personel-info-removebg-preview.png";
import infoSupl from "@/../public/images/info-supplementair.png";
import contactInfo from "@/../public/images/un-agent-du-centre-d-appels.jpg";
import identityInfo from "@/../public/images/passeport-and-electorCard.png";
export type SignupStep = {
  id: string;
  title: string;
  description: string;
  list?: string[];
  illustration: string;
  fields: string[];
};

export const signupSteps: SignupStep[] = [
  {
    id: "personal",
    title: "Informations personnelles",
    description: "Commençons par vos informations de base",
    list: [
      "Renseignez vos noms dans les champs respectifs.",
      "Renseignez votre sexe.",
      "Choisissez le type de votre catégorie.",
    ],
    illustration: personelInfo.src,
    fields: ["category", "firstName", "middleName", "lastName", "sex"],
  },
  {
    id: "contact",
    title: "Contact",
    description: "Comment pouvons-nous vous joindre ?",
    list: [
      "Renseignez votre numéro de téléphone. et votre adresse email valide",
      "Veuillez choisir un mot de passe sécurisé.",
    ],
    illustration: contactInfo.src,
    fields: ["mobile", "email", "password"],
  },
  {
    id: "additional",
    title: "Informations complémentaires",
    description: "Quelques détails supplémentaires",
    list: ["Renseignez vos informations complémentaires."],
    illustration: infoSupl.src,

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
    list: [
      "Veillez choisir le type de votre pièce d'identité.",
      "Renseignez le numéro de votre pièce d'identité.",
    ],
    illustration: identityInfo.src,
    fields: ["identityCard", "identityCardNumber"],
  },
];
