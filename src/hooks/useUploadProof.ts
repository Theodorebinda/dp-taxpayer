import { useApiMutation } from "./useApi";
import { apiClient } from "@/lib/api/client";

/**
 * Hook TanStack Query pour uploader une preuve de paiement
 */

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object") {
    const r = res as { data?: unknown };
    if (typeof r.data !== "undefined") {
      const inner = r.data as { data?: unknown };
      if (inner && typeof inner === "object" && "data" in inner) {
        return (inner as { data: T }).data as T;
      }
      return r.data as T;
    }
  }
  return res as T;
}

export interface UploadProofPayload {
  file: File;
  reference: string;
  notes?: string;
  operationId?: string;
}

export interface UploadProofResponse {
  success: boolean;
  proofId?: string;
  message?: string;
}

export function useUploadProof() {
  return useApiMutation<UploadProofPayload, UploadProofResponse>(
    async (payload) => {
      // Créer FormData pour l'upload de fichier
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("reference", payload.reference);
      if (payload.notes) {
        formData.append("notes", payload.notes);
      }
      if (payload.operationId) {
        formData.append("operationId", payload.operationId);
      }

      // TODO: Remplacer par l'endpoint réel de l'API
      const response = await apiClient.post<UploadProofResponse>(
        "/payments/upload-proof",
        formData
      );

      if (!response) {
        throw new Error("Échec de l'upload de la preuve de paiement");
      }

      return unwrapData<UploadProofResponse>(response);
    },
    {
      retry: 1,
    }
  );
}
