"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const AppSettingsSchema = z.object({
  emailFrom: z.string().min(1, "Email From is required"),
  emailTo: z.string().email("Invalid To email"),
  emailBcc: z.string().optional(),
  emailSubject: z.string().min(1, "Subject is required"),
  emailHtml: z.string().optional(),
  emailAttachProduct: z.boolean().default(true),
  whatsappNumber: z.string().min(1, "WhatsApp Number is required"),
  whatsappMessage: z.string().min(1, "WhatsApp Message is required"),
});

export async function getAppSettings() {
  try {
    let settings = await prisma.appSettings.findUnique({
      where: { id: "global" },
    });
    
    // Seed default if not exists
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: { id: "global" }
      });
    }

    return { data: settings, error: null };
  } catch (error: any) {
    console.error("Failed to fetch app settings:", error);
    return { data: null, error: error.message };
  }
}

export async function updateAppSettingsAction(formData: FormData) {
  try {
    const raw = {
      emailFrom: formData.get("emailFrom") as string,
      emailTo: formData.get("emailTo") as string,
      emailBcc: formData.get("emailBcc") as string,
      emailSubject: formData.get("emailSubject") as string,
      emailHtml: formData.get("emailHtml") as string,
      emailAttachProduct: formData.get("emailAttachProduct") === "true",
      whatsappNumber: formData.get("whatsappNumber") as string,
      whatsappMessage: formData.get("whatsappMessage") as string,
    };

    const parsed = AppSettingsSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid settings data.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    await prisma.appSettings.upsert({
      where: { id: "global" },
      update: parsed.data,
      create: {
        id: "global",
        ...parsed.data
      }
    });

    return {
      success: true,
      message: "Settings updated successfully.",
    };
  } catch (error: any) {
    console.error("Failed to update app settings:", error);
    return {
      success: false,
      message: error.message || "Failed to update settings.",
    };
  }
}
