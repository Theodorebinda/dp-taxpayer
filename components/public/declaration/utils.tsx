import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { FormStep } from "./types";
import Form from "@/components/form/form";

export const ProgressBar: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          Étape {currentStep + 1} sur {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progress)}% complété
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const StepIndicator: React.FC<{
  steps: FormStep[];
  currentStep: number;
}> = ({ steps, currentStep }) => (
  <div className="flex justify-between mb-8">
    {steps.map((step, index) => (
      <div key={step.id} className="flex flex-col items-center flex-1">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
            index < currentStep
              ? "bg-primary text-white"
              : index === currentStep
              ? "bg-primary text-white ring-4 ring-primary/20"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {index < currentStep ? <CheckCircle2 size={20} /> : index + 1}
        </div>
        <span className="text-xs mt-2 text-center max-w-20 hidden md:block">
          {step.title}
        </span>
      </div>
    ))}
  </div>
);

export const NavigationButtons: React.FC<{
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}> = ({ currentStep, totalSteps, onPrevious, onNext, onSubmit }) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
      >
        <ChevronLeft size={20} />
        Précédent
      </button>

      {isLastStep ? (
        <button
          onClick={onSubmit}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all"
        >
          Soumettre
          <CheckCircle2 size={20} />
        </button>
      ) : (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all"
        >
          Continuer
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export const FormStepContent: React.FC<{
  step: FormStep;
  updateFormData: (fieldName: string, value: any) => void;
}> = ({ step, updateFormData }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold">{step.title}</h3>
    {step.description && (
      <p className="text-muted-foreground">{step.description}</p>
    )}

    <div className="space-y-4">
      <Form
        title=""
        displayHeader={false}
        inputs={step.fields || []}
        updateExternalStore={updateFormData}
      />
    </div>
  </div>
);
