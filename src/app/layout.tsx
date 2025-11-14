import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DigiPublic — Portail contribuable",
  description:
    "Inscription, déclaration et gestion documentaire: une plateforme moderne, sécurisée et pilotée par API.",
  openGraph: {
    title: "DigiPublic",
    description:
      "Portail contribuable — formulaires dynamiques, import CSV/Excel, authentification sécurisée.",
    type: "website",
  },
  icons: {
    icon: "/logo/icon.png",
    shortcut: "/logo/icon.png",
    apple: "/logo/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
