import { MENU_ITEMS } from "@/assets/data/menu-items";
import { MenuItemType } from "@/types/menu";

export const getMenuItems = (): MenuItemType[] => {
  return MENU_ITEMS;
};

export const findMenuItem = (
  menuItems: MenuItemType[] | undefined,
  menuItemKey: MenuItemType["key"] | undefined
): MenuItemType | null => {
  if (!menuItems || !menuItemKey) return null;
  for (const item of menuItems) {
    if (item.key === menuItemKey) {
      return item;
    }
    const found = findMenuItem(item.children, menuItemKey);
    if (found) return found;
  }
  return null;
};

export const findAllParent = (
  menuItems: MenuItemType[],
  menuItem: MenuItemType
): string[] => {
  let parents: string[] = [];
  const parent = findMenuItem(menuItems, menuItem.parentKey);
  if (parent) {
    parents.push(parent.key);
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)];
    }
  }
  return parents;
};

export const getMenuItemFromURL = (
  items: MenuItemType | MenuItemType[],
  url: string
): MenuItemType | undefined => {
  if (Array.isArray(items)) {
    for (const item of items) {
      const found = getMenuItemFromURL(item, url);
      if (found) return found;
    }
    return undefined;
  }

  if (items.url === url) return items;
  if (items.children) {
    for (const child of items.children) {
      if (child.url === url) return child;
      const deep = getMenuItemFromURL(child, url);
      if (deep) return deep;
    }
  }
  return undefined;
};
