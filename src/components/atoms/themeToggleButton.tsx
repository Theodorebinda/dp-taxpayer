"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const THEME_KEY = "theme";

const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = html.classList.contains("dark") ? "light" : "dark";
    html.classList.toggle("dark");
    localStorage.setItem(THEME_KEY, newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  return (
    <div
      className="w-21 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 bg-background "
      onClick={toggleTheme}
    >
      <div
        className={`w-6 h-6 bg-foreground rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDarkMode
            ? pathname.startsWith("/auth")
              ? "translate-x-9"
              : "translate-x-13"
            : "translate-x-0"
        }`}
      >
        {isDarkMode ? "🌙" : "☀️"}
      </div>
    </div>
  );
};

export default ThemeToggleButton;
