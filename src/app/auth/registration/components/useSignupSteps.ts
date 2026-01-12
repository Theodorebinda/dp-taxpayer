"use client";

import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { signupSteps } from "./steps.config";
import { ApiInputType } from "@/types/types";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { qk } from "@/utils/query-keys";
import {
  getRegistrationFields,
  registerTaxpayer,
  type RegistrationFieldsPayload,
} from "@/services/taxpayer.service";
import { useToast } from "@/hooks/useToast";

const EMPTY_FIELDS: ApiInputType[] = [];

export type SignupFormData = Record<string, unknown>;

type UseSignupStepsReturn = {
  currentStep: number;
  steps: typeof signupSteps;
  formData: SignupFormData;
  handleValueChange: (property: string, value: unknown) => void;
  isStepValid: () => boolean;
  goNext: () => void;
  goPrevious: () => void;
  submit: () => void;
  // extras for UI convenience
  currentFields: ApiInputType[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isSubmitting: boolean;
};

export function useSignupSteps(): UseSignupStepsReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignupFormData>({});
  const { success, error: showError } = useToast();
  const router = useRouter();
  const hydratedFormRef = useRef<string | null>(null);
  const shownMessageRef = useRef<string | null>(null);

  const {
    data: registrationPayload,
    isLoading,
    isError,
    error,
  } = useApiQuery<RegistrationFieldsPayload>(
    qk.taxpayer.registration(),
    async () => {
      try {
        const response = await getRegistrationFields();
        if (!response) {
          throw new Error("Impossible de charger les champs d'enregistrement.");
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur s'est produite lors du chargement des champs.";
        throw new Error(errorMessage);
      }
    },
    {
      retry: 1,
      retryDelay: 2000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Éviter les re-fetch automatiques
    }
  );

  const fields = registrationPayload?.fields ?? EMPTY_FIELDS;
  const serverForm = registrationPayload?.form ?? null;
  const serverMessage = registrationPayload?.message;

  useEffect(() => {
    if (!serverForm) return;
    const serialized = JSON.stringify(serverForm);
    if (hydratedFormRef.current === serialized) return;
    hydratedFormRef.current = serialized;

    // Utiliser startTransition pour éviter les rendus en cascade
    startTransition(() => {
      setFormData((prev) => ({
        ...serverForm,
        ...prev,
      }));
    });
  }, [serverForm]);

  useEffect(() => {
    if (!serverMessage) return;
    if (shownMessageRef.current === serverMessage) return;
    success(serverMessage);
    shownMessageRef.current = serverMessage;
  }, [serverMessage, success]);

  const handleValueChange = (property: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const currentFields = useMemo<ApiInputType[]>(
    () =>
      fields.filter((f) =>
        signupSteps[currentStep]?.fields.includes(f.property)
      ),
    [fields, currentStep]
  );

  const isStepValid = () => {
    return currentFields.every((field) => {
      if (field.isOptional) return true;
      const value = formData[field.property];
      return value !== null && value !== undefined && value !== "";
    });
  };

  const goNext = () =>
    setCurrentStep((s) => Math.min(s + 1, signupSteps.length - 1));

  const goPrevious = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const mutation = useApiMutation<
    Record<string, unknown>,
    { data: Record<string, unknown> }
  >(
    async (payload) => {
      const response = await registerTaxpayer(payload);
    
      if (!response) throw new Error("Soumission échouée");
      return response;
    },
    {
      onSuccess: (data) => {
        const message =
          (data as { message?: string })?.message ||
          "Compte créé avec succès ! Vous pouvez maintenant vous connecter.";
        success(message);
        // Rediriger vers la page de connexion après un court délai
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      },
      onError: (err) => {
        const message =
          err instanceof Error
            ? err.message
            : "Une erreur s'est produite lors de la création du compte. Veuillez réessayer.";
        showError(message);
      },
    }
  );

  const submit = () => {
  
    mutation.mutate(formData);
  };

  return {
    currentStep,
    steps: signupSteps,
    formData,
    handleValueChange,
    isStepValid,
    goNext,
    goPrevious,
    submit,
    currentFields,
    isLoading: isLoading && !registrationPayload, // Ne montrer le loader que si on n'a pas encore de données
    isError,
    error,
    isSubmitting: mutation.isPending,
  };
}
