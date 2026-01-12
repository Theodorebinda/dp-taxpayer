"use client";
import { toast } from "react-hot-toast";

export type ToastOptions = {
  id?: string;
};

export function useToast() {
  return {
    success: (message: string, options?: ToastOptions) =>
      toast.success(message, options),
    error: (message: string, options?: ToastOptions) =>
      toast.error(message, options),
    info: (message: string, options?: ToastOptions) => toast(message, options),
    dismiss: (id?: string) => (id ? toast.dismiss(id) : toast.dismiss()),
  };
}
