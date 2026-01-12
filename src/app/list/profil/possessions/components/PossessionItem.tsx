"use client";

import React, { useMemo } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Building2, Home, Layers, Warehouse, DoorOpen } from "lucide-react";
import type { TaxpayerPossession } from "@/types/taxpayer-account.type";
import type { LucideIcon } from "lucide-react";

interface PossessionItemProps {
  possession: TaxpayerPossession;
  level?: number;
}

// Mapping des types de possessions vers des icônes
const getPossessionIcon = (typeName: string): LucideIcon => {
  const normalizedType = typeName.toLowerCase();
  if (normalizedType.includes("parcelle")) return Building2;
  if (normalizedType.includes("immeuble")) return Home;
  if (normalizedType.includes("etage") || normalizedType.includes("étage"))
    return Layers;
  if (normalizedType.includes("cave")) return Warehouse;
  if (normalizedType.includes("appartement")) return DoorOpen;
  return Building2;
};

// Fonction pour obtenir le titre d'affichage avec type et adresse
const getPossessionTitle = (possession: TaxpayerPossession): string => {
  const typeName = possession.type?.name || "Bien";
  const meta = possession.meta as Record<string, unknown> | null;

  if (typeName.toLowerCase().includes("parcelle")) {
    const address = meta?.parcelleAddress as string | undefined;
    if (address) {
      return `Parcelle - ${address}`;
    }
    return `Parcelle ${possession.uniqueNumber}`;
  }

  if (typeName.toLowerCase().includes("immeuble")) {
    const nomImmeuble = meta?.nomImmeuble as string | undefined;
    // Pour les immeubles, on peut chercher l'adresse dans les parents (parcelle)
    const address = meta?.parcelleAddress as string | undefined;
    if (nomImmeuble && address) {
      return `Immeuble ${nomImmeuble} - ${address}`;
    }
    if (nomImmeuble) {
      return `Immeuble ${nomImmeuble}`;
    }
    if (address) {
      return `Immeuble - ${address}`;
    }
    return `Immeuble ${possession.uniqueNumber}`;
  }

  if (
    typeName.toLowerCase().includes("etage") ||
    typeName.toLowerCase().includes("étage")
  ) {
    const numeroEtage = meta?.numeroEtage as number | undefined;
    const nomImmeuble = meta?.nomImmeuble as string | undefined;
    const address = meta?.parcelleAddress as string | undefined;

    let title = `Étage ${
      numeroEtage !== undefined ? numeroEtage : possession.uniqueNumber
    }`;
    if (nomImmeuble) {
      title = `${title} - ${nomImmeuble}`;
    }
    if (address) {
      title = `${title} - ${address}`;
    }
    return title;
  }

  if (typeName.toLowerCase().includes("cave")) {
    const nomImmeuble = meta?.nomImmeuble as string | undefined;
    const address = meta?.parcelleAddress as string | undefined;

    let title = `Cave ${possession.uniqueNumber}`;
    if (nomImmeuble) {
      title = `${title} - ${nomImmeuble}`;
    }
    if (address) {
      title = `${title} - ${address}`;
    }
    return title;
  }

  if (typeName.toLowerCase().includes("appartement")) {
    const nomUnite = meta?.nomUnite as string | undefined;
    const nomImmeuble = meta?.nomImmeuble as string | undefined;
    const address = meta?.parcelleAddress as string | undefined;

    let title = nomUnite || `Appartement ${possession.uniqueNumber}`;
    if (nomImmeuble) {
      title = `${title} - ${nomImmeuble}`;
    }
    if (address) {
      title = `${title} - ${address}`;
    }
    return title;
  }

  // Pour les autres types, essayer d'inclure l'adresse si disponible
  const address = meta?.parcelleAddress as string | undefined;
  if (address) {
    return `${typeName} - ${address}`;
  }
  return `${typeName} ${possession.uniqueNumber}`;
};

