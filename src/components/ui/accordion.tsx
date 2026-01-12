"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
}

export function AccordionItem({
  title,
  icon,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        <ChevronDown
          className={`size-5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0 border-t border-border/10">
          <div className="pt-4 space-y-4">{children}</div>
        </div>
      )}
    </div>
  );
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(
      items
        .map((item, index) => (item.defaultOpen ? index : -1))
        .filter((i) => i >= 0)
    )
  );

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="overflow-hidden border-b border-primary/20 rounded-lg"
        >
          <motion.button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <motion.div
                  className="text-primary"
                  animate={{ rotate: openItems.has(index) ? 360 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.div>
              )}
              <h2 className="text-xl font-semibold text-foreground">
                {item.title}
              </h2>
            </div>
            <motion.div
              animate={{ rotate: openItems.has(index) ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="size-5 text-muted-foreground" />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {openItems.has(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0">
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="pt-4 space-y-4"
                  >
                    {item.children}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
