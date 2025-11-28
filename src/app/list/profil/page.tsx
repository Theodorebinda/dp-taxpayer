import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaxpayerById } from "@/services/taxpayer.service";
import ProfilContent from "./components/ProfilContent";
import { redirect } from "next/navigation";

/**
 * Page de profil du contribuable connecté
 * Server Component qui récupère les données depuis la session NextAuth
 */
export default async function ProfilPage() {
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

  // Fetch initial côté serveur avec l'ID de l'utilisateur connecté
  const taxpayerData = await getTaxpayerById(taxpayerId, accessToken);

  // Si les données ne sont pas trouvées
  if (!taxpayerData) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Profil introuvable</p>
          <p className="text-sm">
            Impossible de charger les informations de votre profil. Veuillez
            contacter le support si le problème persiste.
          </p>
        </div>
      </section>
    );
  }

  // Passer les données au composant client
  // Le composant client peut utiliser useTaxpayer pour le refresh automatique
  return <ProfilContent initialData={taxpayerData} taxpayerId={taxpayerId} />;
}
