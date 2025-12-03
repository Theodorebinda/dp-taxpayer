"use client";
import NextLink from "next/link";
import StepSidebar from "./components/StepSidebar";
import StepForm from "./components/StepForm";
import StepNavigation from "./components/StepNavigation";
import MobileStepper from "./components/MobileStepper";
import { useSignupSteps } from "./components/useSignupSteps";
import Loader from "@/components/atoms/loader";
import { ErrorDisplay } from "@/components/public/declaration/errorDisplay";
import Link from "next/link";
import ThemeToggleButton from "@/components/atoms/themeToggleButton";
import Image from "next/image";
import logo from "@/../public/logo/logo-inline.png";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { motion, AnimatePresence } from "framer-motion";
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
      {/* Header avec logo et theme toggle */}
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

      {/* Mobile: Background avec image de l'étape */}
      <div className="lg:hidden fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-bg-${currentStep}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={step.illustration}
              alt={`Illustration étape ${currentStep + 1}`}
              fill
              className="object-cover"
              priority={currentStep === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>

      {/* Contenu principal */}
      <div className="w-full max-lg:h-full py-5 max-lg:px-10 flex lg:items-center max-lg:items-center items-start justify-center max-lg:justify-center p-5   max-lg:bg-transparent z-10 relative max-lg:overflow-y-auto">
        <div className="w-full lg:p-10   max-lg:w-full  lg:w-3/4 flex flex-col gap-4 rounded-xl z-10  bg-background/10 dark:bg-app-blue-700  lg:shadow-lg">
          {/* Mobile: Stepper */}
          <div className="lg:hidden mb-4">
            <MobileStepper
              currentStep={currentStep}
              stepsCount={steps.length}
              steps={steps.map((s) => ({ id: s.id, title: s.title }))}
            />
          </div>

          {/* Mobile: Titre et description de l'étape */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-header-${currentStep}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mb-4"
            >
              <h1 className="text-2xl font-bold mb-2 drop-shadow-lg text-foreground">
                {step.title}
              </h1>
              <p className="text-sm text-muted-foreground drop-shadow-md leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Titre principal (desktop) */}
          <span className="hidden lg:block text-2xl font-bold mb-4  drop-shadow-lg text-primary uppercase tracking-wide text-center ">
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

      {/* RIGHT: Étapes / Sidebar (Desktop uniquement) */}
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
