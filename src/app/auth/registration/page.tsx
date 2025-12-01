"use client";
import NextLink from "next/link";
import StepSidebar from "./components/StepSidebar";
import StepForm from "./components/StepForm";
import StepNavigation from "./components/StepNavigation";
import { useSignupSteps } from "./components/useSignupSteps";
import Loader from "@/components/atoms/loader";
import banner from "@/../public/images/banner.webp";
import { ErrorDisplay } from "@/components/public/declaration/errorDisplay";
import { Home } from "lucide-react";

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
    isSubmitting,
  } = useSignupSteps();

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <ErrorDisplay error={error as { message: string } | null} />
      // <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      //   <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      //     <h2 className="text-2xl font-bold text-gray-900 mb-2">
      //       Erreur de chargement
      //     </h2>
      //     <p className="text-gray-600">
      //       {(error as Error)?.message || "Une erreur s'est produite."}
      //     </p>
      //   </div>
      // </div>
    );
  }

  const step = steps[currentStep];

  return (
    <main className="w-full relative flex items-center lg:gap-5 h-screen bg-background max-lg:flex-col-reverse">
      <div className="absolute left-5 top-5 z-30 flex flex-wrap items-center gap-3">
        <NextLink
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1.5  font-medium text-foreground shadow-sm backdrop-blur transition hover:border-primary/50 hover:text-primary"
        >
          <Home className="size-7" />
          Accueil
        </NextLink>
      </div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${banner.src})` }}
      ></div>

      <div className="w-full max-lg:h-full flex lg:items-center items-start justify-center p-5 max-lg:bg-background/80 z-10">
        <div className="lg:p-10 p-5 w-3/4 max-lg:w-full lg:bg-background/80 h-fit rounded-xl z-10">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            <StepForm
              fields={currentFields}
              formData={formData}
              onChange={handleValueChange}
            />
            <StepNavigation
              currentStep={currentStep}
              stepsCount={steps.length}
              canProceed={isStepValid()}
              isSubmitting={isSubmitting}
              onPrevious={goPrevious}
              onNext={goNext}
              onSubmit={submit}
            />
          </div>
          <NextLink
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-full  px-3 my-1.5 text-sm font-medium text-foreground  transition hover:text-primary"
          >
            J&apos;ai déjà un compte
          </NextLink>
        </div>
      </div>

      {/* RIGHT: Étapes / Sidebar */}
      <div className="relative flex w-full h-full max-lg:h-fit bg-background/80 max-lg:py-10 px-1">
        <StepSidebar
          title={step.title}
          description={step.description}
          illustration={step.illustration}
          stepIndex={currentStep}
          stepsCount={steps.length}
        />
      </div>
    </main>
  );
}
