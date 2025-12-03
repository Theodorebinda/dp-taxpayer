import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaxpayerById } from "@/services/taxpayer.service";
import { getDeclarableRecipes } from "@/services/recipe.service";
import OverviewContent from "./components/OverviewContent";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const accessToken = session.accessToken;

  const taxpayerId = session.user?.taxpayerId ?? session.user?.id;
  if (!taxpayerId || !accessToken) {
    return (
      <main className="flex h-[calc(90vh)] w-full items-center justify-center p-0 md:p-6">
        <div className="max-w-xl rounded-lg border border-yellow-200 bg-yellow-50 px-8 py-6 text-center text-yellow-700 shadow-md dark:border-yellow-900/60 dark:bg-yellow-950/40">
          <p className="mb-2 text-2xl font-bold">Session Expirée</p>
          <p className="mb-4   leading-relaxed">
            Votre session a expiré. Veuillez vous reconnecter.
          </p>
          <Button>Se reconnecter</Button>
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
