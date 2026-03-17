import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Admin Login — PT VEA",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(13, 31, 60, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 31, 60, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,160,80,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy/5 border border-navy/10 mb-4 shadow-sm">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="text-navy"
            >
              <path
                d="M13 10V3L4 14h7v7l9-11h-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy tracking-tight font-serif">
            PT Vanguard Energy Amanah
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Internal Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-xl shadow-navy/5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-navy">Sign in to your account</h2>
            <p className="text-muted-foreground text-sm mt-1">Enter your credentials to access the admin panel.</p>
          </div>
          <LoginForm />
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          <Link href="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-navy transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Return to Homepage
          </Link>
          <p className="text-center text-slate-400 text-xs">
            Restricted access — not for public use
          </p>
        </div>
      </div>
    </main>
  );
}
