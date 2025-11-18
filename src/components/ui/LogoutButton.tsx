"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type LogoutButtonVariant = "primary" | "ghost" | "menu";

type LogoutButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  label?: string;
  loadingLabel?: string;
  variant?: LogoutButtonVariant;
  startIcon?: ReactNode;
  hideIcon?: boolean;
  onLoggedOut?: () => void;
  onBeforeLogout?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

const baseButtonClass =
  "inline-flex items-center gap-2 rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<LogoutButtonVariant, string> = {
  primary:
    "border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive hover:bg-destructive/20",
  ghost:
    "border border-transparent px-3 py-2 text-foreground hover:text-destructive hover:bg-foreground/5",
  menu: "w-full justify-start border-0 px-4 py-2 text-red-500 hover:bg-red-50",
};

export default function LogoutButton({
  label = "Se déconnecter",
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
  const renderedContent =
    typeof content === "string" || typeof content === "number" ? (
      <span>{content}</span>
    ) : (
      content
    );

  return (
    <button
      type="button"
      {...rest}
      onClick={handleClick}
      disabled={disabled || logoutLoading}
      className={clsx(baseButtonClass, variantStyles[variant], className)}
    >
      {!hideIcon && icon}
      {renderedContent}
    </button>
  );
}
