"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";
import { ArrowRightCircle } from "lucide-react";

type StepSidebarProps = {
  title: string;
  description: string;
  list?: string[];
  illustration: string;
  stepIndex: number;
  stepsCount: number;
};

export default function StepSidebar({
  title,
  description,
  list,
  illustration,
  stepIndex,
  stepsCount,
}: StepSidebarProps) {
  // Variants pour l'animation du background
  const backgroundVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  // Variants pour l'animation du contenu texte
  const contentVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Clé unique pour forcer la réanimation lors du changement d'étape
  const stepKey = useMemo(() => `step-${stepIndex}`, [stepIndex]);

  return (
    <aside className="hidden md:flex flex-1 flex-col justify-between w-full h-full p-10 relative overflow-hidden">
      {/* Background image avec lazy loading et transition */}
      {/* <div
        className="absolute inset-0 z-1 bg-background/50 md:bg-linear-to-r md:from-background md:from-2% via-background/40 via-10% md:to-transparent transition-opacity duration-500"
        aria-hidden
      /> */}

      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${stepKey}`}
          variants={backgroundVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={illustration}
            alt={`Illustration étape ${stepIndex + 1}`}
            fill
            className="object-cover"
            loading={stepIndex === 0 ? "eager" : "lazy"}
            priority={stepIndex === 0}
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>
      <div
        className="absolute inset-0 z-1 bg-background/40 md:bg-linear-to-r md:from-background md:from-15% via-background/40 via-40% md:to-transparent"
        aria-hidden
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${stepKey}`}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative z-10 flex flex-col justify-between h-full"
        >
          {/* Section supérieure */}
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/50 border border-white/30 dark:border-white/20 shadow-lg">
                <span className="text-xl font-bold text-white">
                  {stepIndex + 1}
                </span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-3xl font-bold mb-4  drop-shadow-lg"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-base  drop-shadow-md leading-relaxed"
            >
              {description}
            </motion.p>
          </div>
          {/* Liste des étapes */}
          {list && list.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col gap-10 h-[40vh] overflow-y-auto"
            >
              {list.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex gap-2  font-medium w-4/6"
                >
                  <ArrowRightCircle
                    color="var(--primary)"
                    className="w-6 h-6 shrink-0"
                  />
                  <span className="text-xl text-primary dark:text-white font-medium drop-shadow-md">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Section inférieure avec indicateur d'étape */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="text-sm font-medium drop-shadow-md"
          >
            Étape {stepIndex + 1} sur {stepsCount}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
