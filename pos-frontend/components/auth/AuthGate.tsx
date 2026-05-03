"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import apiService from "@/services/apiService";

const publicRoutes = new Set(["/login", "/signup"]);

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isPublic = publicRoutes.has(pathname);

    const check = async () => {
      try {
        await apiService.get("/auth/me");
        if (isPublic) {
          router.replace("/");
          return;
        }
        setReady(true);
      } catch {
        if (!isPublic) {
          router.replace("/login");
          return;
        }
        setReady(true);
      }
    };

    void check();
  }, [pathname, router]);

  if (!ready && !publicRoutes.has(pathname)) {
    return null;
  }

  return <>{children}</>;
};