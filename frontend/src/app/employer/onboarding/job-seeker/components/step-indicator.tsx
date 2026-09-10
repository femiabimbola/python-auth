"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8 px-2">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isCurrent && "bg-zinc-900 border-zinc-900 text-white shadow-md",
                    !isCompleted && !isCurrent && "bg-white border-zinc-300 text-zinc-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[11px] font-medium hidden sm:block",
                    isCurrent ? "text-zinc-900 font-semibold" : "text-zinc-400"
                  )}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 bg-zinc-200 relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 bg-green-500 transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}