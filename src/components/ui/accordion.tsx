"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <div className="">
      {items.map((item, index) => (
        <div
          key={index}
          className=" overflow-hidden border-b border-primary/20"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {item.icon && <div className="text-primary">{item.icon}</div>}
              <h2 className="text-xl font-semibold text-foreground">
                {item.title}
              </h2>
            </div>
            <ChevronDown
              className={`size-5 text-muted-foreground transition-transform duration-200 ${
                openItems.has(index) ? "rotate-180" : ""
              }`}
            />
          </button>
          {openItems.has(index) && (
            <div className="px-6 pb-6 pt-0 ">
              <div className="pt-4 space-y-4">{item.children}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
