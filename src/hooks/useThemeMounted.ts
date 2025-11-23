"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Hook personnalisé pour gérer l'état de montage du thème
 * Résout le problème de synchronisation du thème entre les pages
 *
 * @returns { isMounted: boolean, isDarkTheme: boolean, resolvedTheme: string | undefined }
 */
export function useThemeMounted() {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Utilise requestAnimationFrame pour s'assurer que le DOM est prêt
    // et que le thème est résolu par next-themes
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const isDarkTheme = isMounted && resolvedTheme === "dark";

  return {
    isMounted,
    isDarkTheme,
    resolvedTheme,
  };
}
