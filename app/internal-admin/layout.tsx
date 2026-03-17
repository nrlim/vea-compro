import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Admin Panel — PT VEA",
    template: "%s | Admin VEA",
  },
  description: "Internal Admin Panel for PT Vanguard Energy Amanah",
  robots: { index: false, follow: false }, // hide from search engines
};

export default function InternalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-sans`}>
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
