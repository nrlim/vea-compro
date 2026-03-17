"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/internal-admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Products",
    href: "/internal-admin/products",
    icon: Package,
    exact: false,
  },
  {
    label: "Users",
    href: "/internal-admin/users",
    icon: Users,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-slate-200 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-navy/5 border border-navy/10 shrink-0">
          <Zap className="h-5 w-5 text-navy" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy truncate">PT VEA</p>
          <p className="text-[11px] text-muted-foreground">Management Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-navy/5 text-navy border border-navy/10"
                  : "text-slate-500 hover:text-navy hover:bg-slate-50"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-navy" : "text-slate-400 group-hover:text-navy/70"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 text-navy opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200">
        <p className="text-[10px] text-slate-400 text-center">
          © {new Date().getFullYear()} PT VEA
        </p>
      </div>
    </aside>
  );
}
