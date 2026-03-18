import type { Metadata } from "next";
import { getAppSettings } from "@/app/actions/settings";
import { EmailSettingsClient } from "../_components/email-settings-client";

export const metadata: Metadata = { title: "Email Routing Settings" };

export default async function EmailSettingsPage() {
  const { data: settings } = await getAppSettings();
  return <EmailSettingsClient initialSettings={settings} />;
}
