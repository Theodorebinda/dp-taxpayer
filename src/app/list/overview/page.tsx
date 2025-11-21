import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaxpayerById } from "@/services/taxpayer.service";
import { getDeclarableRecipes } from "@/services/recipe.service";
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
      <main className="flex h-full w-full items-center justify-center p-0 md:p-6">
        <div className="max-w-xl rounded-lg border border-yellow-200 bg-yellow-50 px-8 py-6 text-center text-yellow-700 shadow-md dark:border-yellow-900/60 dark:bg-yellow-950/40">
          <p className="mb-2 text-2xl font-bold">Session invalide</p>
          <p className="mb-4   leading-relaxed">
            Cette plateforme est exclusivement destinée aux assujettis. Vous ne
            devez pas vous connecter avec ce compte.
          </p>
          <a
            href="https://www.digipublic.app/auth/login"
            className="inline-block rounded bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
            target="_blank"
          >
            Accéder à la plateforme Agent
          </a>
        </div>
      </main>
    );
  }

  // Fetch initial côté serveur
  const [taxpayerData, declarableRecipes] = await Promise.all([
    getTaxpayerById(taxpayerId, accessToken),
    getDeclarableRecipes(accessToken),
  ]);

  // Passer les données au composant client
  return (
    <OverviewContent
      initialData={
        taxpayerData && typeof taxpayerData === "object" ? taxpayerData : null
      }
      taxpayerId={taxpayerId}
      initialRecipes={Array.isArray(declarableRecipes) ? declarableRecipes : []}
    />
  );
}
