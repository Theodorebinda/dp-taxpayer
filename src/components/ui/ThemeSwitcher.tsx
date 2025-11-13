"use client";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();
  const isClient = typeof window !== "undefined";
  if (!isClient) return null;
  const current = theme === "system" ? systemTheme : theme;
  return (
    <button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      aria-label="Basculer le thème"
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 8,
        padding: "6px 10px",
        background: "transparent",
      }}
    >
      {current === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
