"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/atoms/loader";

type FreshOperation = {
  id: string;
  serialNumber: string;
  status: string;
  paiementStatus: string;
  action: string;
  totalAmount: number;
  paiedAmount: number;
  currency: { formatKey: string };
  organization: { name: string };
  possession: {
    uniqueNumber: string;
    type: { name: string };
    taxPayer: {
      firstName: string;
      lastName: string;
      mobile: string;
    };
    meta: any;
  };
  transactions: any[];
};

const STORAGE_KEY = "fresh-operation";

export default function ResultPage() {
  const [data, setData] = useState<FreshOperation | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {}
    }
  }, []);

  if (!data) return <Loader />;

  const d = data;

  return (
    <section className="p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Déclaration créée</h1>

      {/* 1. Général */}
      <div className="rounded-xl border p-6 shadow bg-background">
        <h2 className="text-xl font-semibold mb-3">Informations générales</h2>

        <p>
          <strong>ID :</strong> {d.id}
        </p>
        <p>
          <strong>Numéro :</strong> {d.serialNumber}
        </p>
        <p>
          <strong>Statut :</strong> {d.status}
        </p>
        <p>
          <strong>Paiement :</strong> {d.paiementStatus}
        </p>
        <p>
          <strong>Montant dû :</strong> {d.totalAmount} {d.currency.formatKey}
        </p>
        <p>
          <strong>Montant payé :</strong> {d.paiedAmount}
        </p>
        <p>
          <strong>Organisation :</strong> {d.organization?.name}
        </p>
      </div>

      {/* 2. Possession */}
      {d.possession && (
        <div className="rounded-xl border p-6 shadow bg-background">
          <h2 className="text-xl font-semibold mb-3">Possession déclarée</h2>

          <p>
            <strong>Type :</strong> {d.possession.type.name}
          </p>
          <p>
            <strong>Numéro unique :</strong> {d.possession.uniqueNumber}
          </p>
          <p>
            <strong>Adresse :</strong> {d.possession.meta.parcelleAddress}
          </p>
          <p>
            <strong>Référence cadastrale :</strong>{" "}
            {d.possession.meta.referenceCadastrale}
          </p>

          <h3 className="mt-3 font-semibold">Contribuable</h3>
          <p>
            {d.possession.taxPayer.firstName} {d.possession.taxPayer.lastName}
          </p>
          <p>
            <strong>Mobile :</strong> {d.possession.taxPayer.mobile}
          </p>
        </div>
      )}

      {/* 3. Transactions */}
      <div className="rounded-xl border p-6 shadow bg-background">
        <h2 className="text-xl font-semibold mb-3">Transactions</h2>

        {d.transactions.length === 0 && <p>Aucune transaction enregistrée.</p>}

        <ul className="flex flex-col gap-3">
          {d.transactions.map((t, i) => (
            <li key={i} className="border rounded p-3 bg-muted/10">
              <p>
                <strong>Motif :</strong> {t.motif}
              </p>
              <p>
                <strong>Montant :</strong> {t.amount} {d.currency.formatKey}
              </p>
              <p>
                <strong>Type :</strong> {t.transactionType}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
