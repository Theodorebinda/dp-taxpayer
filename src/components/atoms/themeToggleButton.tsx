"use client";
import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useThemeMounted } from "@/hooks/useThemeMounted";

const ThemeToggleButton = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { isMounted } = useThemeMounted();

  const toggleTheme = () => {
    if (!isMounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDarkMode = isMounted && resolvedTheme === "dark";

  // Utiliser une valeur par défaut pour éviter l'hydratation mismatch
  // Si le thème n'est pas encore monté, utiliser une valeur conservatrice (light)
  const translateClass = !isMounted
    ? "translate-x-0"
    : isDarkMode
    ? pathname.startsWith("/auth")
      ? "translate-x-9"
      : "translate-x-4"
    : "translate-x-0";

  return (
    <div
      className={`w-12 h-8 flex items-center rounded-full p-1 cursor-pointer duration-300 bg-primary/90 text-white ${className}`}
      onClick={toggleTheme}
    >
      <div
        className={`w-7 h-7 bg-foreground rounded-full shadow-md transform p-1 transition-transform duration-300 flex items-center justify-center ${translateClass}`}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </div>
    </div>
  );
};

export default ThemeToggleButton;
