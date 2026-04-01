import type { Metadata } from "next";
import Link from "next/link";
import { 
  Server, 
  MessageCircle, 
  Mail, 
  Workflow, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export const metadata: Metadata = { title: "Settings Center" };

const menuItems = [
  {
    title: "SMTP Gateway",
    desc: "Configure the backend mail server (Host, Port, Auth)",
    icon: Server,
    color: "bg-navy/5 text-navy",
    border: "border-navy/10",
    href: "/internal-admin/settings/smtp"
  },
  {
    title: "Email Workflows",
    desc: "Manage email configurations, target recipients, and design HTML templates for different events",
    icon: Workflow,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
    href: "/internal-admin/email-templates"
  },
  {
    title: "WhatsApp Channel",
    desc: "Update the direct contact number and conversation opener",
    icon: MessageCircle,
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
    href: "/internal-admin/settings/whatsapp"
  }
];

export default function SettingsCenter() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold text-navy tracking-tight font-serif italic">Settings Center</h2>
        <p className="text-slate-500 mt-2 text-sm max-w-md">
          Modular configuration for communication gateways, lead delivery, and dynamic content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="group block p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-navy/20 transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${item.color} border ${item.border} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-navy group-hover:text-blue-600 transition-colors uppercase tracking-wide text-xs">
                    {item.title}
                  </h3>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-navy transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-6 bg-navy/5 border border-navy/10 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-navy rounded-lg">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-navy text-sm uppercase tracking-wider">Access Control Policies</h4>
          <p className="text-xs text-navy/60 mt-1 leading-relaxed max-w-xl">
            Some modules are restricted to <strong>Super Admin</strong> roles due to their sensitive nature (SMTP keys, etc). Changes are tracked in the global audit rail.
          </p>
        </div>
      </div>
    </div>
  );
}
