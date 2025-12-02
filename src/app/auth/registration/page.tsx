"use client";
import NextLink from "next/link";
import StepSidebar from "./components/StepSidebar";
import StepForm from "./components/StepForm";
import StepNavigation from "./components/StepNavigation";
import { useSignupSteps } from "./components/useSignupSteps";
import Loader from "@/components/atoms/loader";
import { ErrorDisplay } from "@/components/public/declaration/errorDisplay";
import Link from "next/link";
import ThemeToggleButton from "@/components/atoms/themeToggleButton";
import Image from "next/image";
import logo from "@/../public/logo/logo-inline.png";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import banner from "@/../public/images/banner.webp";
import { motion } from "framer-motion";
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
    return <ErrorDisplay error={error as { message: string } | null} />;
  }

  const step = steps[currentStep];

  return (
    <main className="w-full relative flex items-center lg:gap-5 h-screen bg-background max-lg:flex-col-reverse">
      <div className="absolute md:left-5 px-2 md:mx-0   top-5  lg:left-30 z-30 flex w-full md:w-90 md:px-5 justify-between items-center gap-8 md:justify-start">
        <Link
          href="/"
          className="inline-flex  items-center gap-2 rounded-full   py-1.5 font-medium text-foreground  w-60 h-12 transition hover:text-primary"
        >
          <Image
            src={logo}
            alt="digipublic logo"
            width={120}
            height={40}
            className="h-6 md:h-10 w-auto"
          />
        </Link>
        <div className="md:hidden">
          <ThemeSwitcher />
        </div>
        <div className="hidden md:block">
          <ThemeToggleButton className="w-18" />
        </div>
      </div>

      <div className="w-full max-lg:h-full flex lg:items-center items-start justify-center p-5 max-lg:bg-background/80 z-10 ">
        <div className="lg:p-10 p-5 w-3/4 max-lg:w-full flex flex-col gap-4 rounded-xl z-10 backdrop-blur-lg dark:bg-background/10 shadow-lg">
          <span className="text-2xl font-bold mb-4  drop-shadow-lg text-primary uppercase tracking-wide text-center ">
            Créer un compte
          </span>
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 ">
            <StepForm
              fields={currentFields}
              formData={formData}
              onChange={handleValueChange}
              stepKey={currentStep}
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
      <div className="relative flex w-full h-full max-lg:hidden">
        <StepSidebar
          title={step.title}
          description={step.description}
          list={step.list}
          illustration={step.illustration}
          stepIndex={currentStep}
          stepsCount={steps.length}
        />
      </div>
    </main>
  );
}
