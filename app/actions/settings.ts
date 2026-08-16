"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/app/actions/auth";

const WhatsAppSchema = z.object({
  whatsappNumber: z.string().min(1, "WhatsApp Number is required"),
  whatsappMessage: z.string().min(1, "WhatsApp Message is required"),
});

const DEFAULT_SETTINGS = {
  id: "global",
  whatsappNumber: "6281319994160",
  whatsappMessage: "Halo PT VEA, saya ingin berkonsultasi mengenai layanan energi Anda.",
  updatedAt: new Date(),
};

// --- Fetch Settings ---

export async function getAppSettings() {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      return { data: DEFAULT_SETTINGS, error: null };
    }

    return { data: settings, error: null };
  } catch (error: any) {
    // Database may be offline during local dev or initial container boot
    return { data: DEFAULT_SETTINGS, error: error.message };
  }
}

// --- Modular Update Actions ---

export async function updateWhatsAppAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, message: "Unauthorized request" };

    const raw = {
      whatsappNumber: formData.get("whatsappNumber") as string,
      whatsappMessage: formData.get("whatsappMessage") as string,
    };

    const parsed = WhatsAppSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid WhatsApp data.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    await prisma.appSettings.upsert({
      where: { id: "global" },
      update: parsed.data,
      create: { id: "global", ...parsed.data },
    });

    return { success: true, message: "WhatsApp settings saved successfully." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
