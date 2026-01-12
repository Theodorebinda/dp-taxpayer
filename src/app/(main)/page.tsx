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
    <div className="text-neutral-700 bg-(--dp-bg) dark:bg-background">
      <HeroSection isDarkTheme={isDarkTheme} />

      {/* Section StickyVisualStory avec son propre background */}
      <section className="relative bg-(--dp-bg) dark:bg-background">
        <StickyVisualStory sections={storySections} />
      </section>

      <section>
        <GlobeSection />
      </section>
    </div>
  );
}
