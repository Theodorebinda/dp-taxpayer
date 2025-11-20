import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getDeclarationFormFields } from "@/services/declaration.service";
import CreateContent from "./components/CreateContent";
import { redirect } from "next/navigation";
import type { DeclarationType } from "@/types/declaration-types";
import { DECLARATION_TYPES } from "@/types/declaration-types";

type CreatePageProps = {
  searchParams: Promise<{ type?: string }>;
};

/**
 * Page centralisée pour créer différents types de déclarations
 * Server Component qui récupère les champs de formulaire depuis l'API
 */
export default async function CreatePage({ searchParams }: CreatePageProps) {
  const params = await searchParams;
  const typeParam = params.type;

  // Récupération de la session côté serveur
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Extraction du token d'accès
  const accessToken = (session as unknown as { accessToken?: string })
    ?.accessToken;

  if (!accessToken) {
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

  // Vérifier que le type est valide
  if (!typeParam || !(typeParam in DECLARATION_TYPES)) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Type de déclaration invalide</p>
          <p className="text-sm">
            Le type de déclaration &quot;{typeParam}&quot; n&apos;est pas
            reconnu. Veuillez sélectionner un type valide.
          </p>
        </div>
      </section>
    );
  }

  const declarationType = typeParam as DeclarationType;
  const config = DECLARATION_TYPES[declarationType];

  // Fetch initial côté serveur pour récupérer les champs de formulaire
  const formFields = await getDeclarationFormFields(
    declarationType,
    accessToken
  );

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
  return (
    <CreateContent
      type={declarationType}
      config={config}
      initialFields={formFields}
    />
  );
}
