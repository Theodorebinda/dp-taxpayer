"use client";

import { useSearchParams } from "next/navigation";
import PaymentWizard from "@/components/payment/PaymentWizard";

/**
 * Page de paiement - Exemple d'utilisation du PaymentWizard
 * Récupère l'operationId depuis les query params si disponible
 */

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const operationId = searchParams.get("operationId") || undefined;

  return (
    <section className="flex flex-col gap-3 p-0 md:p-6">
      <div className="mb-4">
        <p className="text-sm uppercase text-muted-foreground">Opérations</p>
        <h1 className="text-3xl font-semibold">Paiement</h1>
        <p className="text-sm text-muted-foreground">
          Procédez au paiement de votre déclaration en suivant les étapes.
        </p>
      </div>

      <PaymentWizard
        operationId={operationId}
        defaultAmount={50000} // Montant par défaut si non fourni par l'API
        onSuccess={() => {
          // Callback personnalisé après succès
          console.log("Paiement réussi !");
        }}
      />
    </section>
  );
}
