"use client";

import { useState } from "react";
import { FiCheck, FiCopy, FiSend } from "react-icons/fi";

interface EmailCopyProps {
  email: string;
}

export const EmailCopy: React.FC<EmailCopyProps> = ({ email }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  if (email == null || email.length === 0) return null;

  return (
    <span className="text-nowrap flex items-center gap-2 py-1 px-2 bg-bg-secondary rounded w-full">
      <span className="border-r border-background pr-2 w-full flex justify-between">
        <span className="w-full">{email}</span>
        <button
          onClick={handleCopy}
          className="p-1 hover:scale-125 rounded transition-colors py-1 px-2"
          aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
        >
          {isCopied ? (
            <FiCheck className="w-4 h-4 text-primary" />
          ) : (
            <FiCopy className="w-4 h-4" />
          )}
        </button>
      </span>
      <button
        onClick={handleSendEmail}
        className="hover:scale-125 rounded transition-colors py-1 px-2 bg-bg-secondary text-primary"
        aria-label="Send email"
      >
        <FiSend className="w-5 h-5" />
      </button>
    </span>
  );
};
