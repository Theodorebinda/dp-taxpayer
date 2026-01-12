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
    url: "/list/overview",
  },
  {
    key: "operations",
    label: "Opérations",
    icon: "ri:dashboard-line",
    children: [
      {
        key: "operations-declarations",
        label: "Déclarations",
        parentKey: "operations",
        url: "/list/operations/declarations",
        icon: "ri:file-list-line",
      },
      {
        key: "operations-payments",
        label: "Paiements",
        parentKey: "operations",
        url: "/list/operations/payments",
        icon: "ri:bank-card-line",
      },
    ],
  },
  {
    key: "profil",
    label: "Profil",
    icon: "ri:group-line",
    url: "/list/profil",
  },
  {
    key: "settings",
    label: "Paramètres",
    icon: "ri:settings-3-line",
    url: "/list/settings",
  },
];
