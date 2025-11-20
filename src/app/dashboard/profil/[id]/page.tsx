import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getTaxpayerById } from "@/services/taxpayer.service";
import ProfilContent from "./components/ProfilContent";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

type ProfilPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilPage({ params }: ProfilPageProps) {
  const { id } = await params;

  // Récupération de la session côté serveur
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  // Extraction du token d'accès
  const accessToken = (session as unknown as { accessToken?: string })
    ?.accessToken;

  // Extraction de l'ID utilisateur
  const userId = (session.user as { id?: string })?.id;

  if (!userId || !accessToken) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-6 py-4 text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40">
          <p className="font-semibold">Session invalide</p>
          <p className="text-sm">
            Impossible de récupérer les informations de session.
          </p>
        </div>
      </section>
    );
  }

  // Vérifier que l'utilisateur peut accéder à ce profil (optionnel: vérifier que id === userId)
  // Pour l'instant, on permet l'accès si l'utilisateur est authentifié

  // Fetch initial côté serveur
  const taxpayerData = await getTaxpayerById(id, accessToken);

  // Si les données ne sont pas trouvées, on peut rediriger ou afficher une erreur
  if (!taxpayerData) {
    notFound();
  }

  // Passer les données au composant client
  return <ProfilContent initialData={taxpayerData} taxpayerId={id} />;
}
