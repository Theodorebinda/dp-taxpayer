import { MenuItemType } from "@/types/menu";

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: "menu-title",
    label: "MENU",
    isTitle: true,
  },
  {
    key: "overview",
    label: "Tableau de Bord",
    icon: "ri:dashboard-2-line",
    url: "/dashboard/overview",
  },
  {
    key: "operations",
    label: "Opérations",
    icon: "ri:dashboard-line",
    url: "/dashboard/operations",
    children: [
      {
        key: "operations-declarations",
        label: "Déclarations",
        parentKey: "operations",
        url: "/dashboard/operations/declarations",
        icon: "ri:file-list-line",
      },
      {
        key: "operations-payments",
        label: "Paiements",
        parentKey: "operations",
        url: "/dashboard/operations/payments",
        icon: "ri:bank-card-line",
      },
    ],
  },
  {
    key: "profil",
    label: "Profil",
    icon: "ri:group-line",
    url: "/dashboard/profil",
  },
  {
    key: "settings",
    label: "Paramètres",
    icon: "ri:settings-3-line",
    url: "/dashboard/settings",
  },
];
