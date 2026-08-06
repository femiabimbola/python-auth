
import "../globals.css"
import {Sidebar} from "./components/Sidebar"
import {Topbar} from "./components/Topbar"
import Footer from "./components/Footer";


export default function RootLayout({children,
}: {
  children: React.ReactNode;
}) {
  return (

        <div
          className="flex h-screen overflow-hidden"
          style={{ background: "var(--pearl)" }}
        >
          {/* Sidebar */}
          <Sidebar />

          {/* Main Column */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto">{children}</main>

            <Footer />
          </div>
        </div>
  
  );
}
