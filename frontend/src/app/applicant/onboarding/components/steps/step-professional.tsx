"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Briefcase, Clock, FileText } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JobSeekerFormData } from "../../schema";
import { cn } from "@/lib/utils";

export function StepProfessional() {
  const { control, watch } = useFormContext<JobSeekerFormData>();
  const summary = watch("summary") || "";
  const maxChars = 2000;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-zinc-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Professional Information</h3>
          <p className="text-xs text-zinc-500">Showcase your professional background</p>
        </div>
      </div>

      <Controller
        name="headline"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Professional Headline</FieldLabel>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                placeholder="Senior Python Developer"
                className="pl-9"
                aria-invalid={fieldState.invalid}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              A compelling headline appears in search results
            </p>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="years_of_experience"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Years of Experience</FieldLabel>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                type="number"
                min={0}
                max={50}
                placeholder="5"
                className="pl-9"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="summary"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Professional Summary</FieldLabel>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Textarea
                {...field}
                id={field.name}
                placeholder="Tell employers about your background, skills, and career goals..."
                className="pl-9 min-h-[120px] resize-none"
                maxLength={maxChars}
                aria-invalid={fieldState.invalid}
              />
            </div>
            <div className="flex justify-between mt-1">
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <span
                className={cn(
                  "text-xs ml-auto",
                  summary.length > maxChars * 0.9
                    ? "text-amber-600"
                    : "text-zinc-400"
                )}
              >
                {summary.length}/{maxChars}
              </span>
            </div>
          </Field>
        )}
      />
    </div>
  );
}