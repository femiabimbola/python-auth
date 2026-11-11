import Link from "next/link";
import {
  Code,
  Palette,
  Megaphone,
  TrendingUp,
  BarChart3,
  Heart,
  Volume2,
  Plus,
} from "lucide-react";

const categories = [
  { name: "Engineering", icon: Code },
  { name: "Design", icon: Palette },
  { name: "Marketing", icon: Megaphone },
  { name: "Sales", icon: TrendingUp },
  { name: "Finance", icon: BarChart3 },
  { name: "Healthcare", icon: Heart },
//   { name: "Audio", icon: Volume2 },
];

export function CategorySection() {
  return (
    <section
      className="mx-auto w-full max-w-300 px-6 pt-6 pb-16"
      style={{
        color: "#161616",
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            className="mb-1.5 font-bold"
            style={{
              color: "#161616",
              fontSize: "32px",
              lineHeight: 1.3,
            }}
          >
            Browse by category
          </h2>
          <p
            style={{
              color: "#525252",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Explore roles across the fields people are hiring for.
          </p>
        </div>
        <Link
          href="#"
          className="no-underline transition-colors hover:opacity-80"
          style={{
            color: "#0F62FE",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          View all categories →
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ name, icon: Icon }) => (
          <Link
            key={name}
            href="#"
            className="group flex flex-col gap-3.5 rounded-xl border no-underline transition-all hover:border-[#0F62FE] hover:shadow-md"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E0E3E7",
              borderRadius: "12px",
              padding: "22px 20px",
              color: "#161616",
            }}
          >
            <Icon size={28} color="#0F62FE" strokeWidth={2} />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#161616",
              }}
            >
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}