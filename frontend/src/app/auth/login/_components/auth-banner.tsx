import { Briefcase, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Explore Top Opportunities",
    description: "Across leading companies",
  },
  {
    icon: TrendingUp,
    title: "Build Your Career",
    description: "With the right opportunities",
  },
  {
    icon: Users,
    title: "Connect with Employers",
    description: "Directly and easily",
  },
];

export function AuthBanner() {
  return (
    <div className="relative flex h-full min-h-[600px] flex-col justify-between overflow-hidden bg-[#0B1C3F] p-8 md:p-12">
      {/* Background Image */}
      {/* Using an Unsplash image as a placeholder for the professional woman */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C3F]/90 to-[#0B1C3F]/40 mix-blend-multiply" />
      </div>

      {/* Top Section */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0056FF]">
            <span className="text-xl font-bold text-white">EZ</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold tracking-tight">EZ37</span>
            <span className="text-sm font-medium tracking-widest text-gray-300">
              Solutions
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="mt-6 max-w-[400px]">
          <h1 className="text-5xl font-extrabold leading-tight text-white md:text-6xl">
            Your Next Opportunity Awaits
          </h1>
          <div className="mt-3 h-1.5 w-24 rounded-full bg-[#00B4B4]" />
          <p className="mt-5 text-lg text-gray-200">
            Find great jobs, grow your career, and achieve more with EZ37.
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="relative z-10 mt-12 flex flex-col gap-5">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">{feature.title}</h4>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-32 items-center bg-[#00B4B4] px-8 md:px-12">
        <div>
          <h2 className="text-2xl font-bold text-white">Dream. Apply. Grow.</h2>
          <div className="mt-1 h-1 w-12 rounded-full bg-white/50" />
        </div>
      </div>
    </div>
  );
}