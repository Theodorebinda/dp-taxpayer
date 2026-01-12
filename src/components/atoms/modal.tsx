"use client";

import React, { ReactNode, useEffect } from "react";
import Button from "../commons/button";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute w-screen top-0 left-0 h-screen z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/30 dark:bg-opacity-40 bg-opacity-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`flex z-20 flex-col bg-background rounded-lg shadow-lg w-[90%] lg:max-w-[60%] md:min-w-[30%] lg:max-md:w-[90%] mx-4 max-h-[90vh] overflow-y-auto p-5`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <Button
          onClick={onClose}
          variant="secondary"
          className="flex !justify-end !border-none !bg-transparent hover:!bg-transparent hover:!text-foreground"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
        {title && (
          <div className="p-4 border-b border-gray-200">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
          </div>
        )}

        <div className="p-4 h-full overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
