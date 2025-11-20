"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import {
  useDeclarationForm,
  useCreateDeclaration,
} from "@/hooks/useDeclaration";
import type {
  DeclarationType,
  DeclarationTypeConfig,
} from "@/types/declaration-types";
import type { DeclarationFormFieldsPayload } from "@/services/declaration.service";
import { useToast } from "@/hooks/useToast";
import Form from "@/components/form/form";
import Loader from "@/components/atoms/loader";

type CreateContentProps = {
  type: DeclarationType;
  config: DeclarationTypeConfig;
  initialFields: DeclarationFormFieldsPayload;
};

export default function CreateContent({
  type,
  config,
  initialFields,
}: CreateContentProps) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const createMutation = useCreateDeclaration();

  // Utiliser le hook pour le refresh si nécessaire
  const { data: formFields, isLoading, refetch } = useDeclarationForm(type);

  // Utiliser les données initiales ou celles du hook
  const fieldsData =
    formFields && typeof formFields === "object" ? formFields : initialFields;

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const result = await createMutation.mutateAsync({
        type,
        payload: data,
      });

      success(result.message || "Déclaration créée avec succès !");

      // Rediriger vers la liste des déclarations ou le dashboard
      setTimeout(() => {
        router.push("/dashboard/overview");
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la création de la déclaration.";
      showError(message);
    }
  };

  if (isLoading && !initialFields) {
    return <Loader />;
  }

  if (!fieldsData || typeof fieldsData !== "object") {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            Impossible de charger les champs du formulaire. Veuillez réessayer.
          </p>
          <Button
            variant="outline"
            size="small"
            onClick={() => refetch()}
            className="mt-3"
          >
            Réessayer
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-0 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/overview">
            <Button variant="outline" size="small">
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          </Link>
        </div>
        <div>
          <p className="text-sm uppercase text-muted-foreground">Création</p>
          <h1 className="text-3xl font-semibold">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <Form
          title={config.title}
          inputs={fieldsData.fields}
          data={fieldsData.form || undefined}
          headPath={undefined}
          submitPath={undefined}
          onSubmit={handleSubmit}
          displaySubmitButton={true}
          onSuccess={(data) => {
            console.log("Form submitted successfully:", data);
          }}
        />
      </div>
    </section>
  );
}
