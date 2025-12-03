"use client";

import React, { useState } from "react";
import { Check, CreditCard, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import Button from "@/components/commons/button";

export type PaymentMethod = "easypay" | "other";

interface PaymentWizardProps {
  operationId?: string;
  defaultAmount?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface EasyPayFormData {
  fullName: string;
  email: string;
  phone: string;
  amount: number;
}

interface OtherPaymentFormData {
  proofFile: File | null;
  reference: string;
  notes: string;
}

const STEPS = [
  { id: 1, label: "Mode de paiement", key: "payment-method" },
  { id: 2, label: "Informations", key: "information" },
  { id: 3, label: "Confirmation", key: "confirmation" },
];

export const PaymentWizard: React.FC<PaymentWizardProps> = ({
  operationId,
  defaultAmount = 0,
  onSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [easyPayData, setEasyPayData] = useState<EasyPayFormData>({
    fullName: "",
    email: "",
    phone: "",
    amount: defaultAmount,
  });
  const [otherPaymentData, setOtherPaymentData] =
    useState<OtherPaymentFormData>({
      proofFile: null,
      reference: "",
      notes: "",
    });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Implémenter la soumission du paiement
    console.log("Payment submitted:", {
      paymentMethod,
      easyPayData,
      otherPaymentData,
      operationId,
    });

    // Supprimer les données du sessionStorage après confirmation
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("fresh-operation");
      sessionStorage.removeItem("fresh-operation-pdf");
    }

    onSuccess?.();
  };

  const isStepValid = () => {
    if (currentStep === 1) return paymentMethod !== null;
    if (currentStep === 2) {
      if (paymentMethod === "easypay") {
        return (
          easyPayData.fullName.trim() !== "" &&
          easyPayData.email.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(easyPayData.email) &&
          easyPayData.phone.trim().length >= 8
        );
      } else {
        return (
          otherPaymentData.proofFile !== null &&
          otherPaymentData.reference.trim() !== ""
        );
      }
    }
    return true;
  };

  return (
    <div className="w-full space-y-6">
      {/* Stepper */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep > step.id
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.id
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-all ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <PaymentMethodStep
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        )}

        {currentStep === 2 && paymentMethod === "easypay" && (
          <EasyPayForm
            data={easyPayData}
            onChange={setEasyPayData}
            amount={defaultAmount}
          />
        )}

        {currentStep === 2 && paymentMethod === "other" && (
          <OtherPaymentForm
            data={otherPaymentData}
            onChange={setOtherPaymentData}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep
            paymentMethod={paymentMethod}
            easyPayData={easyPayData}
            otherPaymentData={otherPaymentData}
            amount={defaultAmount}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <Button
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          variant="secondary"
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? "Annuler" : "Précédent"}
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={handleNext}
            variant="primary"
            disabled={!isStepValid()}
          >
            Suivant
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="primary">
            Confirmer le paiement
          </Button>
        )}
      </div>
    </div>
  );
};

