// components/LiquidBackground.tsx
"use client";

import { useEffect, useRef } from "react";

export default function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Redimensionnement du canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Configuration des cercles
    const circles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
    }> = [];

    // Création des cercles
    for (let i = 0; i < 5; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 100,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }

    // Animation
    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      circles.forEach((circle) => {
        // Mouvement
        circle.x += circle.speedX;
        circle.y += circle.speedY;

        // Rebond sur les bords
        if (circle.x < 0 || circle.x > canvas.width) circle.speedX *= -1;
        if (circle.y < 0 || circle.y > canvas.height) circle.speedY *= -1;

        // Dessiner le cercle avec un gradient
        const gradient = ctx.createRadialGradient(
          circle.x,
          circle.y,
          0,
          circle.x,
          circle.y,
          circle.radius
        );
        gradient.addColorStop(0, circle.color);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}
