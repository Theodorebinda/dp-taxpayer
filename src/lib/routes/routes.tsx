"use client";

import { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  Users,
} from "lucide-react";
import { ReactNode } from "react";

export type DashboardRoute = {
  id: string;
  label: string;
  segment: string;
  icon: LucideIcon;
  component: ReactNode;
  children?: DashboardRoute[];
};

export const dashboardRoutes: DashboardRoute[] = [
  {
    id: "home",
    label: "Tableau de Bord",
    segment: "overview",
    icon: LayoutDashboard,
    component: null,
  },
  {
    id: "operations",
    label: "Opérations",
    segment: "operations",
    icon: FileSpreadsheet,
    component: null,
    children: [
      {
        id: "operations-declarations",
        label: "Déclarations",
        segment: "declarations",
        icon: FileSpreadsheet,
        component: null,
      },
      {
        id: "operations-payments",
        label: "Paiements",
        segment: "payments",
        icon: FileSpreadsheet,
        component: null,
      },
    ],
  },
  {
    id: "users",
    label: "Utilisateurs",
    segment: "users",
    icon: Users,
    component: null,
  },
  {
    id: "settings",
    label: "Paramètres",
    segment: "settings",
    icon: Settings,
    component: null,
  },
];
