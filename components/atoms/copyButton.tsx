"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator?.clipboard?.writeText(text || "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  if (text?.length == 0) return "-";

  return (
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
  );
};
