export function HiringCTA() {
  return (
    <section
      className="mx-auto w-full max-w-300 px-6 pb-16"
      style={{
        color: "#161616",
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-8"
        style={{
          backgroundColor: "#0F62FE",
          borderRadius: "20px",
          padding: "56px 48px",
        }}
      >
        {/* Text Content */}
        <div className="min-w-0 flex-1" style={{ flexBasis: "420px" }}>
          <h2
            className="mb-3 font-bold"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(26px, 3vw, 34px)",
              lineHeight: 1.3,
            }}
          >
            Hiring? Reach the right people faster.
          </h2>
          <p
            className="max-w-140"
            style={{
              color: "#FFFFFF", fontSize: "17px", lineHeight: 1.55,
              margin: 0,
            }}
          >
            Post a job, review applicants and manage your hiring pipeline in one
            place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div
            className="flex cursor-pointer items-center justify-center font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#FFFFFF",
              color: "#0043CE",
              borderRadius: "6px",
              height: "52px",
              paddingLeft: "26px",
              paddingRight: "26px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          >
            Post a Job
          </div>
          <div
            className="flex cursor-pointer items-center justify-center font-semibold transition-colors hover:bg-white/10"
            style={{
              border: "2px solid #FFFFFF",
              color: "#FFFFFF",
              borderRadius: "6px",
              height: "52px",
              paddingLeft: "26px",
              paddingRight: "26px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          >
            Talk to sales
          </div>
        </div>
      </div>
    </section>
  );
}