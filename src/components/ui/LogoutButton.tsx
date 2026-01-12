"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type LogoutButtonVariant = "primary" | "ghost" | "menu";

interface LogoutButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  label?: string;
  loadingLabel?: string;
  variant?: LogoutButtonVariant;
  startIcon?: ReactNode;
  hideIcon?: boolean;
  onLoggedOut?: () => void;
  onBeforeLogout?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

const baseButtonClass =
  "inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

const variantStyles: Record<LogoutButtonVariant, string> = {
  primary:
    "border border-red-300 bg-red-50 text-red-600 px-3 py-2 hover:bg-primary/10",
  ghost: "px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10",
  menu: "w-full justify-start px-4 py-2 text-primary hover:bg-primary/10",
};

export default function LogoutButton({
  label = "",
  loadingLabel = "Déconnexion...",
  variant = "primary",
  className,
  startIcon,
  hideIcon = false,
  disabled,
  onLoggedOut,
  onBeforeLogout,
  children,
  ...rest
}: LogoutButtonProps) {
  const { logout, logoutLoading } = useAuth();

  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    onBeforeLogout?.(event);
    if (event.defaultPrevented) return;

    if (disabled || logoutLoading) return;

    await logout();
    onLoggedOut?.();
  }

  const icon = logoutLoading ? (
    <Loader2 className="size-4 animate-spin" />
  ) : (
    startIcon ?? <LogOut className="size-4" />
  );

  const content = children ?? (logoutLoading ? loadingLabel : label);

  return (
    <button
      type="button"
      {...rest}
      onClick={handleClick}
      aria-busy={logoutLoading}
      disabled={disabled || logoutLoading}
      className={clsx(baseButtonClass, variantStyles[variant], className)}
    >
      {!hideIcon && icon}
      {typeof content === "string" || typeof content === "number" ? (
        <span>{content}</span>
      ) : (
        content
      )}
    </button>
  );
}
