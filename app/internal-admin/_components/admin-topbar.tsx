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
import { LogOut, User, ChevronDown, Loader2 } from "lucide-react";

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
    <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 glass-nav sticky top-0 z-10 text-foreground">
      <div>
        <h1 className="text-lg font-semibold text-navy">{pageTitle}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            id="admin-user-menu"
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <Avatar className="h-8 w-8 border border-slate-200">
              <AvatarFallback className="bg-navy/5 text-navy text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-navy leading-none truncate max-w-[160px]">
                {user.email}
              </p>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Administrator</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52"
        >
          <DropdownMenuLabel className="text-slate-500 text-xs font-normal">
            Signed in as
            <br />
            <span className="text-foreground font-medium text-sm truncate block mt-0.5">
              {user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="h-3.5 w-3.5" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2"
            id="admin-sign-out"
          >
            {isSigningOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
