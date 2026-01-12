"use client";

import { useEffect, useRef, useState } from "react";

export function useActiveSection(sectionsLength: number) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, sectionsLength);
  }, [sectionsLength]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      let closest = 0;
      let closestDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { activeIndex, sectionRefs };
}
