"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/services/authService';

const publicRoutes = new Set(['/login', '/signup']);

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !publicRoutes.has(pathname)) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  if (isLoading) return null;
  if (!isLoggedIn && !publicRoutes.has(pathname)) return null;

  return <>{children}</>;
};
