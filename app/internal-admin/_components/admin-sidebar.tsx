"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Zap,
  ChevronRight,
  Settings,
  MessageCircle,
  Workflow,
  Inbox,
  CreditCard,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dasbor Overview",
    href: "/internal-admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Pesan Konsultasi & RFQ",
    href: "/internal-admin/contacts",
    icon: Inbox,
    exact: false,
  },
  {
    label: "Riwayat Transaksi",
    href: "/internal-admin/orders",
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Katalog Produk",
    href: "/internal-admin/products",
    icon: Package,
    exact: false,
  },
  {
    label: "Mitra Industri",
    href: "/internal-admin/mitra",
    icon: Building2,
    exact: false,
  },
  {
    label: "Principal Brands",
    href: "/internal-admin/brands",
    icon: Zap,
    exact: false,
  },
  {
    label: "Pengaturan Sistem",
    href: "/internal-admin/settings",
    icon: Settings,
    exact: true,
  },
  {
    label: "Saluran WhatsApp",
    href: "/internal-admin/settings/whatsapp",
    icon: MessageCircle,
    exact: false,
    indent: true,
  },
  {
    label: "Email Workflows",
    href: "/internal-admin/email-templates",
    icon: Workflow,
    exact: false,
    indent: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-border shrink-0 shadow-xs">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-slate-surface/60">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border p-0.5 bg-white shrink-0">
          <Image src="/main-vea-logo.png" alt="PT VEA Logo" fill className="object-contain p-0.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-serif font-bold text-navy truncate">PT Vanguard Energy</p>
          <p className="text-[10px] font-semibold text-gold-dark uppercase tracking-wider">
            Management Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
          Menu Navigasi
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group",
                item.indent ? "ml-4 border-l-2 rounded-l-none pl-3" : "",
                item.indent
                  ? isActive
                    ? "border-gold text-navy bg-gold/5 font-bold"
                    : "border-slate-200 text-slate-500 hover:text-navy hover:bg-slate-50"
                  : isActive
                  ? "bg-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-navy hover:bg-slate-50"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? item.indent ? "text-gold-dark" : "text-gold"
                    : "text-slate-400 group-hover:text-navy"
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && !item.indent && (
                <ChevronRight className="h-3 w-3 text-gold/80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="px-6 py-4 border-t border-border bg-slate-surface">
        <p className="text-[10px] text-slate-400 text-center font-medium">
          PT VEA v2.0 &copy; {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
