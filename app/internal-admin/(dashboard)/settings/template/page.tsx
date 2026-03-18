import type { Metadata } from "next";
import { getAppSettings } from "@/app/actions/settings";
import { TemplateSettingsClient } from "../_components/template-settings-client";

export const metadata: Metadata = { title: "Email Template Designer" };

export default async function TemplateSettingsPage() {
  const { data: settings } = await getAppSettings();
  return <TemplateSettingsClient initialSettings={settings} />;
}
