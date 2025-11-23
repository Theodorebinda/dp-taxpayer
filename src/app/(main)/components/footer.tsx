"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Send,
  ChevronRight,
} from "lucide-react";
import logoDp from "@/../public/logo/icon.png";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function FooterComponent() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const isDarkTheme = mounted ? resolvedTheme === "dark" : false;
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simuler l'abonnement
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    produit: [
      { name: "Fonctionnalités", href: "/maintenance" },
      { name: "Tarifs", href: "/maintenance" },
      { name: "API", href: "/maintenance" },
      { name: "Intégrations", href: "/maintenance" },
    ],
    legal: [
      { name: "Confidentialité", href: "/maintenance" },
      { name: "Conditions d'utilisation", href: "/maintenance" },
      { name: "Mentions légales", href: "/maintenance" },
      { name: "Cookies", href: "/maintenance" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    // { name: "GitHub", icon: Github, href: "https://github.com" },
  ];

  const mutedTextClass = isDarkTheme ? "text-white/70" : "text-slate-600";
  const strongTextClass = isDarkTheme ? "text-white" : "text-slate-900";
  const inputSurfaceClass = isDarkTheme
    ? "bg-white/10 border-white/20 text-white placeholder-white/60"
    : "bg-white border-slate-300 text-slate-800 placeholder-slate-400";
  const socialBg = isDarkTheme
    ? "bg-white/15 hover:bg-white/25"
    : "bg-white hover:bg-[var(--primary)] hover:text-white";

  return (
    <footer
      className="relative overflow-hidden text-slate-800 dark:text-white/90"
      style={{
        backgroundColor: isDarkTheme
          ? "var(--app-blue-900)"
          : "var(--bg-secondary)",
      }}
    >
      <div className="layout-shell relative py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Image
                      src={logoDp}
                      alt="DigiPublic Logo"
                      width={40}
                      height={40}
                    />
                  </div>
                  <span className="text-xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    DigiPublic
                  </span>
                </motion.div>
              </Link>

              <p
                className={`${mutedTextClass} max-w-md text-lg leading-relaxed`}
              >
                La plateforme moderne pour simplifier vos démarches fiscales.
                Inscription, déclaration et suivi centralisés.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${strongTextClass}`}>
                Restez informé
              </h3>
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/15 border border-green-500/30 rounded-lg p-4 text-sm text-green-100"
                >
                  ✅ Merci ! Vous êtes maintenant abonné à notre newsletter.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre email"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${inputSurfaceClass}`}
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary/70 rounded-lg font-medium transition-colors flex items-center gap-2 text-text"
                  >
                    <Send className="w-4 h-4" />
                    S&apos;abonner
                  </motion.button>
                </form>
              )}
              <p className={`${mutedTextClass} text-sm`}>
                Recevez les dernières actualités et mises à jour.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <div className={`flex items-center gap-3 ${mutedTextClass}`}>
                <Phone className="w-5 h-5 text-primary" />
                <span>+243 99 123 45 67</span>
              </div>
              <div className={`flex items-center gap-3 ${mutedTextClass}`}>
                <Mail className="w-5 h-5 text-primary" />
                <span>contact@digipublic.cd</span>
              </div>
              <div className={`flex items-start gap-3 ${mutedTextClass}`}>
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span>
                  123 Rue de la République
                  <br />
                  75011 Kinshasa, Congo
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h3 className={`font-semibold capitalize ${strongTextClass}`}>
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`${mutedTextClass} hover:text-primary dark:hover:text-white transition-colors group flex items-center gap-1`}
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          className="pt-8"
          style={{
            borderTop: isDarkTheme
              ? "1px solid rgba(255,255,255,0.3)"
              : "1px solid rgba(15,23,42,0.15)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className={`${mutedTextClass} text-sm`}>
              © {new Date().getFullYear()} DigiPublic. Tous droits réservés.
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors group ${socialBg}`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-slate-500 dark:text-white/80 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>

            {/* Additional links */}
            <div
              className={`flex items-center gap-6 text-sm ${mutedTextClass}`}
            >
              <Link
                href="/privacy"
                className="hover:text-primary dark:hover:text-white transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary dark:hover:text-white transition-colors"
              >
                Conditions
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-primary dark:hover:text-white transition-colors"
              >
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
