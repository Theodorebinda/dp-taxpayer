"use client";

import { StorySection } from "@/types/story-section.type";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SectionImageBlock({
  activeSection,
}: {
  activeSection: StorySection;
}) {
  const variants = {
    enter: { opacity: 0, y: 20, scale: 0.95 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <div className="sticky" style={{ top: "25%" }}>
      <div className="relative max-w-md mx-auto aspect-[4/5] overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection.id}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={activeSection.image}
              alt={activeSection.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
