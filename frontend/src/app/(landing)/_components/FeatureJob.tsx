import Link from "next/link";

type Job = {
  logo: string;
  logoBg: string;
  logoColor: string;
  title: string;
  company: string;
  featured?: boolean;
  location: string;
  type: string;
  posted: string;
  tags: string[];
};

const jobs: Job[] = [
  {
    logo: "N",
    logoBg: "#161616",
    logoColor: "#FFFFFF",
    title: "Senior Product Designer",
    company: "Northwind Labs",
    featured: true,
    location: "Lagos, Nigeria · Hybrid",
    type: "Full-time",
    posted: "Posted 2 days ago",
    tags: ["Figma", "Design Systems", "User Research"],
  },
  {
    logo: "B",
    logoBg: "#0F62FE",
    logoColor: "#FFFFFF",
    title: "Frontend Engineer",
    company: "Brightside Pay",
    featured: true,
    location: "Remote",
    type: "Full-time",
    posted: "Posted 1 day ago",
    tags: ["React", "TypeScript", "Accessibility"],
  },
  {
    logo: "M",
    logoBg: "#00A3A6",
    logoColor: "#FFFFFF",
    title: "Data Analyst",
    company: "Meridian Health",
    location: "Abuja, Nigeria",
    type: "Contract",
    posted: "Posted 3 days ago",
    tags: ["SQL", "Power BI", "Python"],
  },
  {
    logo: "K",
    logoBg: "#161616",
    logoColor: "#FFFFFF",
    title: "Marketing Manager",
    company: "Kite & Co.",
    location: "Remote",
    type: "Full-time",
    posted: "Posted 5 days ago",
    tags: ["SEO", "Content Strategy", "Analytics"],
  },
];

export function FeaturedJobs() {
  return (
    <section
      className="w-full border-y"
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E3E7",
        borderBottom: "1px solid #E0E3E7",
        color: "#161616",
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      }}
    >
      <div className="mx-auto w-full max-w-300 px-6 py-16">
        {/* Header */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              className="mb-1.5 font-bold"
              style={{ color: "#161616", fontSize: "32px", lineHeight: 1.3 }}
            >
              Featured jobs
            </h2>
            <p style={{ color: "#525252", fontSize: "16px", margin: 0 }}>
              Hand-picked roles from companies hiring right now.
            </p>
          </div>
          <Link
            href="#"
            className="no-underline transition-colors hover:opacity-80"
            style={{ color: "#0F62FE", fontSize: "15px", fontWeight: 600 }}
          >
            See all jobs →
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, idx) => (
            <article
              key={idx}
              className="flex flex-col gap-4 transition-shadow hover:shadow-md"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E0E3E7",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3.5">
                <span
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: job.logoBg,
                    color: job.logoColor,
                    borderRadius: "12px",
                    width: "52px",
                    height: "52px",
                    fontSize: "26px",
                    fontWeight: 700,
                  }}
                >
                  {job.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate"
                    style={{
                      color: "#161616",
                      fontSize: "19px",
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {job.title}
                  </h3>
                  <div
                    style={{
                      color: "#525252",
                      fontSize: "14px",
                      marginTop: "2px",
                    }}
                  >
                    {job.company}
                  </div>
                </div>
                {job.featured && (
                  <span
                    className="shrink-0"
                    style={{
                      backgroundColor: "#00A3A6",
                      color: "#FFFFFF",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "5px 12px",
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>

              {/* Meta */}
              <div
                className="flex flex-wrap"
                style={{ gap: "18px", fontSize: "14px", color: "#525252" }}
              >
                <span>{job.location}</span>
                <span>{job.type}</span>
                <span>{job.posted}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: "#E0F5F5",
                      color: "#161616",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 500,
                      padding: "5px 10px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Apply Button */}
              <div className="flex justify-end">
                <div
                  className="flex cursor-pointer items-center justify-center font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#0F62FE",
                    color: "#FFFFFF",
                    borderRadius: "6px",
                    fontSize: "15px",
                    height: "44px",
                    paddingLeft: "22px",
                    paddingRight: "22px",
                  }}
                >
                  Apply Now
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}