"use client";

import { Check } from "lucide-react";
import { usePaymentStore } from "@/store/paymentStore";

/**
 * WizardHeader - En-tête avec stepper pour le processus de paiement
 * Affiche les 4 étapes : Shopping Cart, Delivery Address, Payment Method, Confirm Order
 */

const STEPS = [
  { id: 0, label: "Panier", key: "cart" },
  { id: 1, label: "Adresse", key: "address" },
  { id: 2, label: "Paiement", key: "payment" },
  { id: 3, label: "Confirmation", key: "confirm" },
] as const;

export default function WizardHeader() {
  const { currentStep } = usePaymentStore();

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all relative z-10 ${
                    isCompleted
                      ? "bg-green-500 text-white shadow-md"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-200 shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.id + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    isCurrent
                      ? "text-primary/10 font-semibold"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`absolute top-6 left-[50%] w-full h-0.5 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                    style={{
                      width: "calc(100% - 3rem)",
                      marginLeft: "3rem",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
