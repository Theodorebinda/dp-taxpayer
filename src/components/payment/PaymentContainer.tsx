"use client";

import { useEffect } from "react";
import { usePaymentStore } from "@/store/paymentStore";
import PaymentMethodSelector from "./PaymentMethodSelector";
import EasyPayForm from "./PaymentForms/EasyPayForm";
import OtherPaymentForm from "./PaymentForms/OtherPaymentForm";
import { useAmount } from "@/hooks/useAmount";

/**
 * PaymentContainer - Container principal avec layout deux colonnes
 * Colonne gauche : Sélecteur de méthode de paiement
 * Colonne droite : Formulaire dynamique selon la méthode sélectionnée
 */

interface PaymentContainerProps {
  operationId?: string;
  defaultAmount?: number;
}

export default function PaymentContainer({
  operationId,
  defaultAmount = 0,
}: PaymentContainerProps) {
  const { paymentMethod, setFormEasyPay } = usePaymentStore();
  const { data: amountData, isLoading: isLoadingAmount } =
    useAmount(operationId);

  // Mettre à jour le montant dans le store EasyPay
  useEffect(() => {
    const amount = amountData?.amount ?? defaultAmount;
    setFormEasyPay({ amount });
  }, [amountData, defaultAmount, setFormEasyPay]);

  const displayAmount = amountData?.amount ?? defaultAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Colonne gauche - Sélecteur de méthode */}
      <div className="lg:col-span-1">
        <PaymentMethodSelector />
      </div>

      {/* Colonne droite - Formulaire dynamique */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Informations de paiement
          </h3>

          {isLoadingAmount ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="transition-all duration-300">
              {paymentMethod === "easypay" ? (
                <EasyPayForm amount={displayAmount} />
              ) : (
                <OtherPaymentForm />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
