"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Phone,
  MapPin,
  CreditCard,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import Input from "@/components/commons/dynamicInput";
import { ApiInputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import Loader from "@/components/atoms/loader";

export default function DigiPublicSignupForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    sex: "",
    martialStatus: "",
    originEntityId: "",
    birthDate: "",
    birthPlace: "",
    physicalAddress: "",
    identityCard: "",
    identityCardNumber: "",
  });
  const [fields, setFields] = useState<ApiInputType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchFields = async () => {
      const client = new HttpClient();
      const response: { data: ApiInputType[] } | false = await client.get(
        "/taxpayer/registration"
      );
      if (!response) {
        setError(client.error);
      } else {
        setFields(response.data);
      }
      setLoading(false);
    };

    fetchFields();
  }, []);

  const steps = [
    {
      title: "Informations personnelles",
      description: "Commençons par vos informations de base",
      icon: User,
      fields: ["category", "firstName", "middleName", "lastName", "sex"],
    },
    {
      title: "Contact",
      description: "Comment pouvons-nous vous joindre ?",
      icon: Phone,
      fields: ["mobile", "email", "password"],
    },
    {
      title: "Informations complémentaires",
      description: "Quelques détails supplémentaires",
      icon: MapPin,
      fields: [
        "martialStatus",
        "birthDate",
        "birthPlace",
        "originEntityId",
        "physicalAddress",
        "currentEntityId",
      ],
    },
    {
      title: "Pièce d'identité",
      description: "Informations sur votre document d'identité",
      icon: CreditCard,
      fields: ["identityCard", "identityCardNumber"],
    },
  ];

  const handleValueChange = (property: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [property]: value,
    }));
    // Clear submit error when user makes changes
    if (submitError) setSubmitError(null);
  };

  const getCurrentStepFields = () => {
    return fields.filter((field) =>
      steps[currentStep].fields.includes(field.property)
    );
  };

  const isStepValid = () => {
    const currentFields = getCurrentStepFields();
    return currentFields.every((field) => {
      if (field.isOptional) return true;
      const value = formData[field.property];
      return value !== null && value !== undefined && value !== "";
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const client = new HttpClient();
    const response: { data: Record<string, any> } | false = await client.post(
      "/taxpayer/registration",
      formData
    );

    setSubmitting(false);

    if (!response) {
      // Handle error - formData is preserved
      setSubmitError(
        client.error?.message ||
          "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer."
      );
    } else {
      // Handle success
      setSuccess(true);
    }
  };

  const handleNewAccount = () => {
    setSuccess(false);
    setCurrentStep(0);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      sex: "",
      martialStatus: "",
      originEntityId: "",
      birthDate: "",
      birthPlace: "",
      physicalAddress: "",
      identityCard: "",
      identityCardNumber: "",
    });
  };

  const StepIcon = steps[currentStep].icon;

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Success Modal
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full translate-y-20 -translate-x-20"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compte créé avec succès ! 🎉
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Bienvenue sur DigiPublic, {formData.firstName} ! Votre compte a
              été créé et vous pouvez maintenant commencer vos déclarations.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Se connecter maintenant
              </button>
              <button
                onClick={handleNewAccount}
                className="w-full bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Créer un autre compte
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DigiPublic
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      index < currentStep
                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg"
                        : index === currentStep
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-110 shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium text-center transition-colors ${
                      index === currentStep
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    Étape {index + 1}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                      index < currentStep
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">
                  Erreur de soumission
                </h3>
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
              <button
                onClick={() => setSubmitError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          {/* Step Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            {getCurrentStepFields().map((field) => (
              <div
                key={field.property}
                //className="transform transition-all hover:scale-[1.01]"
              >
                <Input
                  {...field}
                  value={formData[field.property]}
                  setValue={(value) => handleValueChange(field.property, value)}
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Précédent
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isStepValid()
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || submitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isStepValid() && !submitting
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Créer mon compte
                  </>
                )}
              </button>
            )}
          </div>

          {/* Step Indicator */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Étape {currentStep + 1} sur {steps.length}
            </p>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{" "}
            <button className="text-indigo-600 font-semibold hover:underline transition-all">
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
