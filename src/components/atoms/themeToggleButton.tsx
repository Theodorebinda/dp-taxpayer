"use client";
import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const THEME_KEY = "theme";

function resolveInitialTheme(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined")
    return false;
  const savedTheme = window.localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  document.documentElement.classList.toggle("dark", shouldUseDark);
  return shouldUseDark;
}

const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(resolveInitialTheme);
  const pathname = usePathname();

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = html.classList.contains("dark") ? "light" : "dark";
    html.classList.toggle("dark");
    localStorage.setItem(THEME_KEY, newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  return (
    <div
      className="w-14 h-8 flex items-center rounded-full p-1 cursor-pointer  duration-300 bg-primary/90 text-white"
      onClick={toggleTheme}
    >
      <div
        className={`w-7 h-7 bg-foreground rounded-full shadow-md transform p-1 transition-transform duration-300 flex items-center justify-center ${
          isDarkMode
            ? pathname.startsWith("/auth")
              ? "translate-x-9"
              : "translate-x-4"
            : "translate-x-0"
        }`}
      >
        {isDarkMode ? <Sun /> : <Moon />}
      </div>
    </div>
  );
};

export default ThemeToggleButton;
