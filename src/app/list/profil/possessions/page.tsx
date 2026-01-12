import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaxpayerById } from "@/services/taxpayer.service";
import PossessionsContent from "./components/PossessionsContent";
import { redirect } from "next/navigation";

export default async function ProfilPossessionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

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

  // Fetch initial côté serveur sans pagination pour obtenir le total
  const taxpayerDataWithoutPagination = await getTaxpayerById(
    taxpayerId,
    accessToken
  );

  if (!taxpayerDataWithoutPagination) {
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

  // Calculer le total réel des possessions (sans pagination)
  const totalPossessions =
    taxpayerDataWithoutPagination.possessions?.length ?? 0;

  // Récupérer les possessions de la première page pour les données initiales
  const taxpayerDataFirstPage = await getTaxpayerById(taxpayerId, accessToken, {
    skip: 0,
    limit: 10,
  });

  const initialPossessions =
    taxpayerDataFirstPage && typeof taxpayerDataFirstPage === "object"
      ? taxpayerDataFirstPage.possessions
      : taxpayerDataWithoutPagination.possessions;

  return (
    <PossessionsContent
      initialData={initialPossessions}
      taxpayerId={taxpayerId}
      totalPossessions={totalPossessions}
    />
  );
}
