import Link from "next/link";

export default function MainPublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-(--dp-bg) text-neutral-900 flex flex-col">
      <header>
        <nav className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="w-11 h-11 rounded-xl bg-(--dp-primary) shadow-md"
            />
            <span className="font-semibold text-lg">DigiPublic</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-700">
            <a
              className="hover:text-(--dp-primary) transition"
              href="#features"
            >
              Fonctionnalités
            </a>
            <a className="hover:text-(--dp-primary) transition" href="#how">
              Comment ça marche
            </a>
            <Link
              className="hover:text-(--dp-primary) transition"
              href="/contact"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-(--dp-primary) font-medium hidden md:inline"
            >
              Se connecter
            </Link>
            <Link
              href="/registration"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--dp-primary) text-white font-semibold shadow hover:bg-(--dp-primary-400) transition"
            >
              {"S'inscrire"}
            </Link>
          </div>
        </nav>
      </header>

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
