"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Zap,
  ChevronRight,
  Settings,
  Server,
  MessageCircle,
  Mail,
  Workflow,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dasbor",
    href: "/internal-admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Pesan Konsultasi",
    href: "/internal-admin/contacts",
    icon: Inbox,
    exact: false,
  },
  {
    label: "Produk",
    href: "/internal-admin/products",
    icon: Package,
    exact: false,
  },
  {
    label: "Mitra",
    href: "/internal-admin/mitra",
    icon: Users,
    exact: false,
  },
  {
    label: "Brands",
    href: "/internal-admin/brands",
    icon: Zap,
    exact: false,
  },
  {
    label: "Pengaturan",
    href: "/internal-admin/settings",
    icon: Settings,
    exact: true,
  },
  {
    label: "Gateway SMTP",
    href: "/internal-admin/settings/smtp",
    icon: Server,
    exact: false,
    indent: true,
  },
  {
    label: "Saluran WhatsApp",
    href: "/internal-admin/settings/whatsapp",
    icon: MessageCircle,
    exact: false,
    indent: true,
  },
  {
    label: "Rute Email",
    href: "/internal-admin/settings/email",
    icon: Mail,
    exact: false,
    indent: true,
  },
  {
    label: "Desain Konten",
    href: "/internal-admin/settings/template",
    icon: Workflow,
    exact: false,
    indent: true,
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
          <p className="text-[11px] text-muted-foreground">Panel Manajemen</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
          Menu Utama
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
                (item as any).indent ? "ml-5 border-l-2 rounded-l-none pl-4" : "",
                (item as any).indent
                  ? isActive
                    ? "border-navy/40 bg-navy/5 text-navy"
                    : "border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 hover:border-navy/30"
                  : isActive
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
