"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type MobileStepperProps = {
  currentStep: number;
  stepsCount: number;
  steps: Array<{ id: string; title: string }>;
};

export default function MobileStepper({
  currentStep,
  stepsCount,
  steps,
}: MobileStepperProps) {
  return (
    <div className="flex justify-between items-center w-full mb-6 px-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Cercle de l'étape */}
            <div className="flex flex-col items-center flex-1 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all relative z-10 ${
                  isCompleted
                    ? "bg-primary text-white shadow-lg"
                    : isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/30 shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </motion.div>
              {/* Ligne de connexion */}
              {index < stepsCount - 1 && (
                <div
                  className={`absolute top-5 left-[50%] w-full h-0.5 ${
                    isCompleted ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  style={{ width: "calc(100% - 2.5rem)", marginLeft: "2.5rem" }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
