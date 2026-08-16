"use client";

import { useState, useTransition } from "react";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        toast.error("Login gagal", { description: result.error });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-slate-300 font-semibold text-xs">
          Alamat Email Terdaftar
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@ptvea.com"
          required
          autoComplete="email"
          className="bg-navy/60 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-gold focus-visible:border-gold h-10 rounded-lg text-xs"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-slate-300 font-semibold text-xs">
          Kata Sandi
        </Label>
        <div className="relative">
          <Input
            id="password"
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

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-10 rounded-lg font-bold text-xs uppercase tracking-wider bg-gold hover:bg-gold-light text-navy transition-all shadow-md gap-2"
          id="admin-login-submit"
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
  );
}
