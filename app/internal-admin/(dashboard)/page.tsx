import { prisma } from "@/lib/prisma";
import { Package, Users, Inbox, TrendingUp, CreditCard, ShieldCheck, ArrowUpRight, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dasbor Manajemen" };

async function getStats() {
  const [productCount, userCount, contactCount, orderCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.contactRequest.count(),
    prisma.order.count(),
  ]);

  return {
    products: productCount ?? 0,
    users: userCount ?? 0,
    contacts: contactCount ?? 0,
    orders: orderCount ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Katalog Produk",
      value: stats.products,
      icon: Package,
      color: "text-navy",
      bg: "bg-navy/5",
      border: "border-navy/10",
      href: "/internal-admin/products",
    },
    {
      label: "Pesan Masuk / RFQ",
      value: stats.contacts,
      icon: Inbox,
      color: "text-gold-dark",
      bg: "bg-gold/10",
      border: "border-gold/20",
      href: "/internal-admin/contacts",
    },
    {
      label: "Riwayat Transaksi",
      value: stats.orders,
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      href: "/internal-admin/orders",
    },
    {
      label: "Akun Pengguna Sistem",
      value: stats.users,
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200",
      href: "/internal-admin/users",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-serif font-bold text-navy tracking-tight">
            Ringkasan Operasional
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
            Selamat datang di portal manajemen data dan pengadaan PT Vanguard Energy Amanah.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Berjalan Normal (Container Node.js)</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-border bg-white p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-gold/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} border ${card.border}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-gold-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                {card.label}
              </p>
              <p className={`text-3xl font-serif font-bold mt-1 ${card.color}`}>
                {card.value.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Access Actions */}
      <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-navy">Aksi Cepat Manajemen</h3>
          <span className="text-xs text-muted-foreground">Pintasan Cepat</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Tambah Produk Baru",
              href: "/internal-admin/products",
              desc: "Upload item baru, foto multi-angle, datasheet & manual PDF.",
              icon: Package,
            },
            {
              label: "Kelola Mitra & Brands",
              href: "/internal-admin/brands",
              desc: "Update logo principal industri dan daftar klien korporat.",
              icon: Zap,
            },
            {
              label: "Pengaturan Gateway & Mail",
              href: "/internal-admin/settings",
              desc: "Konfigurasi SMTP, WhatsApp hotline, dan email workflow.",
              icon: ShieldCheck,
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col gap-1.5 p-4 rounded-xl border border-border/80 bg-slate-50 hover:border-gold/40 hover:bg-gold/5 transition-all group"
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-navy group-hover:text-gold-dark transition-colors" />
                <span className="text-xs font-bold text-navy group-hover:text-gold-dark transition-colors">
                  {item.label}
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
