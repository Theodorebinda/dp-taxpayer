import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaxpayerById } from "@/services/taxpayer.service";
import { getDeclarableRecipes } from "@/services/recipe.service";
import OverviewContent from "./components/OverviewContent";
import SessionExpired from "./components/SessionExpired";
import { redirect } from "next/navigation";

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const accessToken = session.accessToken;

  const taxpayerId = session.user?.taxpayerId ?? session.user?.id;
  if (!taxpayerId || !accessToken) {
    return <SessionExpired />;
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
