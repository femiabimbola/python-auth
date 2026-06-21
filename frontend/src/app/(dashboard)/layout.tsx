import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"
import {Sidebar} from "./_components/Sidebar"
import {Topbar} from "./_components/Topbar"
import Footer from "./_components/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina Dashboard",
  description: "Analytics and business intelligence dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className="flex h-screen overflow-hidden"
          style={{ background: "var(--pearl)" }}
        >
          {/* Sidebar */}
          <Sidebar />

          {/* Main Column */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Topbar */}
            <Topbar />

            <main className="flex-1 overflow-y-auto">{children}</main>

            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
