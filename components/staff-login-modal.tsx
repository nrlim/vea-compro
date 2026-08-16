"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, LogIn, X } from "lucide-react";
import { toast } from "sonner";

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffLoginModal({ isOpen, onClose }: StaffLoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        toast.error("Otentikasi Gagal", {
          description: result.error,
        });
      } else {
        toast.success("Berhasil Masuk", {
          description: "Mengarahkan ke Dashboard Internal...",
        });
        onClose();
        router.push("/internal-admin");
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md p-0 overflow-hidden rounded-2xl bg-navy-deep border border-white/15 shadow-2xl z-50 text-white"
        aria-describedby="staff-portal-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Portal Internal Staff PT VEA</DialogTitle>
          <DialogDescription id="staff-portal-description">
            Autentikasi akun staf dan administrator PT Vanguard Energy Amanah
          </DialogDescription>
        </DialogHeader>

        {/* Ambient Glow */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-30 pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          aria-label="Tutup popup login"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 relative z-10">
          
          {/* Header & Brand Identity */}
          <div className="text-center mb-6">
            <div className="relative w-12 h-12 mx-auto mb-3 bg-white rounded-xl p-1.5 border border-white/20 shadow-md flex items-center justify-center">
              <Image
                src="/main-vea-logo.png"
                alt="PT VEA Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <h2 className="font-serif font-bold text-xl text-white tracking-tight">
              Portal Internal Staff
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-widest uppercase text-gold-light mt-2">
              <ShieldCheck className="w-3 h-3 text-gold" />
              <span>Autentikasi Terenkripsi</span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="staff-email" className="text-xs font-semibold text-slate-300">
                Alamat Email Terdaftar
              </Label>
              <Input
                id="staff-email"
                name="email"
                type="email"
                placeholder="nama@ptvea.com"
                required
                autoComplete="email"
                className="bg-navy/60 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-gold focus-visible:border-gold h-10 rounded-lg text-xs"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="staff-password" className="text-xs font-semibold text-slate-300">
                  Kata Sandi
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="staff-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="bg-navy/60 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-gold focus-visible:border-gold h-10 rounded-lg text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 rounded-lg font-bold text-xs uppercase tracking-wider bg-gold hover:bg-gold-light text-navy transition-all shadow-md gap-2"
                id="staff-portal-submit"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-navy" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 text-navy" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer Notice */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Akses terbatas untuk staf pengadaan, engineer, dan admin PT Vanguard Energy Amanah.
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
