import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { listOperations } from "@/services/operations.service";
import DeclarationDetailContent from "./components/DeclarationDetailContent";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

type DeclarationDetailPageProps = {
  params: Promise<{
    type: string;
    id: string;
  }>;
};

/**
 * Page de détail d'une déclaration
 * Server Component qui récupère les données depuis la session NextAuth
 */
export default async function DeclarationDetailPage({
  params,
}: DeclarationDetailPageProps) {
  const { id } = await params;

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

  // Récupérer l'opération depuis la liste des opérations
  const operations = await listOperations(taxpayerId, undefined, accessToken);
  const operation = operations.find((op) => op.id === id);

  if (!operation) {
    notFound();
  }

  // Passer les données au composant client
  return <DeclarationDetailContent id={id} initialData={operation} />;
}
