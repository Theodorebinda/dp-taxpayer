"use client";

import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
  return (
    <section className="flex flex-col gap-3 p-0 md:p-6">
      <p className="text-sm uppercase text-muted-foreground">Opérations</p>
      <div className="flex items-center gap-4">
        <Link href="/list/overview">
          <Button variant="outline" size="small">
            <ArrowLeft className="size-4" />
            Retour
          </Button>
        </Link>
        <Button
          variant="outline"
          size="small"
          // onClick={() => refetch()}
          // disabled={isLoading}
        >
          Actualiser
        </Button>
      </div>
      <h1 className="text-3xl font-semibold">Paiements</h1>
      <p className="text-sm text-muted-foreground">
        Tableaux de suivi et actions liées aux paiements des contribuables.
      </p>
      <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        Contenu des paiements à implémenter.
      </div>
    </section>
  );
}
