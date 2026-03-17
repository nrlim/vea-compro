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
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-600 font-medium text-sm">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@ptvea.co.id"
          required
          autoComplete="email"
          className="bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold focus-visible:border-gold h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-600 font-medium text-sm">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••"
            required
            autoComplete="current-password"
            className="bg-white border-slate-200 text-navy placeholder:text-slate-400 focus-visible:ring-gold focus-visible:border-gold h-11 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 bg-navy hover:bg-navy-light text-white font-medium tracking-wide transition-all shadow-md"
        id="admin-login-submit"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
}
