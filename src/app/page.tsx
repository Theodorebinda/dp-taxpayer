"use client";
import { Shield, Zap, FileCheck, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DigiPublicLanding() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DigiPublic
            </h1>
          </div>
          <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            Se connecter
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Plateforme officielle de déclarations
          </div>

          {/* Main Heading */}
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Déclarez en ligne
            <span className="block bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              en toute simplicité
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Créez votre compte gratuitement et accédez à votre espace personnel
            sécurisé pour gérer toutes vos déclarations en quelques clics.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => router.push("registration")}
            className="group relative inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-5 rounded-xl text-lg font-semibold shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all duration-300 hover:scale-105"
          >
            Créer mon compte gratuitement
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          </button>

          <p className="text-sm text-gray-500 mt-4">
            ✓ Gratuit et sans engagement • ✓ Configuration en 2 minutes
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              100% Sécurisé
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Vos données sont cryptées et protégées selon les normes les plus
              strictes. Conformité RGPD garantie.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Rapide et Simple
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Interface intuitive pour effectuer vos déclarations en quelques
              minutes. Gain de temps assuré.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Suivi Complet
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Accédez à l'historique de vos déclarations et suivez leur
              traitement en temps réel.
            </p>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-24 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">
              Prêt à commencer vos déclarations ?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'assujettis qui utilisent déjà DigiPublic
              pour simplifier leurs démarches administratives.
            </p>
            <button className="group inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Créer mon compte maintenant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 DigiPublic - Service officiel de déclarations en ligne
          </p>
          <p className="text-gray-500 text-xs mt-2">Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
