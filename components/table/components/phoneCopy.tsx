"use client";

import { formatPhoneNumber } from "@/utils/utils";
import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export const PhoneNumberCopy: React.FC<{ mobile?: string }> = ({ mobile }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const formattedNumber = formatPhoneNumber(mobile);
      await navigator.clipboard.writeText(formattedNumber || "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!mobile) return '---';

  return (
    <span className="text-nowrap py-1 px-2 bg-bg-secondary rounded flex items-center gap-2">
      {formatPhoneNumber(mobile)}
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-bg-primary rounded transition-colors hover:scale-125"
        aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
      >
        {isCopied ? (
          <FiCheck className="w-4 h-4 text-green-500" />
        ) : (
          <FiCopy className="w-4 h-4" />
        )}
      </button>
    </span>
  );
};