// Fonction pour obtenir les détails à afficher
const getPossessionDetails = (
  possession: TaxpayerPossession
): React.ReactNode => {
  const meta = possession.meta as Record<string, unknown> | null;
  const typeName = possession.type?.name || "";

  const details: React.ReactNode[] = [];

  // Informations communes
  if (possession.uniqueNumber) {
    details.push(
      <div key="uniqueNumber" className="text-sm text-muted-foreground">
        <span className="font-medium">Numéro unique :</span>{" "}
        {possession.uniqueNumber}
      </div>
    );
  }

  // Détails spécifiques selon le type
  if (typeName.toLowerCase().includes("parcelle")) {
    if (meta?.surfaceTotale) {
      details.push(
        <div key="surface" className="text-sm text-muted-foreground">
          <span className="font-medium">Surface totale :</span>{" "}
          {String(meta.surfaceTotale)} m²
        </div>
      );
    }
    if (meta?.statutJuridique) {
      details.push(
        <div key="statut" className="text-sm text-muted-foreground">
          <span className="font-medium">Statut juridique :</span>{" "}
          {String(meta.statutJuridique)}
        </div>
      );
    }
    if (meta?.referenceCadastrale) {
      details.push(
        <div key="ref" className="text-sm text-muted-foreground">
          <span className="font-medium">Référence cadastrale :</span>{" "}
          {String(meta.referenceCadastrale)}
        </div>
      );
    }
  }

  if (typeName.toLowerCase().includes("immeuble")) {
    if (meta?.nombreEtages) {
      details.push(
        <div key="etages" className="text-sm text-muted-foreground">
          <span className="font-medium">Nombre d&apos;étages :</span>{" "}
          {String(meta.nombreEtages)}
        </div>
      );
    }
    if (meta?.typeConstruction) {
      details.push(
        <div key="construction" className="text-sm text-muted-foreground">
          <span className="font-medium">Type de construction :</span>{" "}
          {String(meta.typeConstruction)}
        </div>
      );
    }
    if (meta?.anneeConstruction) {
      details.push(
        <div key="annee" className="text-sm text-muted-foreground">
          <span className="font-medium">Année de construction :</span>{" "}
          {String(meta.anneeConstruction)}
        </div>
      );
    }
  }

  if (
    typeName.toLowerCase().includes("etage") ||
    typeName.toLowerCase().includes("étage")
  ) {
    if (meta?.surfaceTotaleEtage) {
      details.push(
        <div key="surfaceEtage" className="text-sm text-muted-foreground">
          <span className="font-medium">Surface totale :</span>{" "}
          {String(meta.surfaceTotaleEtage)} m²
        </div>
      );
    }
  }

  if (typeName.toLowerCase().includes("cave")) {
    if (meta?.surfaceTotaleCave) {
      details.push(
        <div key="surfaceCave" className="text-sm text-muted-foreground">
          <span className="font-medium">Surface totale :</span>{" "}
          {String(meta.surfaceTotaleCave)} m²
        </div>
      );
    }
  }

  if (typeName.toLowerCase().includes("appartement")) {
    if (meta?.typeUnite) {
      details.push(
        <div key="typeUnite" className="text-sm text-muted-foreground">
          <span className="font-medium">Type :</span> {String(meta.typeUnite)}
        </div>
      );
    }
    if (meta?.surfaceUnite) {
      details.push(
        <div key="surfaceUnite" className="text-sm text-muted-foreground">
          <span className="font-medium">Surface :</span>{" "}
          {String(meta.surfaceUnite)} m²
        </div>
      );
    }
    if (meta?.loyerMensuel) {
      details.push(
        <div key="loyer" className="text-sm text-muted-foreground">
          <span className="font-medium">Loyer mensuel :</span>{" "}
          {Number(meta.loyerMensuel).toLocaleString("fr-FR")} F
        </div>
      );
    }
    if (meta?.locataireNom) {
      details.push(
        <div key="locataire" className="text-sm text-muted-foreground">
          <span className="font-medium">Locataire :</span>{" "}
          {String(meta.locataireNom)}
        </div>
      );
    }
    if (meta?.occupationUnite) {
      details.push(
        <div key="occupation" className="text-sm text-muted-foreground">
          <span className="font-medium">Occupation :</span>{" "}
          {String(meta.occupationUnite)}
        </div>
      );
    }
  }

  // Compteurs
  if (possession._count) {
    const counts: string[] = [];
    if (possession._count.operations > 0) {
      counts.push(
        `${possession._count.operations} opération${
          possession._count.operations > 1 ? "s" : ""
        }`
      );
    }
    if (possession._count.recipes > 0) {
      counts.push(
        `${possession._count.recipes} recette${
          possession._count.recipes > 1 ? "s" : ""
        }`
      );
    }
    if (counts.length > 0) {
      details.push(
        <div
          key="counts"
          className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20"
        >
          {counts.join(" • ")}
        </div>
      );
    }
  }

  return <div className="space-y-2">{details}</div>;
};

export default function PossessionItem({
  possession,
  level = 0,
}: PossessionItemProps) {
  const title = useMemo(() => getPossessionTitle(possession), [possession]);

  const details = useMemo(() => getPossessionDetails(possession), [possession]);

  const hasChildren = possession.children && possession.children.length > 0;

  // Obtenir le type d'icône et créer l'élément JSX
  const iconType = possession.type?.name || "";
  const IconComponent = getPossessionIcon(iconType);

  const iconElement = useMemo(
    () => React.createElement(IconComponent, { className: "size-5" }),
    [IconComponent]
  );

  if (!hasChildren) {
    return (
      <div
        className="border rounded-lg px-6 py-4 bg-background shadow-sm"
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <div className="flex items-start gap-3">
          {iconElement && (
            <div className="text-primary mt-0.5 shrink-0">{iconElement}</div>
          )}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-2">
              {title}
            </h3>
            {details}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: `${level * 1.5}rem` }}>
      <Accordion
        items={[
          {
            title,
            icon: iconElement,
            children: (
              <div className="space-y-4">
                {details}
                {hasChildren && (
                  <div className="mt-4 space-y-4">
                    {possession.children!.map((child) => (
                      <PossessionItem
                        key={child.id}
                        possession={child}
                        level={level + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            ),
            defaultOpen: level === 0,
          },
        ]}
        allowMultiple={true}
      />
    </div>
  );
}
