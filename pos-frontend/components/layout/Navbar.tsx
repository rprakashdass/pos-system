"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Package, ShoppingCart, FileText, FlaskConical, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import apiService from "@/services/apiService";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Load Lab", href: "/load-lab", icon: FlaskConical },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        await apiService.get('/load/test/simple');
        if (mounted) setBackendOnline(true);
      } catch (e) {
        if (mounted) setBackendOnline(false);
      }
    };

    check();
    const id = setInterval(check, 5000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const logout = async () => {
    try {
      await apiService.post('/auth/logout', {});
    } finally {
      router.replace('/login');
    }
  };

  const dotClass = backendOnline === null ? 'bg-gray-300' : backendOnline ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center px-6 md:px-8">
        <div className="mr-8 flex items-center space-x-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center">
              <span
                className={`mr-2 flex h-3 w-3 shrink-0 rounded-full ${dotClass}`}
                id="backend-status-dot"
                aria-hidden="true"
                title={backendOnline === null ? 'Checking backend...' : backendOnline ? 'Backend online' : 'Backend disconnected'}
              />
              <span className="text-xl font-bold tracking-tight">POS System</span>
            </span>
          </div>
        </div>
        <div className="flex gap-6 md:gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          ))}
          <button
            type="button"
            onClick={logout}
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
