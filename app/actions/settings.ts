"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/app/actions/auth";

// --- Specialized Schemas ---

const EmailRoutingSchema = z.object({
  emailFrom: z.string().min(1, "Email From is required"),
  emailTo: z.string().email("Invalid To email"),
  emailBcc: z.string().optional(),
  emailSubject: z.string().min(1, "Subject is required"),
  emailAttachProduct: z.boolean().default(true),
});

const EmailTemplateSchema = z.object({
  emailHtml: z.string().optional(),
});

const WhatsAppSchema = z.object({
  whatsappNumber: z.string().min(1, "WhatsApp Number is required"),
  whatsappMessage: z.string().min(1, "WhatsApp Message is required"),
});

// --- Fetch Settings ---

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

// --- Modular Update Actions ---

export async function updateEmailRoutingAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, message: "Unauthorized request" };

    const raw = {
      emailFrom: formData.get("emailFrom") as string,
      emailTo: formData.get("emailTo") as string,
      emailBcc: formData.get("emailBcc") as string,
      emailSubject: formData.get("emailSubject") as string,
      emailAttachProduct: formData.get("emailAttachProduct") === "true",
    };

    const parsed = EmailRoutingSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, message: "Invalid routing data.", errors: parsed.error.flatten().fieldErrors };
    }

    await prisma.appSettings.upsert({
      where: { id: "global" },
      update: parsed.data,
      create: { id: "global", ...parsed.data }
    });

    return { success: true, message: "Email routing saved successfully." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateEmailTemplateAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, message: "Unauthorized request" };

    const raw = {
      emailHtml: formData.get("emailHtml") as string,
    };

    const parsed = EmailTemplateSchema.safeParse(raw);
    if (!parsed.success) return { success: false, message: "Invalid template data." };

    await prisma.appSettings.upsert({
      where: { id: "global" },
      update: parsed.data,
      create: { id: "global", ...parsed.data }
    });

    return { success: true, message: "Email template saved successfully." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateWhatsAppAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, message: "Unauthorized request" };

    const raw = {
      whatsappNumber: formData.get("whatsappNumber") as string,
      whatsappMessage: formData.get("whatsappMessage") as string,
    };

    const parsed = WhatsAppSchema.safeParse(raw);
    if (!parsed.success) return { success: false, message: "Invalid WhatsApp data.", errors: parsed.error.flatten().fieldErrors };

    await prisma.appSettings.upsert({
      where: { id: "global" },
      update: parsed.data,
      create: { id: "global", ...parsed.data }
    });

    return { success: true, message: "WhatsApp settings saved successfully." };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
