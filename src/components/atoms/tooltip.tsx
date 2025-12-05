"use client";

import React, { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export type TooltipTrigger = "hover" | "click" | "both";

export interface TooltipProps {
  /**
   * Le contenu à afficher dans le tooltip
   */
  content: ReactNode | string;
  /**
   * L'élément qui déclenche le tooltip (icône, bouton, etc.)
   */
  children: ReactNode;
  /**
   * Position du tooltip par rapport au trigger
   * @default "top"
   */
  position?: TooltipPosition;
  /**
   * Comment le tooltip est déclenché
   * @default "hover"
   */
  trigger?: TooltipTrigger;
  /**
   * Largeur minimale du tooltip
   * @default "auto"
   */
  minWidth?: string;
  /**
   * Largeur maximale du tooltip
   * @default "auto"
   */
  maxWidth?: string;
  /**
   * Classe CSS personnalisée pour le tooltip
   */
  className?: string;
  /**
   * Classe CSS personnalisée pour le conteneur
   */
  containerClassName?: string;
  /**
   * Délai avant l'affichage (en ms) - uniquement pour hover
   * @default 0
   */
  delay?: number;
  /**
   * Désactiver le tooltip
   * @default false
   */
  disabled?: boolean;
  /**
   * Afficher une flèche pointant vers le trigger
   * @default true
   */
  showArrow?: boolean;
  /**
   * Variante de style (dark/light)
   * @default "dark"
   */
  variant?: "dark" | "light";
}

/**
 * Composant Tooltip réutilisable et flexible
 *
 * @example
 * // Tooltip simple avec hover
 * <Tooltip content="Texte d'aide">
 *   <HelpCircle size={18} />
 * </Tooltip>
 *
 * @example
 * // Tooltip avec click
 * <Tooltip content="Cliquez pour plus d'infos" trigger="click">
 *   <button>Info</button>
 * </Tooltip>
 *
 * @example
 * // Tooltip personnalisé
 * <Tooltip
 *   content={<div>Contenu <strong>riche</strong></div>}
 *   position="bottom"
 *   variant="light"
 * >
 *   <CheckCircle2 size={18} />
 * </Tooltip>
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  trigger = "hover",
  minWidth = "auto",
  maxWidth = "auto",
  className = "",
  containerClassName = "",
  delay = 0,
  disabled = false,
  showArrow = true,
  variant = "dark",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  if (disabled) {
    return <>{children}</>;
  }

  const handleShow = () => {
    if (delay > 0 && trigger !== "click") {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
    } else {
      setIsVisible(true);
    }
  };

  const handleHide = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === "click" || trigger === "both") {
      setIsVisible(!isVisible);
    }
  };

  // Classes de position
  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // Classes de flèche selon la position
  const arrowClasses: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1",
    bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1",
  };

  // Direction de l'animation selon la position
  const getAnimationDirection = () => {
    switch (position) {
      case "top":
        return { y: -5 };
      case "bottom":
        return { y: 5 };
      case "left":
        return { x: -5 };
      case "right":
        return { x: 5 };
      default:
        return { y: -5 };
    }
  };

  // Styles selon la variante
  const variantStyles = {
    dark: "bg-gray-900 dark:bg-gray-800 text-white border-gray-700 dark:border-gray-600",
    light:
      "bg-white dark:bg-gray-100 text-gray-900 border-gray-200 dark:border-gray-300",
  };

  const arrowVariantStyles = {
    dark: "bg-gray-900 dark:bg-gray-800 border-gray-700 dark:border-gray-600",
    light: "bg-white dark:bg-gray-100 border-gray-200 dark:border-gray-300",
  };

  const animationDirection = getAnimationDirection();

  return (
    <div className={`relative inline-flex items-center ${containerClassName}`}>
      <div
        onMouseEnter={
          trigger === "hover" || trigger === "both" ? handleShow : undefined
        }
        onMouseLeave={
          trigger === "hover" || trigger === "both" ? handleHide : undefined
        }
        onClick={handleClick}
        className="inline-flex items-center"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, ...animationDirection, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, ...animationDirection, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses[position]} ${variantStyles[variant]} text-xs rounded-lg shadow-lg border px-3 py-2 ${className}`}
            style={{
              minWidth,
              maxWidth: maxWidth === "auto" ? "max-content" : maxWidth,
              whiteSpace:
                typeof content === "string" && content.includes("\n")
                  ? "pre-wrap"
                  : typeof content === "string"
                  ? "nowrap"
                  : "normal",
            }}
            onMouseEnter={
              trigger === "hover" || trigger === "both" ? handleShow : undefined
            }
            onMouseLeave={
              trigger === "hover" || trigger === "both" ? handleHide : undefined
            }
          >
            <div className="text-center">
              {typeof content === "string" ? (
                <p className="font-medium whitespace-pre-wrap">{content}</p>
              ) : (
                content
              )}
            </div>

            {/* Flèche pointant vers le trigger */}
            {showArrow && (
              <div className={`absolute ${arrowClasses[position]}`}>
                <div
                  className={`w-2 h-2 ${arrowVariantStyles[variant]} border-r border-b rotate-45`}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
