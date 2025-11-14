"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

export default function AnimatedGradientBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const baseBackground = isDark ? "#243147" : "#f4f7ff";
  const gradientStyle = useMemo(
    () =>
      isDark
        ? `
            radial-gradient(600px at 30% 20%, rgba(4,137,150,0.25), transparent 70%),
            radial-gradient(800px at 80% 70%, rgba(4,137,150,0.15), transparent 80%)
          `
        : `
            radial-gradient(720px at 20% 20%, rgba(53,132,255,0.22), transparent 70%),
            radial-gradient(860px at 80% 60%, rgba(14,165,233,0.18), transparent 80%)
          `,
    [isDark]
  );

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
          isDark ? "opacity-[0.35] blur-3xl" : "opacity-[0.5] blur-2xl"
        } animate-premiumGradient`}
        style={{
          background: gradientStyle,
          mixBlendMode: isDark ? "normal" : "multiply",
          transform: "translate3d(0,0,0)",
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
