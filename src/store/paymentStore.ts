import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Payment Store - Gestion d'état globale du module de paiement
 * Utilise Zustand pour une gestion d'état simple et performante
 */

export type PaymentMethod = "easypay" | "other";

export interface EasyPayFormData {
  fullName: string;
  email: string;
  phone: string;
  amount: number; // Read-only, fourni via props
}

export interface OtherPaymentFormData {
  proofFile: File | null;
  reference: string;
  notes: string;
}

export interface PaymentStoreState {
  // État du wizard
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Méthode de paiement sélectionnée
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;

  // Données des formulaires
  formEasyPay: EasyPayFormData;
  setFormEasyPay: (data: Partial<EasyPayFormData>) => void;
  resetFormEasyPay: () => void;

  formOther: OtherPaymentFormData;
  setFormOther: (data: Partial<OtherPaymentFormData>) => void;
  resetFormOther: () => void;

  // Validation
  isValid: boolean;
  validate: () => boolean;

  // Reset complet
  reset: () => void;
}

const STEPS = ["cart", "address", "payment", "confirm"] as const;
const TOTAL_STEPS = STEPS.length;

const initialEasyPayForm: EasyPayFormData = {
  fullName: "",
  email: "",
  phone: "",
  amount: 0,
};

const initialOtherForm: OtherPaymentFormData = {
  proofFile: null,
  reference: "",
  notes: "",
};

export const usePaymentStore = create<PaymentStoreState>()(
  devtools(
    (set, get) => ({
      // État initial
      currentStep: 0,
      paymentMethod: "easypay",
      formEasyPay: initialEasyPayForm,
      formOther: initialOtherForm,
      isValid: false,

      // Actions pour le wizard
      setCurrentStep: (step: number) => {
        if (step >= 0 && step < TOTAL_STEPS) {
          set({ currentStep: step });
          get().validate();
        }
      },

      nextStep: () => {
        const { currentStep, validate } = get();
        if (validate() && currentStep < TOTAL_STEPS - 1) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Actions pour la méthode de paiement
      setPaymentMethod: (method: PaymentMethod) => {
        set({ paymentMethod: method });
        get().validate();
      },

      // Actions pour le formulaire EasyPay
      setFormEasyPay: (data: Partial<EasyPayFormData>) => {
        set((state) => ({
          formEasyPay: { ...state.formEasyPay, ...data },
        }));
        get().validate();
      },

      resetFormEasyPay: () => {
        set({ formEasyPay: initialEasyPayForm });
      },

      // Actions pour le formulaire Other
      setFormOther: (data: Partial<OtherPaymentFormData>) => {
        set((state) => ({
          formOther: { ...state.formOther, ...data },
        }));
        get().validate();
      },

      resetFormOther: () => {
        set({ formOther: initialOtherForm });
      },

      // Validation
      validate: () => {
        const { paymentMethod, formEasyPay, formOther, currentStep } = get();

        // Validation selon l'étape actuelle
        if (currentStep < 2) {
          // Pas encore à l'étape de paiement
          set({ isValid: true });
          return true;
        }

        // Validation à l'étape de paiement
        if (paymentMethod === "easypay") {
          const isValid =
            formEasyPay.fullName.trim() !== "" &&
            formEasyPay.email.trim() !== "" &&
            formEasyPay.phone.trim() !== "" &&
            formEasyPay.amount > 0 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEasyPay.email);

          set({ isValid });
          return isValid;
        } else {
          const isValid =
            formOther.proofFile !== null && formOther.reference.trim() !== "";

          set({ isValid });
          return isValid;
        }
      },

      // Reset complet
      reset: () => {
        set({
          currentStep: 0,
          paymentMethod: "easypay",
          formEasyPay: initialEasyPayForm,
          formOther: initialOtherForm,
          isValid: false,
        });
      },
    }),
    { name: "payment-store" }
  )
);
