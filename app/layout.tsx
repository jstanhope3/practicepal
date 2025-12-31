import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { logout } from "@/app/actions/auth"; // Import the action

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PracticePal",
  description: "Track your progress",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("user_id");

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* GLOBAL NAVBAR */}
        <nav className="bg-practicepal-400 text-practicepal-100 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
              🎹 PracticePal
            </Link>
            {/* Links & Logout (Only visible if logged in) */}
            {isLoggedIn && (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-6">
                  <NavLink href="/" label="Dashboard" />
                  <NavLink href="/repertoire" label="Repertoire" />
                  <NavLink href="/logs" label="Logs" />
                </div>

                {/* LOGOUT BUTTON */}
                <form action={logout}>
                  <button className="bg-practicepal-200 hover:bg-practicepal-500 text-practicepal-400 hover:text-practicepal-400 text-xs font-bold py-2 px-4 rounded border border-slate-700 transition-all">
                    Log Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </nav>

        {/* PAGE CONTENT INJECTED HERE */}
        {children}
      </body>
    </html>
  );
}

// Helper for clean links
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-practicepal-100 hover:text-practicepal-200 transition-colors"
    >
      {label}
    </Link>
  );
}
