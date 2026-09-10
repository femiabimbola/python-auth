import * as z from "zod";

export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
}

export enum WorkplaceType {
  ONSITE = "ONSITE",
  HYBRID = "HYBRID",
  REMOTE = "REMOTE",
}

export enum SalaryCurrency {
  NGN = "NGN",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export const contactSchema = z.object({
  phone_number: z.string()
    .min(1, "Phone number is required.")
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format."),
  country: z.string().min(1, "Country is required."),
  state: z.string().min(2, "State is required."),
  city: z.string().min(1, "City is required."),
});

export const professionalSchema = z.object({
  headline: z.string()
    .min(1, "Headline is required.")
    .max(200, "Headline must be less than 200 characters."),
  summary: z.string()
    .max(2000, "Summary must be less than 2000 characters.")
    .optional(),
  years_of_experience: z.coerce.number()
    .min(0, "Years of experience must be 0 or more.")
    .max(50, "Years of experience must be 50 or less.")
    .nullable(),
});

// Base shape for preferences before refinement
export const preferencesSchema = z.object({
  preferred_job_type: z.enum(JobType).nullable(),
  preferred_workplace_type: z.enum(WorkplaceType).nullable(),
  preferred_salary_min: z.coerce.number()
    .min(0, "Minimum salary must be 0 or more.")
    .nullable(),
  preferred_salary_max: z.coerce.number()
    .min(0, "Maximum salary must be 0 or more.")
    .nullable(),
  preferred_salary_currency: z.enum(SalaryCurrency),
  is_open_to_remote: z.boolean().default(true),
  is_open_to_relocation: z.boolean().default(false),
}).refine((data) => {
  if (data.preferred_salary_min && data.preferred_salary_max) {
    return data.preferred_salary_max >= data.preferred_salary_min;
  }
  return true;
}, {
  message: "Maximum salary must be greater than or equal to minimum salary.",
  path: ["preferred_salary_max"],
});

export const mediaSchema = z.object({
  resume_url: z.url("Invalid URL.").optional().or(z.literal("")),
  profile_image_url: z.url("Invalid URL.").optional().or(z.literal("")),
  is_profile_public: z.boolean().default(true),
});

// ✅ Correct non-deprecated way: Use .extend(Schema.shape)
export const jobSeekerSchema = contactSchema
  .extend(professionalSchema.shape)
  .extend(preferencesSchema.shape)
  .extend(mediaSchema.shape)
  .refine((data) => {
    if (data.preferred_salary_min && data.preferred_salary_max) {
      return data.preferred_salary_max >= data.preferred_salary_min;
    }
    return true;
  }, {
    message: "Maximum salary must be greater than or equal to minimum salary.",
    path: ["preferred_salary_max"],
  });

export type JobSeekerFormData = z.infer<typeof jobSeekerSchema>;

export const stepSchemas = [
  contactSchema,
  professionalSchema,
  preferencesSchema,
  mediaSchema,
] as const;

export const stepNames = [
  "Contact & Identity",
  "Professional Info",
  "Work Preferences",
  "Media & Visibility",
] as const;