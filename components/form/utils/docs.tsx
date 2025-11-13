"use client";
import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

interface FieldDocProps {
  content: string; // le texte d’aide en markdown
  position?: "top" | "bottom" | "left" | "right"; // position optionnelle
}

export const FieldDoc: React.FC<FieldDocProps> = ({
  content,
  position = "top",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Détermine la position dynamique de la bulle
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[position];

  return (
    <button
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <HelpCircle
        size={18}
        className="text-gray-500 hover:text-blue-500 cursor-pointer transition"
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: position === "top" ? -5 : 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? -5 : 5 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses} w-64 bg-white text-gray-800 text-sm rounded-2xl shadow-lg border border-gray-200 p-3`}
          >
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-1" {...props} />,
                strong: ({ node, ...props }) => (
                  <strong className="text-blue-600" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code
                    className="bg-gray-100 rounded px-1 text-[13px] text-gray-700"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
