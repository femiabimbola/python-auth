"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
  Briefcase,
  Building2,
  Wallet,
  Monitor,
  Plane,
  ArrowRightLeft,
} from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { JobSeekerFormData, JobType, WorkplaceType, SalaryCurrency } from "./../../schema";

const jobTypeOptions = [
  { value: JobType.FULL_TIME, label: "Full Time" },
  { value: JobType.PART_TIME, label: "Part Time" },
  { value: JobType.CONTRACT, label: "Contract" },
  { value: JobType.INTERNSHIP, label: "Internship" },
  { value: JobType.FREELANCE, label: "Freelance" },
];

const workplaceOptions = [
  { value: WorkplaceType.ONSITE, label: "On-site" },
  { value: WorkplaceType.HYBRID, label: "Hybrid" },
  { value: WorkplaceType.REMOTE, label: "Remote" },
];

const currencyOptions = [
  { value: SalaryCurrency.NGN, label: "₦ NGN (Naira)" },
  { value: SalaryCurrency.USD, label: "$ USD (Dollar)" },
  { value: SalaryCurrency.EUR, label: "€ EUR (Euro)" },
  { value: SalaryCurrency.GBP, label: "£ GBP (Pound)" },
];

export function StepPreferences() {
  const { control, watch } = useFormContext<JobSeekerFormData>();
  const salaryMin = watch("preferred_salary_min");
  const salaryMax = watch("preferred_salary_max");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-zinc-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Work Preferences</h3>
          <p className="text-xs text-zinc-500">Set your ideal job criteria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="preferred_job_type"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Preferred Job Type</FieldLabel>
              <Select
                onValueChange={(val) => field.onChange(val as JobType)}
                value={field.value || undefined}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <Briefcase className="w-4 h-4 mr-2 text-zinc-400" />
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="preferred_workplace_type"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Workplace Type</FieldLabel>
              <Select
                onValueChange={(val) => field.onChange(val as WorkplaceType)}
                value={field.value || undefined}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <Building2 className="w-4 h-4 mr-2 text-zinc-400" />
                  <SelectValue placeholder="Select workplace" />
                </SelectTrigger>
                <SelectContent>
                  {workplaceOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Field>
        <FieldLabel>Salary Expectations</FieldLabel>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-start">
          <Controller
            name="preferred_salary_min"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  type="number"
                  placeholder="Min (kobo)"
                  aria-invalid={fieldState.invalid}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />
          <div className="hidden md:flex items-center justify-center h-10 text-zinc-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <Controller
            name="preferred_salary_max"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  {...field}
                  type="number"
                  placeholder="Max (kobo)"
                  aria-invalid={fieldState.invalid}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>
            )}
          />
        </div>
      </Field>

      <Controller
        name="preferred_salary_currency"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Select
              onValueChange={(val) => field.onChange(val as SalaryCurrency)}
              value={field.value}
            >
              <SelectTrigger id={field.name} className="w-full md:w-[200px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="space-y-3 pt-2">
        <Controller
          name="is_open_to_remote"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Monitor className="w-4 h-4" />
                  Open to Remote Work
                </div>
                <p className="text-xs text-zinc-500">
                  Include remote positions in job recommendations
                </p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />

        <Controller
          name="is_open_to_relocation"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Plane className="w-4 h-4" />
                  Open to Relocation
                </div>
                <p className="text-xs text-zinc-500">
                  Willing to relocate for the right opportunity
                </p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}