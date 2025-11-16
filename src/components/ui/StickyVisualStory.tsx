"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Section = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
};

export default function StickyVisualStory({
  sections,
  stickyTop = "25%",
}: {
  sections: Section[];
  stickyTop?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, sections.length);
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = scrollY;

      // Trouver la section la plus proche du centre de l'écran
      let closestSection = 0;
      let closestDistance = Infinity;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = index;
        }
      });

      setActiveIndex(closestSection);
    };

    // Utiliser requestAnimationFrame pour la performance
    let ticking = false;
    const update = () => {
      handleScroll();
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Déclencher immédiatement
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  const imgVariants = {
    enter: { opacity: 0, y: 20, scale: 0.95 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Colonne gauche - sections défilantes */}
        <div className="space-y-8 lg:space-b-4">
          {sections.map((section, index) => (
            <section
              key={section.id}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[index] = el;
              }}
              className="min-h-[20vh] lg:min-h-[40vh] flex items-center py-8"
            >
              <motion.div
                initial={false}
                animate={{
                  opacity:
                    index === activeIndex ? 1 : index < activeIndex ? 0.7 : 0.4,
                  y: index === activeIndex ? 0 : index < activeIndex ? -10 : 10,
                }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-xl"
              >
                <div className="text-sm font-semibold text-blue-600 mb-4">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {section.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {section.description}
                </p>
              </motion.div>
            </section>
          ))}
        </div>

        {/* Colonne droite - image sticky */}
        <div className="hidden lg:block sticky" style={{ top: stickyTop }}>
          <div className="relative w-full max-w-md mx-auto">
            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sections[activeIndex]?.id}
                  variants={imgVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={sections[activeIndex]?.image || ""}
                    alt={
                      sections[activeIndex]?.imageAlt ||
                      sections[activeIndex]?.title ||
                      ""
                    }
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={activeIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Version mobile */}
        <div className="lg:hidden space-y-8 col-span-1">
          {sections.map((section, index) => (
            <div key={section.id} className="space-y-6">
              <div className="text-sm font-semibold text-blue-600">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {section.title}
              </h3>
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={section.image}
                  alt={section.imageAlt || section.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
