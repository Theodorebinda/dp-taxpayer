import Header from "./components/header";

export default function MainPublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-(--dp-bg) text-neutral-900 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>

      <footer className="bg-white/60 mt-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--dp-primary)" />
            <div>
              <div className="font-semibold">DigiPublic</div>
              <div className="text-sm text-neutral-600">
                Portail contribuable
              </div>
            </div>
          </div>

          <div className="text-sm text-neutral-600">
            © {new Date().getFullYear()} DigiPublic — Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
