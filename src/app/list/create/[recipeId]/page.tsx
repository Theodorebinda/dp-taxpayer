import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getRecipeFormFields } from "@/services/recipe.service";
import { redirect } from "next/navigation";
import CreateContent from "./components/CreateContent";

type CreatePageProps = {
  params: Promise<{ recipeId: string }>;
};

/**
 * Page centralisée pour créer des déclarations basées sur une recipe
 * Server Component qui récupère les champs de formulaire depuis l'API
 */
export default async function CreatePage({ params }: CreatePageProps) {
  const routeParams = await params;
  const recipeId = routeParams.recipeId;

  // Récupération de la session côté serveur
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Extraction du token d'accès
  const accessToken = (session as unknown as { accessToken?: string })
    ?.accessToken;

  if (!accessToken && !session.user.taxpayerId) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-6 py-4 text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40">
          <p className="font-semibold">Session invalide</p>
          <p className="text-sm">
            Impossible de récupérer les informations de session. Veuillez vous
            reconnecter.
          </p>
        </div>
      </section>
    );
  }

  // Vérifier que l'ID de recipe est valide
  if (!recipeId) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Recipe invalide</p>
          <p className="text-sm">
            L&apos;identifiant de la recipe n&apos;est pas valide. Veuillez
            sélectionner une recipe valide.
          </p>
        </div>
      </section>
    );
  }

  // Fetch initial côté serveur pour récupérer les champs de formulaire
  const formFields = await getRecipeFormFields(recipeId, accessToken);

  // Si les champs ne sont pas trouvés
  if (!formFields) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            Impossible de charger le formulaire. Veuillez réessayer plus tard ou
            contacter le support.
          </p>
        </div>
      </section>
    );
  }

  // Passer les données au composant client
  return <CreateContent recipeId={recipeId} initialFields={formFields} />;
}
