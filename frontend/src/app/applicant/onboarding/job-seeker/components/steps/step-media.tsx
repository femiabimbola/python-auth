"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FileText, Image, Eye, EyeOff } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { JobSeekerFormData } from "./../../schema";

export function StepMedia() {
  const { control, watch } = useFormContext<JobSeekerFormData>();
  const isPublic = watch("is_profile_public");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
          <FileText className="w-4 h-4 text-zinc-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Media & Visibility</h3>
          <p className="text-xs text-zinc-500">Upload resume and manage profile visibility</p>
        </div>
      </div>

      <Controller
        name="resume_url"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Resume URL</FieldLabel>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                type="url"
                placeholder="https://your-resume-link.pdf"
                className="pl-9"
                aria-invalid={fieldState.invalid}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Link to your resume on S3, Cloudflare, or Google Drive
            </p>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="profile_image_url"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Profile Image URL</FieldLabel>
            <div className="relative">
              <Image className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                {...field}
                id={field.name}
                type="url"
                placeholder="https://your-image-url.jpg"
                className="pl-9"
                aria-invalid={fieldState.invalid}
              />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Professional headshot or avatar image
            </p>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="pt-2">
        <Controller
          name="is_profile_public"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {isPublic ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  Profile Visibility
                </div>
                <p className="text-xs text-zinc-500">
                  {isPublic
                    ? "Your profile is visible to employers and recruiters"
                    : "Your profile is hidden from public view"}
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