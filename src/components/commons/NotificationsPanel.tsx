"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

// Fonction pour formater la date relative
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "à l'instant";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? "s" : ""}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `il y a ${diffInMonths} mois`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `il y a ${diffInYears} an${diffInYears > 1 ? "s" : ""}`;
};

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read?: boolean;
  actionUrl?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Paiement reçu",
    message: "Votre paiement de 50,000 CDF a été confirmé avec succès.",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // Il y a 5 minutes
    read: false,
  },
  {
    id: "2",
    title: "Déclaration en attente",
    message: "Votre déclaration d'impôt foncier est en cours de traitement.",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // Il y a 30 minutes
    read: false,
  },
  {
    id: "3",
    title: "Rappel de paiement",
    message: "N'oubliez pas de régler votre impôt avant le 31 décembre.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2 heures
    read: true,
  },
  {
    id: "4",
    title: "Rappel de paiement",
    message: "N'oubliez pas de régler votre impôt avant le 31 décembre.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2 heures
    read: true,
  },
  {
    id: "5",
    title: "Rappel de paiement",
    message: "N'oubliez pas de régler votre impôt avant le 31 décembre.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2 heures
    read: true,
  },
  {
    id: "6",
    title: "Rappel de paiement",
    message: "N'oubliez pas de régler votre impôt avant le 31 décembre.",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2 heures
    read: true,
  },
];

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  notifications = mockNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Fermer quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Empêcher le scroll du body quand le panel est ouvert
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "border-l-green-500 bg-green-50/50 dark:bg-green-950/20";
      case "warning":
        return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
      case "error":
        return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
      default:
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 md:right-6 md:top-20 w-[90vw] md:w-96 max-w-md bg-background border border-border rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center md:gap-2 gap-1">
                <Bell className="h-5 w-5 text-foreground" />
                <h3 className="font-semibold text-foreground md:text-lg text-md">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-1.5">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Tout marquer comme lu
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Aucune notification
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-l-4 ${getTypeStyles(
                        notification.type
                      )} hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-muted/30" : ""
                      }`}
                      onClick={() => {
                        if (!notification.read && onMarkAsRead) {
                          onMarkAsRead(notification.id);
                        }
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                        onClose();
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm text-foreground">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-2">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
