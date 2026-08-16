"use client";

import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, ChevronDown, Loader2, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";

interface AdminTopbarProps {
  user: { email: string; role?: string; id?: string };
  pageTitle: string;
}

export function AdminTopbar({ user, pageTitle }: AdminTopbarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : "VE";

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
  }

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-white sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <h1 className="font-serif font-bold text-base md:text-lg text-navy">{pageTitle}</h1>
        <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400">
          • PT Vanguard Energy Amanah
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] font-semibold text-slate-600 hover:text-navy hover:bg-slate-50 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-gold-dark" />
          <span>Lihat Web Publik</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              id="admin-user-menu"
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-slate-50 border border-border transition-colors focus:outline-none"
            >
              <Avatar className="h-7 w-7 border border-border">
                <AvatarFallback className="bg-navy text-gold text-[10px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-navy leading-none truncate max-w-[140px]">
                  {user.email}
                </p>
                <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  {user.role === "admin" ? "Administrator" : "Staff Operasional"}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border border-border shadow-xl">
            <DropdownMenuLabel className="text-slate-500 text-xs font-normal">
              Login sebagai:
              <span className="text-navy font-bold text-xs truncate block mt-0.5">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer text-xs">
              <Link href="/internal-admin/settings">
                <User className="h-3.5 w-3.5 mr-2 text-slate-500" />
                Pengaturan Akun
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer text-xs gap-2"
              id="admin-sign-out"
            >
              {isSigningOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              Keluar Sesi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
