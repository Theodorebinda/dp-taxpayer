"use client";

import LogoutButton from "@/components/ui/LogoutButton";

export default function SessionExpired() {
  return (
    <main className="flex h-[calc(70vh)] w-full items-center justify-center p-0 md:p-6">
      <div className="max-w-xl rounded-lg border border-yellow-200 bg-yellow-50 px-8 py-6 text-center text-yellow-700 shadow-md dark:border-yellow-900/60 dark:bg-yellow-950/40">
        <p className="mb-2 text-2xl font-bold">Session Expirée</p>
        <p className="mb-4 leading-relaxed">
          Votre session a expiré. Veuillez vous reconnecter.
        </p>
        <LogoutButton variant="primary" label="Se déconnecter" />
      </div>
    </main>
  );
}
