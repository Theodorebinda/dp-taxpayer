"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

export default function AnimatedGradientBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const prefersDark = mounted && resolvedTheme === "dark";
  const baseBackground = prefersDark ? "var(--background)" : "var(--dp-bg)";

  const gradientStyle = useMemo(() => {
    if (!mounted) return undefined;
    // Utiliser les couleurs de la charte de l'application
    const primaryGlow = prefersDark
      ? "color-mix(in srgb, var(--primary) 32%, transparent)"
      : "color-mix(in srgb, var(--primary) 24%, transparent)";
    const accentGlow = prefersDark
      ? "color-mix(in srgb, var(--app-green-500) 20%, transparent)"
      : "color-mix(in srgb, var(--app-green-400) 18%, transparent)";

    return prefersDark
      ? `
          radial-gradient(620px at 32% 18%, ${primaryGlow}, transparent 70%),
          radial-gradient(840px at 78% 72%, ${accentGlow}, transparent 80%)
        `
      : `
          radial-gradient(720px at 22% 22%, ${primaryGlow}, transparent 72%),
          radial-gradient(900px at 82% 64%, ${accentGlow}, transparent 82%)
        `;
  }, [mounted, prefersDark]);

  const gradientClass = mounted
    ? prefersDark
      ? "opacity-60 blur-[120px]"
      : "opacity-70 blur-[100px]"
    : "opacity-0";

  return (
    <div className="relative  overflow-hidden transition-colors duration-300">
      {/* Static background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ background: baseBackground }}
      />

      {/* Animated gradient layer */}
      <div
        className={`absolute inset-0 ${gradientClass} animate-premiumGradient pointer-events-none`}
        style={{
          background: gradientStyle,
          mixBlendMode: prefersDark ? "screen" : "multiply",
          transform: "translate3d(0,0,0)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-64 w-3/4 blur-[140px] opacity-40"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--primary) 25%, transparent), transparent)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10">{children}</div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes premiumGradient {
          0% {
            transform: translate3d(0px, 0px, 0) rotate(0deg);
          }
          33% {
            transform: translate3d(40px, -20px, 0) rotate(3deg);
          }
          66% {
            transform: translate3d(-30px, 20px, 0) rotate(-2deg);
          }
          100% {
            transform: translate3d(0px, 0px, 0) rotate(0deg);
          }
        }
        .animate-premiumGradient {
          animation: premiumGradient 18s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
