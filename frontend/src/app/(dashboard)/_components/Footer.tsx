import { Zap, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="flex items-center justify-between px-6 py-3 border-t text-xs shrink-0"
      style={{ borderColor: "var(--mist)", color: "var(--mid)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-4 h-4 rounded flex items-center justify-center"
          style={{ background: "var(--violet)" }}
        >
          <Zap className="w-2.5 h-2.5 text-white" />
        </div>
        <span style={{ color: "var(--ink)" }} className="font-medium">
          Lumina
        </span>
        <span className="mx-1">·</span>
        <span>v2.4.1</span>
        <span className="mx-1">·</span>
        <span>© 2026 Lumina Inc.</span>
      </div>

      {/* Center: Status */}
      <div className="hidden md:flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "var(--sage)" }}
        />
        <span>All systems operational</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="hover:underline flex items-center gap-1 transition-colors"
          style={{ color: "var(--mid)" }}
        >
          Docs
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="#"
          className="hover:underline transition-colors"
          style={{ color: "var(--mid)" }}
        >
          Privacy
        </a>
        <a
          href="#"
          className="hover:underline transition-colors"
          style={{ color: "var(--mid)" }}
        >
          Terms
        </a>
      </div>
    </footer>
  );
}
