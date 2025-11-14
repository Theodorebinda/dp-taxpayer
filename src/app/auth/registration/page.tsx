"use client";
import RegistrationLayout from "./registrationLayout";
import StepSidebar from "./StepSidebar";
import StepForm from "./StepForm";
import StepNavigation from "./StepNavigation";
import { useSignupSteps } from "./useSignupSteps";
import Loader from "@/components/atoms/loader";
import { ErrorDisplay } from "@/components/public/declaration/errorDisplay";

export default function DigiPublicSignupForm() {
  const {
    currentStep,
    steps,
    formData,
    handleValueChange,
    isStepValid,
    goNext,
    goPrevious,
    submit,
    currentFields,
    isLoading,
    isError,
    error,
  } = useSignupSteps();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600">
            {(error as Error)?.message || "Une erreur s'est produite."}
          </p>
        </div>
        <ErrorDisplay error={error as { message: string } | null} />
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <RegistrationLayout
      sidebar={
        <StepSidebar
          title={step.title}
          description={step.description}
          illustration={step.illustration}
          stepIndex={currentStep}
          stepsCount={steps.length}
        />
      }
      form={
        <StepForm
          fields={currentFields}
          formData={formData}
          onChange={handleValueChange}
        />
      }
      navigation={
        <StepNavigation
          currentStep={currentStep}
          stepsCount={steps.length}
          canProceed={isStepValid()}
          onPrevious={goPrevious}
          onNext={goNext}
          onSubmit={submit}
        />
      }
    />
  );
}
