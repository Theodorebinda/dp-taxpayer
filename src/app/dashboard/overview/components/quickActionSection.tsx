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

type QuickAction = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  disabled?: boolean;
};

export const quickActions: QuickAction[] = [
  {
    title: "Déclarer ISPF",
    subtitle: "Impôt synthétique professionnel forfaitaire",
    icon: FilePenLine,
    accentBg: "bg-gradient-to-br from-[#fff7ed] to-[#ffedd5]",
    accentText: "text-[#9a3412]",
    accentBorder: "border-[#9a3412]/40",
  },
  {
    title: "Nouvelle déclaration",
    subtitle: "Démarrer un nouveau parcours guidé",
    icon: PlusCircle,
    accentBg: "bg-gradient-to-br from-[#e0f2fe] to-[#dbeafe]",
    accentText: "text-[#075985]",
    accentBorder: "border-[#0ea5e9]/40",
  },
  {
    title: "Déclarer IRL",
    subtitle: "Revenus locatifs",
    icon: Building2,
    accentBg: "bg-gradient-to-br from-[#ecfccb] to-[#d9f99d]",
    accentText: "text-[#166534]",
    accentBorder: "border-[#16a34a]/40",
  },
  {
    title: "Retenue locative",
    subtitle: "Déclarer vos retenues sur loyers",
    icon: FileSpreadsheet,
    accentBg: "bg-gradient-to-br from-[#ede9fe] to-[#ddd6fe]",
    accentText: "text-[#5b21b6]",
    accentBorder: "border-[#7c3aed]/40",
  },
  {
    title: "Retenue à la source",
    subtitle: "Gestion des retenues sur salaires",
    icon: ShieldCheck,
    accentBg: "bg-gradient-to-br from-[#fee2e2] to-[#fecaca]",
    accentText: "text-[#991b1b]",
    accentBorder: "border-[#ef4444]/40",
  },
  {
    title: "Mes documents",
    subtitle: "Consulter vos pièces justificatives",
    icon: FolderOpen,
    accentBg: "bg-gradient-to-br from-[#f3e8ff] to-[#f5f3ff]",
    accentText: "text-[#7e22ce]",
    accentBorder: "border-[#a855f7]/40",
  },
  {
    title: "Bientôt disponible",
    subtitle: "Nouveaux services en préparation",
    icon: Sparkles,
    accentBg: "bg-muted/40",
    accentText: "text-muted-foreground",
    accentBorder: "border-border/40",
    disabled: true,
  },
  {
    title: "Paiements",
    subtitle: "Voir l'historique de vos paiements",
    icon: CreditCard,
    accentBg: "bg-gradient-to-br from-[#cffafe] to-[#e0f2fe]",
    accentText: "text-[#0f766e]",
    accentBorder: "border-[#0d9488]/40",
  },
];
