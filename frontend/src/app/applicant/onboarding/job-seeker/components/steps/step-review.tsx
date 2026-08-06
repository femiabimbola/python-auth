"use client";

import { useFormContext } from "react-hook-form";
import {
  Phone,
  MapPin,
  Globe,
  Briefcase,
  FileText,
  Clock,
  Wallet,
  Building2,
  Monitor,
  Plane,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { JobSeekerFormData, JobType, WorkplaceType, SalaryCurrency } from "./../../schema";
import { cn } from "@/lib/utils";

interface ReviewItem {
  label: string;
  value: string | number | boolean | null | undefined;
  fullWidth?: boolean;
  isLink?: boolean;
}

interface ReviewSection {
  title: string;
  icon: React.ReactNode;
  items: ReviewItem[];
}

const jobTypeLabels: Record<string, string> = {
  [JobType.FULL_TIME]: "Full Time",
  [JobType.PART_TIME]: "Part Time",
  [JobType.CONTRACT]: "Contract",
  [JobType.INTERNSHIP]: "Internship",
  [JobType.FREELANCE]: "Freelance",
};

const workplaceLabels: Record<string, string> = {
  [WorkplaceType.ONSITE]: "On-site",
  [WorkplaceType.HYBRID]: "Hybrid",
  [WorkplaceType.REMOTE]: "Remote",
};

const currencySymbols: Record<string, string> = {
  [SalaryCurrency.NGN]: "₦",
  [SalaryCurrency.USD]: "$",
  [SalaryCurrency.EUR]: "€",
  [SalaryCurrency.GBP]: "£",
};

export function StepReview() {
  const { watch } = useFormContext<JobSeekerFormData>();
  const data = watch();

  const sections: ReviewSection[] = [
    {
      title: "Contact & Identity",
      icon: <Phone className="w-4 h-4" />,
      items: [
        { label: "Phone", value: data.phone_number },
        { label: "Country", value: data.country },
        { label: "State", value: data.state },
        { label: "City", value: data.city },
      ],
    },
    {
      title: "Professional Info",
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { label: "Headline", value: data.headline },
        {
          label: "Experience",
          value: data.years_of_experience
            ? `${data.years_of_experience} years`
            : "Not specified",
        },
        {
          label: "Summary",
          value: data.summary || "Not provided",
          fullWidth: true,
        },
      ],
    },
    {
      title: "Work Preferences",
      icon: <Wallet className="w-4 h-4" />,
      items: [
        {
          label: "Job Type",
          value: data.preferred_job_type
            ? jobTypeLabels[data.preferred_job_type]
            : "Not specified",
        },
        {
          label: "Workplace",
          value: data.preferred_workplace_type
            ? workplaceLabels[data.preferred_workplace_type]
            : "Not specified",
        },
        { label: "Salary Range", value: formatSalary(data) },
        { label: "Remote", value: data.is_open_to_remote ? "Yes" : "No" },
        { label: "Relocation", value: data.is_open_to_relocation ? "Yes" : "No" },
      ],
    },
    {
      title: "Media & Visibility",
      icon: <Eye className="w-4 h-4" />,
      items: [
        {
          label: "Resume",
          value: data.resume_url || "Not provided",
          isLink: !!data.resume_url,
        },
        {
          label: "Profile Image",
          value: data.profile_image_url || "Not provided",
          isLink: !!data.profile_image_url,
        },
        {
          label: "Visibility",
          value: data.is_profile_public ? "Public" : "Private",
        },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-zinc-700" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Review Your Profile</h3>
          <p className="text-xs text-zinc-500">Verify all information before submitting</p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border border-zinc-200 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
              <span className="text-zinc-500">{section.icon}</span>
              <span className="text-sm font-semibold text-zinc-900">
                {section.title}
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "space-y-0.5",
                    item.fullWidth && "md:col-span-2"
                  )}
                >
                  <div className="text-[11px] uppercase tracking-wide text-zinc-400 font-medium">
                    {item.label}
                  </div>
                  {item.isLink && item.value !== "Not provided" ? (
                    <a
                      href={item.value as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-900 hover:underline break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className={cn(
                        "text-sm",
                        !item.value ||
                          item.value === "Not provided" ||
                          item.value === "Not specified"
                          ? "text-zinc-400 italic"
                          : "font-medium text-zinc-900"
                      )}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Please review all information carefully. You can go back to any step to make changes before submitting.
        </p>
      </div>
    </div>
  );
}

function formatSalary(data: JobSeekerFormData): string {
  if (!data.preferred_salary_min && !data.preferred_salary_max)
    return "Not specified";
  const symbol = currencySymbols[data.preferred_salary_currency] || "₦";
  const min = data.preferred_salary_min
    ? `${symbol}${data.preferred_salary_min.toLocaleString()}`
    : "";
  const max = data.preferred_salary_max
    ? `${symbol}${data.preferred_salary_max.toLocaleString()}`
    : "";
  if (min && max) return `${min} – ${max}`;
  return min || max;
}