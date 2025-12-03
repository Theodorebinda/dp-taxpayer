"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { usePaymentStore } from "@/store/paymentStore";

/**
 * EasyPayForm - Formulaire de paiement EasyPay (style PayPal/carte bancaire)
 * Champs : Full Name, Email, Phone, Amount (read-only)
 */

interface EasyPayFormProps {
  amount: number;
}

export default function EasyPayForm({ amount }: EasyPayFormProps) {
  const { formEasyPay, setFormEasyPay } = usePaymentStore();
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
  });

  const handleChange = (field: keyof typeof formEasyPay, value: string) => {
    setFormEasyPay({ [field]: value });
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPhoneValid = (phone: string) => {
    return phone.trim().length >= 8;
  };

  const getFieldStatus = (field: keyof typeof formEasyPay) => {
    if (!touched[field as keyof typeof touched]) return null;
    const value = formEasyPay[field];
    if (field === "email") {
      return value && isEmailValid(value as string) ? "valid" : "invalid";
    }
    if (field === "phone") {
      return value && isPhoneValid(value as string) ? "valid" : "invalid";
    }
    return value && (value as string).trim() !== "" ? "valid" : "invalid";
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formEasyPay.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              getFieldStatus("fullName") === "valid"
                ? "border-green-500 focus:ring-green-200"
                : getFieldStatus("fullName") === "invalid"
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="Jean Dupont"
          />
          {getFieldStatus("fullName") === "valid" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            value={formEasyPay.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              getFieldStatus("email") === "valid"
                ? "border-green-500 focus:ring-green-200"
                : getFieldStatus("email") === "invalid"
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="jean.dupont@example.com"
          />
          {getFieldStatus("email") === "valid" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            value={formEasyPay.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              getFieldStatus("phone") === "valid"
                ? "border-green-500 focus:ring-green-200"
                : getFieldStatus("phone") === "invalid"
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="+243 900 000 000"
          />
          {getFieldStatus("phone") === "valid" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Montant
        </label>
        <div className="relative">
          <input
            type="text"
            value={`${amount.toLocaleString()} CDF`}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Montant total à payer (non modifiable)
        </p>
      </div>
    </div>
  );
}
