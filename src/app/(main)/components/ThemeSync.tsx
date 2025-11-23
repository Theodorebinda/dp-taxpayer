"use client";

import { useThemeMounted } from "@/hooks/useThemeMounted";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Composant qui synchronise le thème au niveau du layout
 * S'assure que le thème est correctement appliqué lors de la navigation
 * Cela évite les problèmes de style lors du passage d'une page à une autre
 *
 * Le ThemeProvider de next-themes gère déjà la classe 'dark' sur le document,
 * mais lors de la navigation, il peut y avoir un délai avant que le thème ne soit
 * correctement synchronisé. Ce composant force la synchronisation.
 */
export function ThemeSync({ children }: { children: React.ReactNode }) {
  const { isMounted } = useThemeMounted();
  const { resolvedTheme, theme } = useTheme();
  const pathname = usePathname();

  // Synchroniser le thème lors de la navigation
  useEffect(() => {
    if (!isMounted || !resolvedTheme) return;

    const html = document.documentElement;

    // Force la synchronisation de la classe 'dark' avec le thème résolu
    if (resolvedTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isMounted, resolvedTheme, pathname, theme]);

  // Ne pas bloquer le rendu, mais s'assurer que le thème est synchronisé
  return <>{children}</>;
}
