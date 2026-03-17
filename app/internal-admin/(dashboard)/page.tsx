import { prisma } from "@/lib/prisma";
import { Package, Users, FileText, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [productCount, userCount, contactCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.contactRequest.count(),
  ]);

  return {
    products: productCount ?? 0,
    users: userCount ?? 0,
    contacts: contactCount ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Products",
      value: stats.products,
      icon: Package,
      color: "text-navy",
      bg: "bg-navy/5",
      border: "border-navy/10",
    },
    {
      label: "Admin & Staff Users",
      value: stats.users,
      icon: Users,
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/20",
    },
    {
      label: "Contact Requests",
      value: stats.contacts,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "System Status",
      value: "Operational",
      icon: TrendingUp,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-100",
      isString: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy tracking-tight font-serif">Overview</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome back. Here's what's happening with PT VEA today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border ${card.border} bg-white p-6 flex flex-col gap-3 shadow-sm`}
          >
            <div className={`inline-flex w-10 h-10 items-center justify-center rounded-lg ${card.bg} ${card.border} border`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
                {card.label}
              </p>
              <p className={`text-3xl font-bold mt-1 ${card.color}`}>
                {card.isString ? card.value : card.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-navy mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Add New Product", href: "/internal-admin/products", desc: "Add a product to the catalog" },
            { label: "Manage Users", href: "/internal-admin/users", desc: "View or invite staff members" },
            { label: "View Contacts", href: "#", desc: "Review incoming inquiries" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col gap-1 p-4 rounded-lg border border-slate-100 bg-slate-50 hover:border-navy/20 hover:bg-navy/5 transition-all group"
            >
              <span className="text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                {item.label}
              </span>
              <span className="text-xs text-muted-foreground">{item.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
