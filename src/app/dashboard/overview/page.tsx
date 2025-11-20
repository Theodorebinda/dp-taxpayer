import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaxpayerById } from "@/services/taxpayer.service";
import OverviewContent from "./components/OverviewContent";
import { redirect } from "next/navigation";

export default async function OverviewPage() {
  // Récupération de la session côté serveur
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Extraction du token d'accès
  const accessToken = session.accessToken;

  // Extraction de l'ID du taxpayer depuis la session
  // Le taxpayerId est stocké dans user.taxpayerId (ajouté dans le callback session)
  const taxpayerId = session.user?.taxpayerId ?? session.user?.id;
  if (!taxpayerId || !accessToken) {
    return (
      <main className="h-full w-full p-0 md:p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-6 py-4 text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40">
          <p className="font-semibold">Session invalide</p>
          <p className="text-sm">
            Impossible de récupérer les informations de session.
          </p>
        </div>
      </main>
    );
  }

  // Fetch initial côté serveur
  const taxpayerData = await getTaxpayerById(taxpayerId, accessToken);

  // Passer les données au composant client
  return (
    <OverviewContent
      initialData={
        taxpayerData && typeof taxpayerData === "object" ? taxpayerData : null
      }
      taxpayerId={taxpayerId}
    />
  );
}
