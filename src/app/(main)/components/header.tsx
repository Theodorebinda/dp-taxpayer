import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 text-neutral-900 ">
      <div className="h-px w-full bg-linear-to-r from-(--app-green-600)/30 via-(--app-blue-600)/30 to-(--app-green-600)/30" />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className="mt-3 mb-3 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-white/10">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <Link href="/" className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-(--dp-primary)  shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-white/90 pulse" />
              </span>
              <Image
                src="/logo/logo-inline.png"
                alt="DigiPublic"
                width={140}
                height={28}
                className="h-6 md:h-8 w-auto"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center gap-8 font-medium text-app-blue-600 ">
              <a
                href="#features"
                className="relative transition-colors hover:text-(--dp-primary) after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-(--dp-primary) after:transition-transform hover:after:scale-x-100"
              >
                Fonctionnalités
              </a>
              <a
                href="#how"
                className="relative transition-colors hover:text-(--dp-primary) after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-(--dp-primary) after:transition-transform hover:after:scale-x-100"
              >
                Comment ça marche
              </a>
              <Link
                href="/contact"
                className="relative transition-colors hover:text-(--dp-primary) after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-(--dp-primary) after:transition-transform hover:after:scale-x-100"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="hidden md:inline px-3 py-2 font-medium text-app-blue-700 hover:text-(--dp-primary) transition-colors dark:text-white/90"
              >
                Se connecter
              </Link>
              <Link
                href="/registration"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white bg-linear-to-r from-(--dp-primary) to-app-green-600 shadow-sm hover:opacity-95 transition"
              >
                {"S'inscrire"}
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
