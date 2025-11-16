"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

export default function AnimatedGradientBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const baseBackground = isDark ? "var(--background)" : "var(--dp-bg)";
  const gradientStyle = useMemo(() => {
    const primaryGlow = "color-mix(in srgb, var(--primary) 28%, transparent)";
    const depthGlow = isDark
      ? "color-mix(in srgb, var(--app-blue-800) 24%, transparent)"
      : "color-mix(in srgb, var(--app-blue) 18%, transparent)";

    return isDark
      ? `
          radial-gradient(620px at 32% 18%, ${primaryGlow}, transparent 70%),
          radial-gradient(840px at 78% 72%, ${depthGlow}, transparent 80%)
        `
      : `
          radial-gradient(720px at 22% 22%, ${primaryGlow}, transparent 72%),
          radial-gradient(900px at 82% 64%, ${depthGlow}, transparent 82%)
        `;
  }, [isDark]);

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-300">
      {/* Static background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ background: baseBackground }}
      />

      {/* Animated gradient layer */}
      <div
        className={`absolute inset-0 ${
          isDark ? "opacity-60 blur-[120px]" : "opacity-70 blur-[100px]"
        } animate-premiumGradient`}
        style={{
          background: gradientStyle,
          mixBlendMode: isDark ? "screen" : "multiply",
          transform: "translate3d(0,0,0)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-64 w-3/4 blur-[140px] opacity-50"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--primary) 20%, transparent), transparent)",
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
