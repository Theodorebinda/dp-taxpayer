"use client";

import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/commons/dynamicInput";
import { ApiInputType, ValueType } from "@/types/types";
import { useMemo } from "react";

type StepFormProps = {
  fields: ApiInputType[];
  formData: Record<string, unknown>;
  onChange: (property: string, value: ValueType) => void;
  stepKey?: string | number;
};

export default function StepForm({
  fields,
  formData,
  onChange,
  stepKey,
}: StepFormProps) {
  // Clé unique pour forcer la réanimation lors du changement d'étape
  const formKey = useMemo(
    () => stepKey ?? fields.map((f) => f.property).join("-"),
    [stepKey, fields]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={formKey}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6"
      >
        {fields.map((field, index) => (
          <motion.div key={field.property} variants={itemVariants}>
            <Input
              {...field}
              value={(formData[field.property] as ValueType) ?? ""}
              setValue={(value: ValueType) => onChange(field.property, value)}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
