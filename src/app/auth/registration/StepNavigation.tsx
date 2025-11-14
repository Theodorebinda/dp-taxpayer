"use client";

import { Button } from "@/components/ui";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type StepNavigationProps = {
  currentStep: number;
  stepsCount: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

export default function StepNavigation({
  currentStep,
  stepsCount,
  canProceed,
  onPrevious,
  onNext,
  onSubmit,
}: StepNavigationProps) {
  const isLast = currentStep === stepsCount - 1;
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
          currentStep === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md cursor-not-allowed"
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        Précédent
      </button>

      {!isLast ? (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            canProceed
              ? "bg-primary text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-200  cursor-not-allowed"
          }`}
        >
          Suivant
          <ArrowRight className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
            canProceed
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Check className="w-5 h-5" />
          Créer mon compte
        </Button>
      )}
    </div>
  );
}
