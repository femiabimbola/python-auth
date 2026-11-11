import { Search, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative mx-auto flex w-full max-w-[1200px] flex-col-reverse items-center justify-between gap-12 px-6 py-16 md:h-[440px] md:flex-row md:gap-12 md:py-[72px] md:px-6"
      style={{
        color: "#161616",
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      }}
    >
      {/* Left Column */}
      <div className="w-full flex-1 md:max-w-[620px]">
        {/* Badge */}
        <span
          className="inline-flex items-center gap-2 rounded-full border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#D5DADF",
            borderWidth: "1px",
            color: "#525252",
            fontSize: "14px",
            padding: "6px 14px",
          }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: "#00A3A6" }}
          />
          New roles added every day
        </span>

        {/* Headline */}
        <h1
          className="mt-5 mb-4 font-bold"
          style={{
            color: "#161616",
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.08,
            letterSpacing: "-1px",
          }}
        >
          Find work that fits{" "}
          <span style={{ color: "#0F62FE" }}>your life</span>.
        </h1>

        {/* Subtitle */}
        <p
          className="mb-8 max-w-[520px]"
          style={{
            color: "#525252",
            fontSize: "19px",
            lineHeight: 1.55,
          }}
        >
          Search thousands of jobs from companies that are hiring now. Build
          your profile once and apply in a few clicks.
        </p>

        {/* Search Bar */}
        <div
          className="flex w-full flex-col gap-2 rounded-[10px] p-2.5 sm:flex-row"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0 8px 24px rgba(22, 22, 22, 0.08)",
          }}
        >
          {/* Job title input */}
          <div className="flex flex-1 items-center gap-2.5 px-3">
            <Search size={20} color="#525252" />
            <input
              type="text"
              placeholder="Job title or keyword"
              className="w-full bg-transparent text-base outline-none placeholder:text-[#525252]"
              style={{ color: "#161616", fontSize: "16px", height: "44px" }}
            />
          </div>

          {/* Divider */}
          <div
            className="hidden sm:block"
            style={{ width: "1px", backgroundColor: "#E0E3E7" }}
          />

          {/* Location input */}
          <div className="flex flex-1 items-center gap-2.5 px-3">
            <MapPin size={20} color="#525252" />
            <input
              type="text"
              placeholder="City or remote"
              className="w-full bg-transparent text-base outline-none placeholder:text-[#525252]"
              style={{ color: "#161616", fontSize: "16px", height: "44px" }}
            />
          </div>

          {/* Search button */}
          <div
            className="flex cursor-pointer items-center justify-center font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#0F62FE",
              color: "#FFFFFF",
              borderRadius: "6px",
              height: "52px",
              paddingLeft: "28px",
              paddingRight: "28px",
              fontSize: "15px",
            }}
          >
            Search Jobs
          </div>
        </div>

        {/* Popular tags */}
        <div
          className="mt-5 flex flex-wrap items-center gap-2.5"
          style={{ fontSize: "14px", color: "#525252" }}
        >
          <span>Popular:</span>
          {["Remote", "Software Engineer", "Product Design", "Data"].map(
            (tag) => (
              <a
                key={tag}
                href="#"
                className="no-underline transition-colors hover:bg-[#F5F7FA]"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5DADF",
                  borderRadius: "999px",
                  color: "#161616",
                  fontSize: "14px",
                  padding: "6px 14px",
                }}
              >
                {tag}
              </a>
            )
          )}
        </div>
      </div>

      {/* Right Column - Illustration */}
      <div className="w-full flex-1 md:max-w-[520px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 520 440"
          width="100%"
          role="img"
          aria-label="Job search illustration"
        >
          <rect x="20" y="20" width="480" height="400" rx="28" fill="#E3ECFF" />
          <circle cx="420" cy="90" r="46" fill="#FFFFFF" opacity=".7" />
          <circle cx="90" cy="360" r="60" fill="#FFFFFF" opacity=".6" />

          {/* Back card */}
          <rect x="60" y="70" width="250" height="150" rx="14" fill="#FFFFFF" />
          <circle cx="102" cy="112" r="22" fill="#0F62FE" />
          <circle cx="102" cy="106" r="8" fill="#FFFFFF" />
          <path d="M88 128c2-10 26-10 28 0z" fill="#FFFFFF" />
          <rect x="136" y="98" width="110" height="10" rx="5" fill="#161616" />
          <rect x="136" y="118" width="70" height="8" rx="4" fill="#C6CBD1" />
          <rect x="84" y="154" width="64" height="24" rx="12" fill="#00A3A6" />
          <rect x="156" y="154" width="72" height="24" rx="12" fill="#CFF0F0" />
          <rect x="84" y="190" width="200" height="8" rx="4" fill="#E0E3E7" />

          {/* Front card */}
          <rect
            x="180"
            y="250"
            width="290"
            height="150"
            rx="14"
            fill="#FFFFFF"
            stroke="#0F62FE"
            strokeWidth="2"
          />
          <rect x="204" y="274" width="44" height="44" rx="10" fill="#161616" />
          <path
            d="M216 304l8-18 8 18m-13-6h10"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="262" y="276" width="130" height="11" rx="5" fill="#161616" />
          <rect x="262" y="298" width="90" height="8" rx="4" fill="#C6CBD1" />
          <rect x="204" y="340" width="70" height="24" rx="12" fill="#00A3A6" />
          <rect x="284" y="340" width="70" height="24" rx="12" fill="#CFF0F0" />
          <rect x="388" y="336" width="62" height="32" rx="6" fill="#0F62FE" />

          {/* Checkmark badge */}
          <circle cx="360" cy="222" r="26" fill="#00A3A6" />
          <path
            d="M348 222l8 8 14-16"
            stroke="#FFFFFF"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dashed connector */}
          <path
            d="M310 150c30 0 50 20 50 46"
            stroke="#0F62FE"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
}