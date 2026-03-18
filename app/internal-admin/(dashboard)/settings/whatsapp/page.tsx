import type { Metadata } from "next";
import { getAppSettings } from "@/app/actions/settings";
import { WhatsAppSettingsClient } from "../_components/whatsapp-settings-client";

export const metadata: Metadata = { title: "WhatsApp Channel Settings" };

export default async function WhatsAppSettingsPage() {
  const { data: settings } = await getAppSettings();
  return <WhatsAppSettingsClient initialSettings={settings} />;
}
