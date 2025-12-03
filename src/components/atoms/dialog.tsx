"use client";

import React, { ReactNode, useEffect } from "react";
import Button from "../commons/button";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  AlertCircle,
} from "lucide-react";

/**
 * Dialog - Composant de dialogue universel et flexible
 * Peut être utilisé pour : confirmations, modals génériques, alertes, etc.
 */

export type DialogVariant =
  | "default"
  | "confirm"
  | "alert"
  | "success"
  | "info"
  | "warning";
export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  size?: DialogSize;
  variant?: DialogVariant;
  // Pour les dialogs de confirmation
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  // Options
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  // Actions personnalisées (footer)
  footer?: ReactNode;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-7xl",
};

const variantIcons: Record<DialogVariant, ReactNode> = {
  default: null,
  confirm: <AlertTriangle className="w-6 h-6 text-amber-500" />,
  alert: <AlertCircle className="w-6 h-6 text-red-500" />,
  success: <CheckCircle2 className="w-6 h-6 text-green-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
  warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
};

const variantStyles: Record<DialogVariant, string> = {
  default: "",
  confirm: "border-l-4 border-amber-500",
  alert: "border-l-4 border-red-500",
  success: "border-l-4 border-green-500",
  info: "border-l-4 border-blue-500",
  warning: "border-l-4 border-amber-500",
};

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "default",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
}) => {
  // Gestion de la touche Escape
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Empêcher le scroll du body quand le dialog est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Mode confirmation (avec message)
  const isConfirmMode = variant === "confirm" || (message && onConfirm);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "dialog-title" : undefined}
    >
      <div
        className={`relative flex flex-col bg-background rounded-lg shadow-xl ${sizeClasses[size]} w-[90%] max-h-[90vh] overflow-hidden ${variantStyles[variant]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2
                id="dialog-title"
                className="text-lg font-semibold text-foreground flex items-center gap-2"
              >
                {variant !== "default" && variantIcons[variant]}
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 min-w-0 h-8 w-8 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isConfirmMode && message ? (
            <div className="flex flex-col items-center gap-4 text-center">
              {variantIcons[variant] && (
                <div className="shrink-0">{variantIcons[variant]}</div>
              )}
              <p className="text-base text-foreground">{message}</p>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer || (isConfirmMode && onConfirm) ? (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
            {footer ? (
              footer
            ) : (
              <>
                <Button onClick={handleCancel} variant="secondary">
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant={variant === "alert" ? "destructive" : "primary"}
                >
                  {confirmText}
                </Button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dialog;
