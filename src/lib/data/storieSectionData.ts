import mainInput from "@/../public/images/main-input.webp";
import banner from "@/../public/images/banner.webp";
import { StorySection } from "@/types/story-section.type";

export const storySections: StorySection[] = [
  {
    id: "s1",
    title: "Une suite fiscale unifiée",
    description:
      "Réduisez vos déplacements, gagnez du temps et gérez toutes vos formalités fiscales sur une seule plateforme moderne.",
    image: mainInput.src,
    imageAlt: "Une suite fiscale unifiée",
    badges: ["Centralisé", "Simple", "Optimisé"],

    steps: [
      { icon: "check", title: "Créer votre compte" },
      { icon: "check", title: "Enregistrer vos biens" },
      { icon: "check", title: "Suivre vos taxes" },
    ],
    cta: {
      label: "Créer votre compte",
      href: "/auth/register",
    },
  },
  {
    id: "s2",
    title: "Paiement sécurisé",
    description:
      "Acceptez les paiements et suivez les transactions en temps réel depuis un tableau de bord simple.",
    image: banner.src,
    badges: ["Temps réel", "Sécurisé", "Automatisé"],
    cta: {
      label: "Découvrir Payments ",
      href: "/payment",
    },
    highlight: true,
    theme: "auto",
  },
  {
    id: "s3",
    title: "Suivi des taxes",
    description:
      "Suivez vos taxes et gérez vos échéances de paiement en toute simplicité.",
    image: banner.src,
    imageAlt: "Suivi des taxes",
    badges: ["Automatisé", "Simple", "Optimisé"],
    steps: [
      { icon: "check", title: "Créer votre compte" },
      { icon: "check", title: "Enregistrer vos biens" },
      { icon: "check", title: "Suivre vos taxes" },
    ],
    stats: [
      { label: "Taxes payées", value: 1000 },
      { label: "Taxes à payer", value: 2000 },
      { label: "Taxes déclarées", value: 3000 },
    ],
    cta: {
      label: "Suivre vos taxes",
      href: "/taxes",
    },
    highlight: true,
    theme: "auto",
  },
];
