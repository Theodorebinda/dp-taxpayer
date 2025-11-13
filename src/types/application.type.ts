export type ApplicationType = {
  id: string;
  icon: string;
  name: string;
  verbose: string;
  description: string;
  externalUrl: null;
  isExternal: boolean;
  isActive: boolean;
  backgroundImageUrl: string;
  menus: SideMenuType[];
};

export type SideMenuType = {
  id: string;
  icon: string;
  name: string;
  path: null | string;
  menuActions: {
    id: string;
    action: {
      id: string;
      name: string;
      path: string;
      method: string;
    };
  }[];
};
