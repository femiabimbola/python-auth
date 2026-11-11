const steps = [
  {
    number: "1",
    title: "Create your profile",
    description:
      "Add your skills, experience and the kind of role you want. Upload your CV once.",
  },
  {
    number: "2",
    title: "Discover matching jobs",
    description:
      "Filter by location, job type and skills, and save searches to get alerts.",
  },
  {
    number: "3",
    title: "Apply and track",
    description:
      "Apply in one click and follow every application from a single dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section
      className="mx-auto w-full max-w-300 px-6 py-16"
      style={{
        color: "#161616",
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <h2
        className="mb-2 text-center font-bold"
        style={{ color: "#161616", fontSize: "32px", lineHeight: 1.3 }}
      >
        How it works
      </h2>
      <p
        className="mb-10 text-center"
        style={{ color: "#525252", fontSize: "16px", marginTop: 0 }}
      >
        From profile to offer in three simple steps.
      </p>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="transition-shadow hover:shadow-md"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E0E3E7",
              borderRadius: "12px",
              padding: "28px",
            }}
          >
            <span
              className="inline-flex items-center justify-center"
              style={{
                backgroundColor: "#0F62FE",
                color: "#FFFFFF",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              {step.number}
            </span>
            <h3
              className="mt-4 mb-2 font-bold"
              style={{
                color: "#161616",
                fontSize: "20px",
                lineHeight: 1.35,
                marginBottom: "8px",
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                color: "#525252",
                fontSize: "16px",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}