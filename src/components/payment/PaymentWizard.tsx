"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePaymentStore } from "@/store/paymentStore";
import { usePaymentSubmit } from "@/hooks/usePaymentSubmit";
import { useUploadProof } from "@/hooks/useUploadProof";
import WizardHeader from "./WizardHeader";
import PaymentContainer from "./PaymentContainer";
import { Button } from "@/components/ui";
import { useToast } from "@/hooks/useToast";

/**
 * PaymentWizard - Composant principal du module de paiement
 * Gère le wizard complet avec 4 étapes et la soumission finale
 */

interface PaymentWizardProps {
  operationId?: string;
  defaultAmount?: number;
  onSuccess?: () => void;
}

export default function PaymentWizard({
  operationId,
  defaultAmount = 0,
  onSuccess,
}: PaymentWizardProps) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const {
    currentStep,
    paymentMethod,
    formEasyPay,
    formOther,
    isValid,
    nextStep,
    previousStep,
    reset,
  } = usePaymentStore();

  const paymentSubmit = usePaymentSubmit();
  const uploadProof = useUploadProof();

  // Réinitialiser le store au montage si nécessaire
  useEffect(() => {
    return () => {
      // Optionnel : reset au démontage
      // reset();
    };
  }, []);

  const handleSubmit = async () => {
    if (!isValid) {
      showError("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      if (paymentMethod === "easypay") {
        // Soumettre le paiement EasyPay
        await paymentSubmit.mutateAsync({
          method: "easypay",
          fullName: formEasyPay.fullName,
          email: formEasyPay.email,
          phone: formEasyPay.phone,
          amount: formEasyPay.amount,
          operationId,
        });

        success("Paiement soumis avec succès !");
      } else {
        // Uploader la preuve de paiement
        if (!formOther.proofFile) {
          showError("Veuillez télécharger une preuve de paiement");
          return;
        }

        await uploadProof.mutateAsync({
          file: formOther.proofFile,
          reference: formOther.reference,
          notes: formOther.notes || undefined,
          operationId,
        });

        success("Preuve de paiement téléchargée avec succès !");
      }

      // Callback de succès
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirection par défaut
        router.push("/list/operations");
      }

      // Réinitialiser le formulaire
      reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la soumission";
      showError(message);
    }
  };

  const isSubmitting = paymentSubmit.isPending || uploadProof.isPending;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Wizard Header */}
      <WizardHeader />

      {/* Contenu selon l'étape */}
      {currentStep === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Panier</h2>
          <p className="text-gray-600">
            Contenu du panier à implémenter selon vos besoins.
          </p>
        </div>
      )}

      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
          <p className="text-gray-600">
            Formulaire d&apos;adresse à implémenter selon vos besoins.
          </p>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <PaymentContainer
            operationId={operationId}
            defaultAmount={defaultAmount}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Méthode de paiement</p>
              <p className="font-semibold">
                {paymentMethod === "easypay" ? "EasyPay" : "Autre"}
              </p>
            </div>
            {paymentMethod === "easypay" && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Nom complet</p>
                <p className="font-semibold">{formEasyPay.fullName}</p>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{formEasyPay.email}</p>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-semibold">{formEasyPay.phone}</p>
                <p className="text-sm text-gray-600">Montant</p>
                <p className="font-semibold text-green-600">
                  {formEasyPay.amount.toLocaleString()} CDF
                </p>
              </div>
            )}
            {paymentMethod === "other" && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <p className="text-sm text-gray-600">Référence</p>
                <p className="font-semibold">{formOther.reference}</p>
                {formOther.notes && (
                  <>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-semibold">{formOther.notes}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 bg-white rounded-lg shadow-sm p-6">
        <Button
          onClick={previousStep}
          disabled={currentStep === 0 || isSubmitting}
          variant="secondary"
          className="px-6 py-2"
        >
          Précédent
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={nextStep}
            disabled={!isValid || isSubmitting}
            variant="primary"
            className="px-6 py-2"
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            variant="primary"
            className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Traitement..." : "Confirmer le paiement"}
          </Button>
        )}
      </div>
    </div>
  );
}
