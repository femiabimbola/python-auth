import Link from "next/link";

const columns = [
  {
    title: "Job seekers",
    links: ["Browse jobs", "Companies", "Career advice"],
  },
  {
    title: "Employers",
    links: ["Post a job", "Pricing", "Hiring resources"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Privacy"],
  },
];

export  function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "#161616",
        color: "#FFFFFF",
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      }}
    >
      <div className="mx-auto w-full max-w-300 px-6 pt-14 pb-8">
        {/* Top section */}
        <div className="flex flex-wrap justify-between gap-12 pb-8">
          {/* Brand */}
          <div className="min-w-0 flex-1" style={{ flexBasis: "260px", maxWidth: "320px" }}>
            <div
              className="mb-3 font-bold"
              style={{ fontSize: "22px", color: "#FFFFFF" }}
            >
              WorkBridge
            </div>
            <p
              style={{
                color: "#C6CBD1",
                fontSize: "15px",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Connecting people with work they care about.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap" style={{ gap: "64px", fontSize: "15px" }}>
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col" style={{ gap: "12px" }}>
                <strong style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 700 }}>
                  {col.title}
                </strong>
                {col.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="no-underline transition-colors hover:text-white"
                    style={{ color: "#C6CBD1", fontSize: "15px" }}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            color: "#C6CBD1",
            fontSize: "14px",
            borderTop: "1px solid rgba(198, 203, 209, 0.2)",
            paddingTop: "24px",
          }}
        >
          © 2026 WorkBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}