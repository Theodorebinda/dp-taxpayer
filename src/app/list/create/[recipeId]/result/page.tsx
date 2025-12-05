"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/atoms/loader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DeclarationPDF } from "../components/exportPdf";
import { Button, Dialog } from "@/components/ui";
import { PaymentWizard } from "@/components/ui/modules/payment-mode/payment-mode";

type Transaction = {
  amount: number;
  motif: string;
  paiemendStatus?: string;
  operationStatus?: string;
  transactionType?: string;
};

type PossessionMeta = {
  parcelleAddress?: string;
  referenceCadastrale?: string;
  surfaceTotale?: number;
  modeOccupation?: string;
  [key: string]: unknown;
};

export type FreshOperation = {
  id: string;
  serialNumber: string;
  status: string;
  paiementStatus: string;
  paymentMethod?: string;
  action?: string;
  totalAmount: number;
  paiedAmount: number;
  currency: { formatKey: string };
  organization: { name: string };
  possession: {
    uniqueNumber?: string;
    type: { name: string };
    taxPayer: {
      firstName: string;
      lastName: string;
      mobile?: string;
    };
    meta: PossessionMeta;
  };
  transactions: Transaction[];
};

const STORAGE_KEY = "fresh-operation";
const STORAGE_PDF_KEY = "fresh-operation-pdf";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<FreshOperation | null>(null);
  const [importedPdf, setImportedPdf] = useState<{
    name: string;
    base64: string;
  } | null>(null);
  const [loadingImport, setLoadingImport] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const frame = requestAnimationFrame(() => {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          setData(JSON.parse(raw) as FreshOperation);
        } catch (e) {
          console.error("Invalid fresh-operation in sessionStorage", e);
        }
      }

      const pdf = sessionStorage.getItem(STORAGE_PDF_KEY);
      if (pdf) {
        try {
          setImportedPdf(JSON.parse(pdf));
        } catch (e) {
          console.error("Invalid fresh-operation PDF in sessionStorage", e);
        }
      }
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!data) return <Loader />;

  const d = data;

  // Upload PDF handler: convert to base64 and store in sessionStorage
  const handlePdfImport = async (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }
    setLoadingImport(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is like "data:application/pdf;base64,JVBERi0x..."
      setImportedPdf({ name: file.name, base64: result });
      // persist (useful for later send to API)
      sessionStorage.setItem(
        STORAGE_PDF_KEY,
        JSON.stringify({ name: file.name, base64: result })
      );
      setLoadingImport(false);
    };
    reader.onerror = () => {
      setLoadingImport(false);
      alert("Erreur lors de la lecture du fichier.");
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handlePdfImport(f);
  };

  const removeImportedPdf = () => {
    sessionStorage.removeItem(STORAGE_PDF_KEY);
    setImportedPdf(null);
  };

  return (
    <section className="md:p-6 flex flex-col gap-6  w-full">
      {/* Intro */}
      <div className="bg-background  p-5 rounded-xl">
        <h1 className="text-2xl font-bold text-foreground/70">
          🎉 Félicitations! Votre déclaration a été créée avec succès.
        </h1>
        <p className="mt-2 text-foreground/70">
          Votre déclaration a été enregistrée. Voici une explication claire de
          vos obligations fiscales concernant votre bien.
        </p>
      </div>

      {/* Résumé paiement */}
      <div className="rounded-xl  p-6 bg-background shadow">
        <h2 className="text-xl font-semibold mb-2">Résumé du paiement</h2>

        <p className="text-3xl font-bold text-green-700">
          {d.totalAmount} {d.currency.formatKey}
        </p>
        <p className="text-gray-500">Montant total à payer</p>

        <div className="mt-4">
          <p>
            <strong>Statut :</strong> {d.status}
          </p>
          <p>
            <strong>Paiement :</strong> {d.paiementStatus}
          </p>
          <p>
            <strong>Méthode :</strong> {d.paymentMethod || "-"}
          </p>
          <p>
            <strong>Organisation :</strong> {d.organization.name}
          </p>
        </div>
      </div>

      {/* Possession */}
      <div className="rounded-xl  p-6 bg-background shadow">
        <h2 className="text-xl font-semibold mb-3">Votre bien déclaré</h2>

        <p>
          <strong>Type :</strong> {d.possession.type.name}
        </p>
        <p>
          <strong>Adresse :</strong> {d.possession.meta.parcelleAddress || "-"}
        </p>
        <p>
          <strong>Référence cadastrale :</strong>{" "}
          {d.possession.meta.referenceCadastrale || "-"}
        </p>
        <p>
          <strong>Surface :</strong> {d.possession.meta.surfaceTotale ?? "-"} m²
        </p>
        <p>
          <strong>Occupation :</strong>{" "}
          {d.possession.meta.modeOccupation || "-"}
        </p>

        <div className="mt-4 p-4 bg-background/79 rounded-lg ">
          <p className="font-semibold text-gray-700">À savoir 📘</p>
          <p className="text-sm text-gray-600 mt-1">
            L’impôt sur la parcelle est basé sur sa surface totale, son
            emplacement et le statut juridique déclaré (ex: Titre foncier).
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl  p-6 bg-background shadow">
        <h2 className="text-xl font-semibold mb-3">
          Détails des impôts appliqués
        </h2>

        {d.transactions.map((t, i) => (
          <div key={i} className="p-4 bg-blue-100 rounded-lg mb-3">
            <p className="font-semibold">{t.motif}</p>
            <p>
              <strong>Montant :</strong> {t.amount} {d.currency.formatKey}
            </p>
            <p className="text-sm mt-2 text-gray-600">
              {t.motif === "Impôt Foncier (IF)" &&
                "L’impôt foncier concerne la possession d’un terrain ou d’une parcelle."}
              {t.motif === "Impôt sur les Revenus Locatifs (IRL)" &&
                "Cet impôt s’applique si vous percevez des loyers. Le montant est basé sur les revenus générés."}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <Button
          variant="primary"
          className="w-full   flex justify-center py-4 px-6 rounded-lg font-semibold hover:bg-blue-50 "
        >
          <PDFDownloadLink
            document={<DeclarationPDF data={d} />}
            fileName={`declaration-${d.serialNumber}.pdf`}
            className=""
          >
            {({ loading }: { loading: boolean }) =>
              loading
                ? "Génération du PDF..."
                : "📄 Télécharger la déclaration (PDF)"
            }
          </PDFDownloadLink>
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsPaymentDialogOpen(true)}
          className="w-full  flex justify-center py-4 px-6 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
        >
          💳 Procéder au paiement
        </Button>
      </div>

      {/* Optionnel : afficher statut d'import */}
      {loadingImport && <p>Import du PDF en cours…</p>}

      {/* Dialog de paiement */}
      <Dialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        title="Procéder au paiement"
        size="xl"
      >
        <PaymentWizard
          operationId={d.id}
          defaultAmount={d.totalAmount}
          onSuccess={() => {
            setIsPaymentDialogOpen(false);
            // Les données du sessionStorage sont déjà supprimées dans handleSubmit
            // Rediriger vers l'accueil
            router.push("/list/overview");
          }}
          onCancel={() => {
            setIsPaymentDialogOpen(false);
          }}
        />
      </Dialog>
    </section>
  );
}
