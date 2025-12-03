"use client";

import { useState, useRef } from "react";
import { Check, Upload, X, FileText } from "lucide-react";
import { usePaymentStore } from "@/store/paymentStore";

/**
 * OtherPaymentForm - Formulaire pour upload de preuve de paiement
 * Champs : Upload proof (image/PDF), Transaction reference, Notes (optional)
 */

export default function OtherPaymentForm() {
  const { formOther, setFormOther } = usePaymentStore();
  const [touched, setTouched] = useState({
    proofFile: false,
    reference: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      const isValidType =
        file.type.startsWith("image/") || file.type === "application/pdf";
      if (!isValidType) {
        alert("Veuillez sélectionner une image ou un fichier PDF");
        return;
      }
      setFormOther({ proofFile: file });
      setTouched((prev) => ({ ...prev, proofFile: true }));
    }
  };

  const handleRemoveFile = () => {
    setFormOther({ proofFile: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReferenceChange = (value: string) => {
    setFormOther({ reference: value });
    setTouched((prev) => ({ ...prev, reference: true }));
  };

  const handleNotesChange = (value: string) => {
    setFormOther({ notes: value });
  };

  const getFileIcon = () => {
    if (!formOther.proofFile) return null;
    if (formOther.proofFile.type === "application/pdf") {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <Upload className="w-5 h-5 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-5">
      {/* Upload Proof */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preuve de paiement <span className="text-red-500">*</span>
        </label>
        {!formOther.proofFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Cliquez pour télécharger
            </p>
            <p className="text-xs text-gray-500">
              Image (JPG, PNG) ou PDF (max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-green-500 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {formOther.proofFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(formOther.proofFile.size)}
                  </p>
                </div>
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
              <button
                onClick={handleRemoveFile}
                className="ml-3 p-1 hover:bg-red-100 rounded-full transition-colors"
                type="button"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Reference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Référence de transaction <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formOther.reference}
            onChange={(e) => handleReferenceChange(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, reference: true }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              touched.reference && formOther.reference.trim() !== ""
                ? "border-green-500 focus:ring-green-200"
                : touched.reference
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            placeholder="TRX-123456789"
          />
          {touched.reference && formOther.reference.trim() !== "" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
      </div>

      {/* Notes (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optionnel)
        </label>
        <textarea
          value={formOther.notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all resize-none"
          placeholder="Ajoutez des informations supplémentaires si nécessaire..."
        />
      </div>
    </div>
  );
}
