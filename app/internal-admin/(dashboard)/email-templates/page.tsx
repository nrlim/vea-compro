import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Plus, Mail, Pencil, Trash2, Workflow } from "lucide-react";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = { title: "Email Workflows" };

export default async function EmailTemplatesPage() {
  const routes = await (prisma as any).emailRoute.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-navy tracking-tight font-serif italic">Email Workflows</h2>
          <p className="text-slate-500 mt-1 max-w-xl text-sm">
            Manage your email routing rules and outbound HTML templates for specific system triggers like Inquiry or Transactions.
          </p>
        </div>
        
        <Link 
          href="/internal-admin/email-templates/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl hover:bg-navy/90 transition-colors shadow-sm text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Configuration
        </Link>
      </div>

      <div className="p-1 border border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Configuration Name</th>
              <th className="px-6 py-4">Trigger Event</th>
              <th className="px-6 py-4">Target (To / BCC)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {routes.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400">
                  <Workflow className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No email workflows created yet.</p>
                </td>
              </tr>
            ) : null}
            {routes.map((route: any) => (
              <tr key={route.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-navy flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {route.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">{route.subjectTemplate}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                    {route.triggerEvent}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs space-y-1">
                    <div><span className="text-slate-400 font-medium">To:</span> {route.toEmail || <span className="italic text-slate-300">Dynamic (Customer)</span>}</div>
                    {route.bccEmail && <div><span className="text-slate-400 font-medium">BCC:</span> {route.bccEmail}</div>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    route.isActive 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${route.isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                    {route.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/internal-admin/email-templates/${route.id}`}
                    className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
