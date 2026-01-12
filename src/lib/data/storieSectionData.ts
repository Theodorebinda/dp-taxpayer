import registration from "@/../public/images/declarationTax.jpg";
import paiement from "@/../public/images/paiement-image.jpg";
import suivie from "@/../public/images/suivi-de-tax.jpg";
import { StorySection } from "@/types/story-section.type";

export const storySections: StorySection[] = [
  {
    id: "s1",
    title: "Une suite fiscale unifiée",
    description:
      "Réduisez vos déplacements, gagnez du temps et gérez toutes vos formalités fiscales sur une seule plateforme moderne.",
    image: registration.src,
    imageAlt: "Une suite fiscale unifiée",
    badges: ["Centralisé", "Simple", "Optimisé"],

    steps: [
      { icon: "check", title: "Créer votre compte" },
      { icon: "check", title: "Enregistrer vos biens" },
      { icon: "check", title: "Suivre vos taxes" },
    ],
    cta: {
      label: "Déclarer mes taxes",
      href: "/auth/register",
    },
  },
  {
    id: "s2",
    title: "Paiement sécurisé",
    description:
      "Payez vos taxes en toute simplicité et suivez toutes vos transactions en temps réel depuis votre tableau de bord.",
    image: paiement.src,
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
    image: suivie.src,
    imageAlt: "Suivi des taxes",
    badges: ["Automatisé", "Simple", "Optimisé"],
    steps: [
      { icon: "check", title: "Tableau de bord dynamique et simple" },
      { icon: "check", title: "Notifications et alertes" },
      { icon: "check", title: "Accès à toutes vos transactions" },
      { icon: "check", title: "Gestion des échéances" },
    ],
    cta: {
      label: "Suivre vos taxes",
      href: "/taxes",
    },
    highlight: true,
    theme: "auto",
  },
];
