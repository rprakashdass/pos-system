"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { AuthGate } from "@/components/auth/AuthGate";

const publicRoutes = new Set(["/login", "/signup"]);

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.has(pathname);

  return (
    <AuthGate>
      {isPublicRoute ? (
        <main className="min-h-screen">{children}</main>
      ) : (
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      )}
    </AuthGate>
  );
};
