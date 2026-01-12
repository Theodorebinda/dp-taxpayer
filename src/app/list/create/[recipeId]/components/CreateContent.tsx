/**
 * Composant CreateContent refactoré avec FormEngine 2.0
 * Utilise :
 * - TanStack Query pour toutes les données
 * - Composants DynamicField
 * - Support complet du mode édition
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import Loader from "@/components/atoms/loader";
import {
  useRecipeFormDefinition,
  useRecipeInitialValues,
  useSubmitRecipeForm,
  useUpdateRecipeForm,
} from "@/modules/recipe/queries/useRecipeQueries";
import { useDynamicForm } from "@/modules/formEngine/hooks/useDynamicForm";
import { DynamicField } from "@/modules/formEngine/ui/DynamicField";
import { useDynamicFormStore } from "@/store/dynamic-form.store";

type CreateContentProps = {
  recipeId: string;
};

export default function CreateContent({ recipeId }: CreateContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: showError } = useToast();
  const { data: session } = useSession();

  const connectedUserId =
    (session as { user?: { taxpayerId?: string | null; id?: string | null } })
      ?.user?.taxpayerId ??
    session?.user?.id ??
    null;

  // Store pour l'état UI (mode édition, etc.)
  const { isEditMode, editId, setEditMode } = useDynamicFormStore();

  // Récupérer l'ID depuis les query params si en mode édition
  const editIdParam = searchParams.get("id");
  const isEdit = Boolean(editIdParam);

  // Mettre à jour le store si nécessaire
  if (isEdit && editIdParam && (!isEditMode || editId !== editIdParam)) {
    setEditMode(true, editIdParam);
  }

  // Récupérer la définition du formulaire via TanStack Query
  const {
    data: formDefinition,
    isLoading: isLoadingForm,
    error: formError,
    refetch: refetchForm,
  } = useRecipeFormDefinition(recipeId);

  // Récupérer les valeurs initiales en mode édition via TanStack Query
  const {
    data: initialValues,
    isLoading: isLoadingValues,
    error: valuesError,
  } = useRecipeInitialValues(
    recipeId,
    isEdit && editIdParam ? editIdParam : null
  );

  // Mutations pour créer/mettre à jour
  const submitMutation = useSubmitRecipeForm();
  const updateMutation = useUpdateRecipeForm();

  // Extraire les champs et valeurs initiales
  const fields = formDefinition?.fields ?? [];
  const formInitialValues =
    isEdit && initialValues
      ? { ...formDefinition?.initialValues, ...initialValues }
      : formDefinition?.initialValues ?? {};

  // Hook de formulaire dynamique avec validation custom
  const form = useDynamicForm({
    fields,
    initialValues: formInitialValues,
    validateOnChange: true,
    onSubmit: async (payload) => {
      const payloadWithUser =
        connectedUserId != null
          ? { ...payload, taxPayerId: connectedUserId }
          : payload;

      if (isEdit && editIdParam) {
        // Mode édition
        const result = await updateMutation.mutateAsync({
          recipeId,
          declarationId: editIdParam,
          payload: payloadWithUser,
        });
        success(result.message || "Déclaration mise à jour avec succès !");
      } else {
        // Mode création
        const result = await submitMutation.mutateAsync({
          recipeId,
          payload: payloadWithUser,
        });
        sessionStorage.setItem("fresh-operation", JSON.stringify(result.data));
        success(result.message || "Déclaration créée avec succès !");

        const newId = result?.data?.id;
        if (newId) {
          router.push(`/list/create/[recipeId]/result`);
        } else {
          router.push("/list/overview");
        }
      }

      // Rediriger après succès
      setTimeout(() => {
        form.reset();
        setEditMode(false, null);
      }, 1500);
    },
  });

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await form.submit();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : isEdit
          ? "Une erreur s'est produite lors de la mise à jour."
          : "Une erreur s'est produite lors de la création.";
      showError(message);
    }
  };

  // États de chargement
  const isLoading = isLoadingForm || (isEdit && isLoadingValues);
  const isSubmitting = submitMutation.isPending || updateMutation.isPending;

  // Affichage du loader
  if (isLoading) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <Loader />
      </section>
    );
  }

  // Affichage des erreurs
  if (formError || valuesError || !formDefinition) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            {formError instanceof Error
              ? formError.message
              : valuesError instanceof Error
              ? valuesError.message
              : "Impossible de charger les champs du formulaire. Veuillez réessayer."}
          </p>
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              refetchForm();
            }}
            className="mt-3"
          >
            Réessayer
          </Button>
        </div>
      </section>
    );
  }

  // Afficher le formulaire
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
            {formDefinition.message || "Remplissez le formulaire ci-dessous"}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="rounded-xl  bg-background/90 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Champs du formulaire */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5">
            {form.visibleFields.length === 0 ? (
              <div className="col-span-full rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40">
                <p className="font-semibold">Aucun champ à afficher</p>
                <p className="text-sm">
                  {fields.length === 0
                    ? "Aucun champ de formulaire n'a été chargé."
                    : `${fields.length} champ(s) chargé(s) mais aucun n'est visible.`}
                </p>
              </div>
            ) : (
              form.visibleFields.map((field) => {
                const fieldValue = form.values[field.property] ?? null;
                const fieldError = form.errors[field.property];

                return (
                  <DynamicField
                    key={field.property}
                    field={field}
                    value={fieldValue}
                    onChange={(value) => form.setValue(field.property, value)}
                    error={fieldError}
                    parentValue={form.values}
                    depth={0}
                    disabled={isSubmitting}
                  />
                );
              })
            )}
          </div>

          {/* Messages d'erreur globaux */}
          {Object.keys(form.errors).length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
              <p className="font-semibold">
                Veuillez corriger les erreurs suivantes :
              </p>
              <ul className="mt-2 list-disc list-inside">
                {Object.entries(form.errors).map(([key, error]) => (
                  <li key={key}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Boutons de soumission */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link href="/list/overview">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
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
