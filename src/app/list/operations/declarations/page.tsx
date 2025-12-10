"use client";

import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DeclarationsPage() {
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
      <h1 className="text-3xl font-semibold">Déclarations</h1>
      <p className="text-sm text-muted-foreground">
        Vue dédiée aux déclarations fiscales (listes, formulaires, workflows).
      </p>
      <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
        Contenu des déclarations à implémenter.
      </div>
    </section>
  );
}
