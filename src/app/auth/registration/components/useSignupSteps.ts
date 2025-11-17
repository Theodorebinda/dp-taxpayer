"use client";

import { useMemo, useState } from "react";
import { signupSteps } from "./steps.config";
import { ApiInputType } from "@/types/types";
import { useApiMutation, useApiQuery } from "@/hooks/useApi";
import { qk } from "@/utils/query-keys";
import {
  getRegistrationFields,
  registerTaxpayer,
} from "@/services/taxpayer.service";

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
};

export function useSignupSteps(): UseSignupStepsReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignupFormData>({});

  const {
    data: fields,
    isLoading,
    isError,
    error,
  } = useApiQuery(qk.taxpayer.registration(), async () => {
    const response = await getRegistrationFields();
    if (!response) throw new Error("Impossible de charger les champs.");
    return response.data as ApiInputType[];
  });

  const handleValueChange = (property: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const currentFields = useMemo<ApiInputType[]>(
    () =>
      (fields ?? []).filter((f) =>
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
  >(async (payload) => {
    const response = await registerTaxpayer(payload);
    if (!response) throw new Error("Soumission échouée");
    return response;
  });

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
    isLoading,
    isError,
    error,
  };
}
