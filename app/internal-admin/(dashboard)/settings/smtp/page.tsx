import type { Metadata } from "next";
import { getSmtpSettings } from "@/app/actions/smtp-settings";
import { getSession } from "@/app/actions/auth";
import { SmtpSettingsClient } from "../_components/smtp-settings-client";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = { title: "SMTP Gateway Settings" };

export default async function SmtpSettingsPage() {
  const user = await getSession();

  // Access control: only admin/super_admin may view SMTP settings
  if (!user) redirect("/internal-admin/login");
  if (user.role !== "admin" && user.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center p-8">
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Access Denied</h2>
          <p className="text-slate-500 mt-2 max-w-sm">
            You need <strong>Admin</strong> or <strong>Super Admin</strong> privileges to access
            the SMTP Gateway Configurator.
          </p>
        </div>
      </div>
    );
  }

  const { data: smtpSettings, error } = await getSmtpSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight font-serif">
            SMTP Gateway
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure the outbound mail server. Credentials are stored encrypted — never in{" "}
            <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">.env</code> files.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Failed to load SMTP settings: {error}
        </div>
      )}

      <SmtpSettingsClient
        initialSettings={smtpSettings as any}
        userEmail={user.email as string}
      />
    </div>
  );
}
