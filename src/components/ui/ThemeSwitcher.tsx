"use client";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
      aria-label="Basculer le thème"
      className="inline-flex items-center justify-center rounded-md border border-foreground/10 bg-background/60 px-2.5 py-1.5 hover:bg-background/80 transition"
    >
      <motion.span
        initial={{ rotate: -90, opacity: 0, scale: 0.85 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.95, rotate: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className="inline-flex"
      >
        <Sun className="h-4 w-4 text-foreground hidden dark:inline" />
        <Moon className="h-4 w-4 text-foreground inline dark:hidden" />
      </motion.span>
    </button>
  );
}
