"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export const TextCopy: React.FC<{ children?: string }> = ({ children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator?.clipboard?.writeText(children || "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!children) return "-";

  return (
    <span className="text-nowrap w-fit py-1 px-2 bg-green-100 text-green-700 rounded flex items-center justify-between gap-2">
      <span className="w-full">{children}</span>
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
