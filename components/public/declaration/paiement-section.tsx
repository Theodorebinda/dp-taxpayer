"use client";

import React, { useState } from "react";
import Button from "@/components/commons/button";
import Input from "@/components/commons/dynamicInput";

interface PaymentSectionProps {
  operationId: string;
  totalAmount: number;
  currency: string;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  operationId,
  totalAmount,
  currency,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    status: "success" | "error";
  } | null>(null);

  const simulatePayment = async () => {
    setFeedback(null);

    if (!selectedMethod) {
      setFeedback({
        message: "Veuillez choisir un moyen de paiement.",
        status: "error",
      });
      return;
    }

    if (!phoneNumber.match(/^(\+243|0)\d{9}$/)) {
      setFeedback({
        message:
          "Veuillez entrer un numéro de téléphone valide commençant par +243 ou 0.",
        status: "error",
      });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const success = Math.random() > 0.3;
    setLoading(false);

    if (success) {
      setFeedback({
        message: `Paiement réussi de ${totalAmount} ${currency} via ${selectedMethod.toUpperCase()}. Réf: ${operationId}`,
        status: "success",
      });
    } else {
      setFeedback({
        message:
          "Le paiement a échoué. Veuillez vérifier votre solde ou réessayer.",
        status: "error",
      });
    }
  };

  return (
    <div className="mt-10 border-t pt-6 space-y-6">
      <h3 className="text-xl font-semibold text-primary">
        Moyens de paiement mobile
      </h3>

      {/* 🧾 Reçu ou message d’erreur */}
      {feedback ? (
        <div
          className={`border rounded-xl p-5 text-sm transition-all ${
            feedback.status === "success"
              ? "border-green-500 bg-green-50 text-green-800"
              : "border-red-500 bg-red-50 text-red-800"
          }`}
        >
          {feedback.status === "success" ? (
            <>
              <h4 className="text-lg font-bold mb-2 text-center">
                ✅ Paiement effectué avec succès
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Montant payé :</span>{" "}
                  {totalAmount} {currency}
                </p>
                <p>
                  <span className="font-medium">Opérateur :</span>{" "}
                  {selectedMethod?.toUpperCase()}
                </p>
                <p>
                  <span className="font-medium">Téléphone :</span> {phoneNumber}
                </p>
                <p>
                  <span className="font-medium">Référence :</span> {operationId}
                </p>
              </div>
              <div className="mt-4 border-t pt-2 text-center text-xs opacity-70">
                Merci pour votre paiement ! Vous recevrez une confirmation par
                SMS sous peu.
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-bold mb-2 text-center">
                ❌ Échec du paiement
              </h4>
              <p className="text-center">{feedback.message}</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "airtel",
                name: "Airtel Money",
                icon: "/public/airtel_money.png",
              },
              {
                id: "vodacom",
                name: "Vodacom M-Pesa",
                icon: "/public/m_pesa.png",
              },
              {
                id: "orange",
                name: "Orange Money",
                icon: "/public/orange_money.png",
              },
            ].map((method) => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted/10"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  className="accent-primary"
                />
                <img
                  src={method.icon}
                  alt={method.name}
                  className="w-8 h-8 object-contain"
                />
                <span className="font-medium">{method.name}</span>
              </label>
            ))}
          </div>

          <Input
            {...{
              property: "mobile",
              setValue: (value) => setPhoneNumber(String(value)),
              type: "mobile",
              value: phoneNumber,
              verbose: "Numéro de téléphone pour le paiement :",
            }}
          />

          <Button
            isLoading={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all"
            onClick={simulatePayment}
          >
            {loading ? "Paiement en cours..." : "Procéder au paiement"}
          </Button>
        </>
      )}
    </div>
  );
};
