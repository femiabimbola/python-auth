import Link from "next/link";
import { Briefcase } from "lucide-react";

export function NavHeader() {
  return (
    <header
      className="w-full border-b"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottomColor: "#E0E3E7",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        color: "#161616",
        fontFamily: "'IBM Plex Sans', Arial, sans-serif",
      }}
    >
      <div
        className="mx-auto flex h-18 max-w-300 flex-wrap items-center justify-between px-6"
        style={{ gap: "24px" }}
      >
        {/* Logo */}
        <Link
          href="#"
          className="flex items-center no-underline"
          style={{ gap: "10px", color: "#161616", fontWeight: 700, fontSize: "22px" }}
        >
          <span
            className="flex items-center justify-center rounded-lg"
            style={{
              backgroundColor: "#0F62FE",
              width: "34px",
              height: "34px",
              borderRadius: "8px",
            }}
          >
            <Briefcase size={20} color="#FFFFFF" strokeWidth={2.2} />
          </span>
          HireNaija
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden items-center md:flex"
          style={{ gap: "32px", fontSize: "15px", fontWeight: 500 }}
        >
          <Link
            href="#"
            className="no-underline transition-colors hover:opacity-80"
            style={{ color: "#0F62FE" }}
          >
            Find Jobs
          </Link>
          <Link
            href="#"
            className="no-underline transition-colors hover:opacity-80"
            style={{ color: "#161616" }}
          >
            Companies
          </Link>
          <Link
            href="#"
            className="no-underline transition-colors hover:opacity-80"
            style={{ color: "#161616" }}
          >
            Salaries
          </Link>
          <Link
            href="#"
            className="no-underline transition-colors hover:opacity-80"
            style={{ color: "#161616" }}
          >
            Career Advice
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center" style={{ gap: "12px" }}>
          <Link
            href="#"
            className="hidden no-underline transition-colors hover:opacity-80 sm:block"
            style={{
              color: "#161616",
              fontWeight: 500,
              fontSize: "15px",
              padding: "12px 8px",
            }}
          >
            Sign in
          </Link>
          <div
            className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#0F62FE",
              color: "#FFFFFF",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: 600,
              height: "44px",
              paddingLeft: "20px",
              paddingRight: "20px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            Post a Job
          </div>
        </div>

        {/* Mobile Nav Toggle — optional simple menu placeholder */}
        <div className="flex w-full items-center gap-4 pb-3 md:hidden">
          <Link
            href="#"
            className="no-underline"
            style={{ color: "#0F62FE", fontSize: "15px", fontWeight: 500 }}
          >
            Find Jobs
          </Link>
          <Link
            href="#"
            className="no-underline"
            style={{ color: "#161616", fontSize: "15px", fontWeight: 500 }}
          >
            Companies
          </Link>
          <Link
            href="#"
            className="no-underline"
            style={{ color: "#161616", fontSize: "15px", fontWeight: 500 }}
          >
            Salaries
          </Link>
          <Link
            href="#"
            className="no-underline"
            style={{ color: "#161616", fontSize: "15px", fontWeight: 500 }}
          >
            Career Advice
          </Link>
          <Link
            href="#"
            className="ml-auto no-underline sm:hidden"
            style={{ color: "#161616", fontSize: "15px", fontWeight: 500 }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}