import Image from "next/image";
import { Briefcase, ChartNoAxesCombined, Users } from "lucide-react";

import { Card } from "@/components/ui/card";


const FEATURES = [
  {
    icon: Briefcase,
    title: "Explore Top Opportunities",
    description: "Across leading companies",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Build Your Career",
    description: "With the right opportunities",
  },
  {
    icon: Users,
    title: "Connect with Employers",
    description: "Directly and easily",
  },
] as const;


function TealSwash() {
  return (
    <svg
      viewBox="0 0 100 9"
      preserveAspectRatio="none"
      className="absolute -bottom-[1.58cqw] left-0 h-[1.84cqw] w-full"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 6.2 C 28 1.2, 72 1.2, 97.5 5"
        stroke="#00ABB8"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AuthBanner() {
  return (
    <Card
      className="@container relative w-full h-full gap-0 overflow-hidden rounded-2xl border-[#E8EEF9] bg-white py-0 shadow-[0_30px_70px_-28px_rgba(16,24,40,0.30)]"
    >
      {/* soft mist gradient behind everything */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(155deg,#F3F6FD_0%,#F7FAFE_45%,#FFFFFF_78%)]"
      />

      {/* hero photo — full height, faded into the card on its left edge */}
      <div className="absolute inset-y-0 right-0 w-[56%]">
        <Image
          src="/auth/login.png"
          alt="Smiling professional woman in a blue suit holding a laptop outside a modern office building"
          fill
          sizes="(min-width: 380px) 213px, 52vw"
          className="object-cover object-left-top"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 30%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 30%)",
          }}
          priority
        />
      </div>

      {/* content */}
      <div className="relative z-10 flex flex-col px-[6.32cqw] pb-[16.84cqw] pt-[4.21cqw]">

        <h2 className="mt-[4.21cqw] text-[6.84cqw] font-bold leading-[1.22] tracking-[-0.01em] text-[#101828]">
          Your Next
          <br />
          Opportunity
          <br />
          <span className="relative inline-block">
            Awaits
            <TealSwash />
          </span>
        </h2>

        <p className="mt-[4.21cqw] max-w-[63.16cqw] text-[3.42cqw] leading-[1.6] text-[#6C727F]">
          Find great jobs, grow your career, and achieve more with{" "}
          <span className="font-semibold text-[#4A5160]">Hire Naija</span>.
        </p>

        <ul className="mt-[5.26cqw] flex flex-col gap-[3.68cqw]">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-center gap-[3.68cqw]">
              <span className="flex h-[10.53cqw] w-[10.53cqw] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(16,24,40,0.07)] ring-1 ring-[#E4EBF8]">
                <Icon
                  className="h-[5.26cqw] w-[5.26cqw] text-[#1A60FC]"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </span>
              <span className="flex flex-col">
                <span className="text-[3.55cqw] font-semibold leading-tight text-[#101828]">
                  {title}
                </span>
                <span className="mt-[0.53cqw] text-[3.16cqw] leading-tight text-[#6C727F]">
                  {description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* teal banner sweeping across the bottom-left corner */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-[63%]">
        <svg
          viewBox="0 0 205 37"
          className="block h-auto w-full"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 37 L0 12 Q0 2.2 10 2 C 65 1.3 118 5.5 158 15 C 178 20.5 193 28 205 37 Z"
            fill="#00ABB8"
          />
        </svg>
        <div className="absolute bottom-[3.16cqw] left-[4.74cqw]">
          <p className="text-[3.16cqw] font-bold leading-none tracking-[0.01em] text-white">
            Dream. Apply. Grow.
          </p>
          <svg
            viewBox="0 0 50 5"
            className="mt-[1.58cqw] h-[1.05cqw] w-[13.16cqw]"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1.5 1.5 C 14 4.6, 36 4.6, 48.5 1.8"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}