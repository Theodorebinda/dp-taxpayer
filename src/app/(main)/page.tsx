"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import StickyVisualStory from "@/components/ui/StickyVisualStory";
import HeroSection from "@/components/ui/HeroSection";
import GlobeSection from "./components/GlobeSection";
import { storySections } from "@/lib/data/storieSectionData";

export default function DigiPublicLanding() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const { status } = useSession();
  const isDarkTheme = mounted ? resolvedTheme === "dark" : false;
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/list");
    }
  }, [router, status]);

  return (
    <div
      className="  text-neutral-700 "
      style={{ backgroundColor: "var(--dp-soft) dark:var(--app-blue-900)" }}
    >
      <HeroSection isDarkTheme={isDarkTheme} />

      {/* STORY SECTION */}
      <section className="max-w-7xl layout-shell mx-auto px-6 md:px-10 py-16">
        <StickyVisualStory sections={storySections} />
      </section>
      <section>
        <GlobeSection />
      </section>
    </div>
  );
}
