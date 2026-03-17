import type { Metadata } from "next";
import { getAppSettings } from "@/app/actions/settings";
import { SettingsClient } from "./_components/settings-client";

export const metadata: Metadata = { title: "App Settings" };

export default async function SettingsPage() {
  const { data: settings, error } = await getAppSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy tracking-tight font-serif">Email Templates & Settings</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Control the contact form recipients, template layouts, and auto-responders.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Failed to load settings: {error}
        </div>
      )}

      {settings && <SettingsClient initialSettings={settings} />}
    </div>
  );
}
