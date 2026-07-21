"use client";

import { useState, useCallback, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";

import { JobSeekerFormData, jobSeekerSchema, stepSchemas, stepNames, SalaryCurrency } from "./../schema";
import { StepIndicator } from "./step-indicator";
import { StepContact } from "./steps/step-contact";
import { StepProfessional } from "./steps/step-professional";
import { StepPreferences } from "./steps/step-preferences";
import { StepMedia } from "./steps/step-media";
import { StepReview } from "./steps/step-review";

const steps = [
  StepContact,
  StepProfessional,
  StepPreferences,
  StepMedia,
  StepReview,
];

const defaultValues: JobSeekerFormData = {
  phone_number: "",
  country: "",
  state: "",
  city: "",
  headline: "",
  summary: "",
  years_of_experience: null,
  preferred_job_type: null,
  preferred_workplace_type: null,
  preferred_salary_min: null,
  preferred_salary_max: null,
  preferred_salary_currency: SalaryCurrency.NGN,
  is_open_to_remote: true,
  is_open_to_relocation: false,
  resume_url: "",
  profile_image_url: "",
  is_profile_public: true,
};

export function JobSeekerForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const form = useForm<JobSeekerFormData>({
    resolver: zodResolver(jobSeekerSchema),
    defaultValues,
    mode: "onChange",
  });

  const CurrentStepComponent = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const validateCurrentStep = useCallback(async () => {
    const currentSchema = stepSchemas[currentStep];
    const fields = Object.keys(currentSchema.shape) as Array<keyof JobSeekerFormData>;
    const result = await form.trigger(fields);
    return result;
  }, [currentStep, form]);

  const handleNext = useCallback(async () => {
    if (isLastStep) return;

    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  }, [isLastStep, validateCurrentStep]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [isFirstStep]);

  const handleSubmit = useCallback(
    async (data: JobSeekerFormData) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSubmitting(true);

      try {
        const response = await fetch("/api/job-seeker/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: controller.signal,
          credentials: "include",
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || errData.message || "Failed to create profile.");
        }

        toast.success("Profile created successfully!", {
          description: "Your job seeker profile has been saved.",
        });

        form.reset(defaultValues);
        setCurrentStep(0);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        const message =
          error instanceof Error
            ? error.message
            : "Failed to connect to the server.";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form]
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <StepIndicator steps={[...stepNames, "Review"]} currentStep={currentStep} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    {currentStep < stepNames.length
                      ? stepNames[currentStep]
                      : "Review & Submit"}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
                <div className="text-sm text-zinc-400 font-medium">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </div>
              </div>
              <div className="w-full bg-zinc-100 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </CardHeader>

            <CardContent className="min-h-[380px]">
              <CurrentStepComponent />
            </CardContent>

            <CardFooter className="flex justify-between pt-5 border-t bg-zinc-50/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isFirstStep || isSubmitting}
                className="gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {isLastStep ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-1.5 min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Profile
                    </>
                  )}
                </Button>
              ) : (
                <Button type="button" onClick={handleNext} className="gap-1.5">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}