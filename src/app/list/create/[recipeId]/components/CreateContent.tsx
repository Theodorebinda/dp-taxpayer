"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { useRecipeForm, useCreateRecipeDeclaration } from "@/hooks/useRecipe";
import type { RecipeFormFieldsPayload } from "@/services/recipe.service";
import { useToast } from "@/hooks/useToast";
import Loader from "@/components/atoms/loader";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { DynamicFormField } from "@/components/form/DynamicFormField";
import { useDynamicFormStore } from "@/store/dynamic-form.store";

type CreateContentProps = {
  recipeId: string;
  initialFields: RecipeFormFieldsPayload;
};

export default function CreateContent({
  recipeId,
  initialFields,
}: CreateContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: showError } = useToast();
  const createMutation = useCreateRecipeDeclaration();
  const { setFormFields, setInitialValues, reset } = useDynamicFormStore();

  // Récupérer l'ID depuis les query params si en mode édition
  const editIdParam = searchParams.get("id");
  const isEdit = Boolean(editIdParam);

  // Utiliser le hook pour récupérer les champs de formulaire
  const { data: formFieldsData, isLoading, refetch } = useRecipeForm(recipeId);

  // Utiliser les données initiales ou celles du hook
  const fieldsData =
    formFieldsData && typeof formFieldsData === "object"
      ? formFieldsData
      : initialFields;

  // S'assurer que fields est toujours un tableau
  const fields = Array.isArray(fieldsData?.fields) ? fieldsData.fields : [];

  // Debug: vérifier la structure des données
  console.log("fieldsData:", fieldsData);
  console.log("fieldsData?.fields:", fieldsData?.fields);
  console.log(
    "Array.isArray(fieldsData?.fields):",
    Array.isArray(fieldsData?.fields)
  );

  console.log("fields (final):", fields);
  console.log("fields.length:", fields.length);

  // Initialiser le store Zustand
  useEffect(() => {
    if (Array.isArray(fieldsData?.fields) && fieldsData.fields.length > 0) {
      setFormFields(fieldsData.fields);
    }
    if (isEdit && editIdParam) {
      setInitialValues(fieldsData?.form || {});
    } else {
      setInitialValues(fieldsData?.form || {});
    }
  }, [fieldsData, isEdit, editIdParam, setFormFields, setInitialValues]);

  // Utiliser le hook de formulaire dynamique
  const { form, visibleFields, watchedValues } = useDynamicForm(
    fields,
    fieldsData?.form || {}
  );

  // Gérer la soumission du formulaire
  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (isEdit && editIdParam) {
        // Mode édition - TODO: Implémenter updateRecipeDeclaration si nécessaire
        showError(
          "La mise à jour n'est pas encore implémentée pour les recipes"
        );
        return;
      } else {
        // Mode création
        const result = await createMutation.mutateAsync({
          recipeId,
          payload: data,
        });

        success(result.message || "Déclaration créée avec succès !");
      }

      // Rediriger vers la liste des déclarations ou le dashboard
      setTimeout(() => {
        router.push("/list/overview");
        reset();
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

  if (!fieldsData || typeof fieldsData !== "object" || !fieldsData.fields) {
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

  const isLoadingMutation = createMutation.isPending;

  return (
    <section className="flex flex-col gap-6 p-0 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Link href="/list/overview">
            <Button variant="outline" size="small">
              <ArrowLeft className="size-4" />
              Retour
            </Button>
          </Link>
        </div>
        <div>
          <p className="text-sm uppercase text-muted-foreground">
            {isEdit ? "Modification" : "Création"}
          </p>
          <h1 className="text-3xl font-semibold">Nouvelle déclaration</h1>
          <p className="text-sm text-muted-foreground">
            {fieldsData.message || "Remplissez le formulaire ci-dessous"}
          </p>
        </div>
      </div>

      {/* Formulaire avec React Hook Form */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5">
            {visibleFields.length === 0 ? (
              <div className="col-span-full rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40">
                <p className="font-semibold">Aucun champ à afficher</p>
                <p className="text-sm">
                  {fields.length === 0
                    ? "Aucun champ de formulaire n'a été chargé."
                    : `${fields.length} champ(s) chargé(s) mais aucun n'est visible.`}
                </p>
                <p className="text-xs mt-2">
                  Debug: fields.length = {fields.length}, visibleFields.length ={" "}
                  {visibleFields.length}
                </p>
              </div>
            ) : (
              visibleFields.map((field) => (
                <DynamicFormField
                  key={field.property}
                  field={field}
                  control={form.control}
                  parentValue={watchedValues}
                  parentFields={fields}
                  depth={0}
                  storePath={field.property}
                />
              ))
            )}
          </div>

          {/* Messages d'erreur globaux */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
              <p className="font-semibold">
                Veuillez corriger les erreurs suivantes :
              </p>
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(form.formState.errors).map(([key, error]) => {
                  const errorMessage =
                    error &&
                    typeof error === "object" &&
                    "message" in error &&
                    typeof error.message === "string"
                      ? error.message
                      : `Erreur dans le champ ${key}`;
                  return <li key={key}>{errorMessage}</li>;
                })}
              </ul>
            </div>
          )}

          {/* Bouton de soumission */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link href="/list/overview">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isLoadingMutation}>
              {isLoadingMutation
                ? "En cours..."
                : isEdit
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
