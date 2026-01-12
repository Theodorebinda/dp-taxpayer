import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { listOperations } from "@/services/operations.service";
import DeclarationsContent from "./components/DeclarationsContent";
import { redirect } from "next/navigation";

/**
 * Page de liste des déclarations
 * Server Component qui récupère les données depuis la session NextAuth
 */
export default async function DeclarationsPage() {
  // Récupération de la session côté serveur
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Extraction du token d'accès
  const accessToken = (session as unknown as { accessToken?: string })
    ?.accessToken;
  const taxpayerId = session.user?.taxpayerId ?? session.user?.id;

  if (!taxpayerId || !accessToken) {
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

  // Fetch initial côté serveur
  const initialOperations = await listOperations(
    taxpayerId,
    undefined,
    accessToken
  );

  // Passer les données au composant client
  return (
    <DeclarationsContent
      taxpayerId={taxpayerId}
      initialData={initialOperations}
    />
  );
}