// Étape 1: Sélection du mode de paiement
const PaymentMethodStep: React.FC<{
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}> = ({ selectedMethod, onSelect }) => {
  const methods = [
    {
      id: "easypay" as PaymentMethod,
      label: "EasyPay",
      icon: CreditCard,
      cover: "/images/EasyPayLogo.png",
      description: "Paiement sécurisé par carte bancaire",
    },
    {
      id: "other" as PaymentMethod,
      label: "Autre",
      icon: Upload,
      //   cover: "/images/EasyPayLogo.png",
      description: "Télécharger une preuve de paiement",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tabs à gauche */}
      <div className="lg:col-span-1 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Mode de paiement
        </h3>
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`relative w-full h-40 p-4 rounded-lg border-2 transition-all cursor-pointer overflow-hidden group ${
                isSelected
                  ? "border-primary shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
              style={{
                backgroundImage: method.cover
                  ? `url(${method.cover})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Overlay pour la lisibilité */}
              <div
                className={`absolute inset-0 transition-all ${
                  isSelected
                    ? "bg-primary/80"
                    : "bg-black/40 group-hover:bg-black/50"
                }`}
              />

              {/* Contenu superposé */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg backdrop-blur-sm ${
                      isSelected
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white/20 text-white border border-white/30"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold mb-1 text-white drop-shadow-lg ${
                        isSelected ? "text-white" : ""
                      }`}
                    >
                      {method.label}
                    </h4>
                    <p className="text-sm text-white/90 drop-shadow-md">
                      {method.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulaire à droite */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          {selectedMethod ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informations requises
              </h3>
              {selectedMethod === "easypay" ? (
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Nom complet</p>
                  <p>• Adresse email</p>
                  <p>• Numéro de téléphone</p>
                  <p>• Montant à payer</p>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Preuve de paiement (fichier)</p>
                  <p>• Référence de transaction</p>
                  <p>• Notes (optionnel)</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Sélectionnez un mode de paiement pour continuer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Formulaire EasyPay
const EasyPayForm: React.FC<{
  data: EasyPayFormData;
  onChange: (data: EasyPayFormData) => void;
  amount: number;
}> = ({ data, onChange, amount }) => {
  const handleChange = (
    field: keyof EasyPayFormData,
    value: string | number
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">EasyPay</h3>
          <p className="text-sm text-gray-600">
            Remplissez vos informations pour procéder au paiement sécurisé.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="jean.dupont@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+243 900 000 000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant
            </label>
            <input
              type="text"
              value={`${amount.toLocaleString()} CDF`}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Formulaire Autre mode de paiement
const OtherPaymentForm: React.FC<{
  data: OtherPaymentFormData;
  onChange: (data: OtherPaymentFormData) => void;
}> = ({ data, onChange }) => {
  const handleChange = (
    field: keyof OtherPaymentFormData,
    value: string | File | null
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Autre mode</h3>
          <p className="text-sm text-gray-600">
            Téléchargez une preuve de paiement et renseignez les informations de
            transaction.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preuve de paiement <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={(e) =>
                handleChange("proofFile", e.target.files?.[0] || null)
              }
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {data.proofFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {data.proofFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Référence de transaction <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.reference}
              onChange={(e) => handleChange("reference", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="REF-123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={data.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Informations supplémentaires..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Étape de confirmation
const ConfirmationStep: React.FC<{
  paymentMethod: PaymentMethod | null;
  easyPayData: EasyPayFormData;
  otherPaymentData: OtherPaymentFormData;
  amount: number;
}> = ({ paymentMethod, easyPayData, otherPaymentData, amount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Confirmation du paiement
      </h3>

      <div className="space-y-6">
        {/* Résumé du mode de paiement */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Mode de paiement</h4>
          <p className="text-gray-600">
            {paymentMethod === "easypay" ? "EasyPay" : "Autre mode"}
          </p>
        </div>

        {/* Détails selon le mode */}
        {paymentMethod === "easypay" ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">
                Informations EasyPay
              </h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom complet :</span>
                  <span className="font-medium">{easyPayData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email :</span>
                  <span className="font-medium">{easyPayData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone :</span>
                  <span className="font-medium">{easyPayData.phone}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-600 font-semibold">Montant :</span>
                  <span className="font-bold text-green-700 text-lg">
                    {amount.toLocaleString()} CDF
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">
                Informations de paiement
              </h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Preuve de paiement :</span>
                  <span className="font-medium">
                    {otherPaymentData.proofFile
                      ? otherPaymentData.proofFile.name
                      : "Non fourni"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence :</span>
                  <span className="font-medium">
                    {otherPaymentData.reference || "Non fourni"}
                  </span>
                </div>
                {otherPaymentData.notes && (
                  <div className="flex flex-col">
                    <span className="text-gray-600 mb-1">Notes :</span>
                    <span className="font-medium">
                      {otherPaymentData.notes}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-600 font-semibold">Montant :</span>
                  <span className="font-bold text-green-700 text-lg">
                    {amount.toLocaleString()} CDF
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Avertissement */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note :</strong> Veuillez vérifier toutes les informations
            avant de confirmer. Une fois confirmé, le paiement sera traité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentWizard;
