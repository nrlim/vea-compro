import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Admin Portal Login — PT Vanguard Energy Amanah",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-navy-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--gold), transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto mb-4 bg-white rounded-2xl p-2 border border-white/20 shadow-xl flex items-center justify-center">
            <Image src="/main-vea-logo.png" alt="PT VEA Logo" fill className="object-contain p-2" priority />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            PT Vanguard Energy Amanah
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-widest uppercase text-gold-light mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Internal Access Portal</span>
          </div>
        </div>

        {/* Card */}
        <div className="double-bezel-dark shadow-2xl">
          <div className="double-bezel-inner-dark p-8 sm:p-10">
            <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Masuk ke Akun</h2>
                <p className="text-white/60 text-xs mt-0.5">Masukkan email & kata sandi terdaftar.</p>
              </div>
              <Lock className="w-5 h-5 text-gold" />
            </div>
            <LoginForm />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform text-gold" />
            <span>Kembali ke Beranda Publik</span>
          </Link>
          <p className="text-center text-white/30 text-[11px]">
            Akses terbatas khusus staf dan administrator PT VEA
          </p>
        </div>
      </div>
    </main>
  );
}
