"use client";

import Header from "./components/header";
import MobileHeader from "./components/MobileHeader";
import FooterComponent from "./components/footer";
import { ThemeSync } from "./components/ThemeSync";

export default function MainPublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeSync>
      <div className="min-h-screen text-neutral-900 flex flex-col">
        <MobileHeader />
        <Header />
        <main className="flex-1 ">{children}</main>
        <FooterComponent />
      </div>
    </ThemeSync>
  );
}
