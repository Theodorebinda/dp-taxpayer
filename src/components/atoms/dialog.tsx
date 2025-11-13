import React from "react";
import Button from "../commons/button";
import { LucideAlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-background shadow-lg">
        <div className="p-4 border-b border-foreground">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="p-10 flex flex-col items-center gap-5">
          <span>
            {" "}
            <LucideAlertTriangle size={40} color="red"/>{" "}
          </span>
          <p className="text-red-500 text-center text-xl">{message}</p>
        </div>
        <div className="flex justify-end gap-4 p-4 border-t border-foreground">
          <Button onClick={onCancel}>Annuler</Button>
          <Button
            variant="outline"
            className="!border-red-500 !text-red-500 hover:bg-red-500 hover:!text-background"
            onClick={onConfirm}
          >
            Valider
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
