"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const newHeights = contentRefs.current.map((el) =>
      el ? el.scrollHeight : 0
    );
    setHeights(newHeights);
  }, [items]);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("space-y-3.5 w-full", className)}>
      {items?.map((item, index) => {
        const isOpen = index === openIndex;

        return (
          <div
            key={index}
            className={cn(
              "w-full rounded-2xl border border-border transition-all duration-300 bg-card",
              isOpen
                ? "bg-muted border-border"
                : "hover:border-foreground/25"
            )}
          >
            <div className="overflow-hidden">
              <button
                type="button"
                onClick={() => handleToggle(index)}
                className="w-full text-left p-5 sm:p-6 flex justify-between items-center gap-4 text-foreground select-none"
              >
                <h3 className="font-semibold font-heading leading-snug text-base sm:text-lg md:text-xl flex items-center gap-3">
                  <span className="text-primary font-bold">Q.</span>
                  {item.question}
                </h3>
                
                <span
                  className={cn(
                    "flex items-center justify-center shrink-0 w-8 h-8 rounded-full border border-border text-foreground transition-transform duration-300",
                    isOpen ? "rotate-180 bg-primary text-primary-foreground border-primary" : ""
                  )}
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,15.5a1.993,1.993,0,0,1-1.414-.585L5.293,9.621,6.707,8.207,12,13.5l5.293-5.293,1.414,1.414-5.293,5.293A1.993,1.993,0,0,1,12,15.5Z" />
                  </svg>
                </span>
              </button>

              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                style={{
                  maxHeight: isOpen ? `${heights[index]}px` : "0px",
                }}
                className="transition-all duration-300 ease-in-out overflow-hidden"
              >
                <div className="px-5 sm:px-6 pb-6 pt-0 text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
