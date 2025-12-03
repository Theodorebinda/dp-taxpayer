"use client";

import { CreditCard, Upload } from "lucide-react";
import { usePaymentStore, type PaymentMethod } from "@/store/paymentStore";

/**
 * PaymentMethodSelector - Sélecteur de méthode de paiement (colonne gauche)
 * Affiche les méthodes disponibles : EasyPay et Other (Upload Bank Payment Proof)
 */

const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  title: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    id: "easypay",
    title: "EasyPay",
    icon: <CreditCard className="w-6 h-6" />,
    description: "Paiement sécurisé par carte bancaire",
  },
  {
    id: "other",
    title: "Autre",
    icon: <Upload className="w-6 h-6" />,
    description: "Télécharger une preuve de paiement bancaire",
  },
];

export default function PaymentMethodSelector() {
  const { paymentMethod, setPaymentMethod } = usePaymentStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Méthode de paiement
      </h3>
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = paymentMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {method.icon}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-1 ${
                      isSelected ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {method.title}
                  </h4>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
