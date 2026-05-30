import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider, Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/services/authService";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POS App",
  description: "Point of Sale application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
            <Toaster />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
