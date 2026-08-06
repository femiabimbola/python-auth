"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Phone, Globe, MapPin } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { JobSeekerFormData } from "../../schema";

export function StepContact() {
  const { control } = useFormContext<JobSeekerFormData>();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
          <Phone className="w-4 h-4 text-zinc-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Contact & Identity</h3>
          <p className="text-xs text-zinc-500">How employers can reach you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="phone_number"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  type="tel"
                  placeholder="+2348012345678"
                  className="pl-9"
                  aria-invalid={fieldState.invalid}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Country</FieldLabel>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Nigeria"
                  className="pl-9"
                  aria-invalid={fieldState.invalid}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="state"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>State</FieldLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Lagos"
                  className="pl-9"
                  aria-invalid={fieldState.invalid}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>City</FieldLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Ikeja"
                  className="pl-9"
                  aria-invalid={fieldState.invalid}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}