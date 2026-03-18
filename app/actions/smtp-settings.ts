"use server";

import { prisma } from "@/lib/prisma";
import { cookies, headers } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { encryptPassword, decryptPassword } from "@/lib/smtp-crypto";
import { z } from "zod";

// ─── Auth helper ───────────────────────────────────────────────────────────────

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) throw new Error("Unauthorized");

  const user = await verifyToken(token);
  if (!user) throw new Error("Unauthorized");

  if (user.role !== "super_admin" && user.role !== "admin") {
    throw new Error("Forbidden: SUPER_ADMIN role required");
  }
  return user;
}

async function getClientIp(): Promise<string> {
  try {
    const hdrs = await headers();
    return (
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

// ─── Zod schema ───────────────────────────────────────────────────────────────

const SmtpSchema = z.object({
  smtpHost: z.string().min(1, "SMTP Host is required").regex(
    /^[a-zA-Z0-9.-]+$/,
    "Invalid hostname format"
  ),
  smtpPort: z.coerce
    .number()
    .int()
    .min(1, "Port must be ≥ 1")
    .max(65535, "Port must be ≤ 65535"),
  smtpEncryption: z.enum(["None", "SSL", "TLS"] as const, {
    error: "Encryption must be None, SSL, or TLS",
  }),
  smtpUser: z.string().min(1, "SMTP Username is required"),
  smtpPass: z.string().optional(),
  fromName: z.string().min(1, "From Name is required"),
  fromEmail: z.string().email("From Email must be a valid email address"),
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function getSmtpSettings() {
  try {
    await requireSuperAdmin();
    
    const settings = await prisma.smtpSettings.findUnique({
      where: { id: "smtp_global" },
    });
    if (!settings) return { data: null, error: null };

    // Never send the encrypted password to the client; send a masked placeholder instead
    return {
      data: {
        ...settings,
        smtpPassEnc: undefined, // strip from client payload
        hasPassword: !!settings.smtpPassEnc,
      },
      error: null,
    };
  } catch (err: any) {
    console.error("[SMTP] getSmtpSettings error:", err.message);
    return { data: null, error: err.message };
  }
}

// ─── Upsert ───────────────────────────────────────────────────────────────────

export async function upsertSmtpSettingsAction(formData: FormData) {
  try {
    const actor = await requireSuperAdmin();
    const ip = await getClientIp();

    const raw = {
      smtpHost: formData.get("smtpHost") as string,
      smtpPort: formData.get("smtpPort") as string,
      smtpEncryption: formData.get("smtpEncryption") as string,
      smtpUser: formData.get("smtpUser") as string,
      smtpPass: (formData.get("smtpPass") as string) || undefined,
      fromName: formData.get("fromName") as string,
      fromEmail: formData.get("fromEmail") as string,
    };

    const parsed = SmtpSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { smtpPass, ...rest } = parsed.data;

    // Determine the password to store
    let smtpPassEnc: string | undefined;
    if (smtpPass && smtpPass.trim().length > 0) {
      smtpPassEnc = encryptPassword(smtpPass.trim());
    }

    const updatePayload: any = { ...rest };
    if (smtpPassEnc) updatePayload.smtpPassEnc = smtpPassEnc;

    await prisma.smtpSettings.upsert({
      where: { id: "smtp_global" },
      update: updatePayload,
      create: {
        id: "smtp_global",
        ...rest,
        smtpPassEnc: smtpPassEnc || "",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "SMTP_UPDATE",
        actorId: actor.id as string,
        actorEmail: actor.email as string,
        ipAddress: ip,
        details: `Updated SMTP config: host=${rest.smtpHost}, port=${rest.smtpPort}, encryption=${rest.smtpEncryption}, user=${rest.smtpUser}`,
      },
    });

    return { success: true, message: "SMTP settings saved successfully." };
  } catch (err: any) {
    console.error("[SMTP] upsertSmtpSettingsAction error:", err.message);
    return { success: false, message: err.message || "Failed to save SMTP settings." };
  }
}

// ─── Decrypt helper for internal server use (mailer service) ─────────────────

export async function getDecryptedSmtpConfig() {
  const settings = await prisma.smtpSettings.findUnique({
    where: { id: "smtp_global" },
  });
  if (!settings) return null;

  let decryptedPass = "";
  try {
    decryptedPass = decryptPassword(settings.smtpPassEnc);
  } catch (err: any) {
    console.error("[SMTP] Failed to decrypt SMTP password:", err.message);
  }

  return {
    host: settings.smtpHost,
    port: settings.smtpPort,
    encryption: settings.smtpEncryption,
    user: settings.smtpUser,
    pass: decryptedPass,
    fromName: settings.fromName,
    fromEmail: settings.fromEmail,
  };
}

// ─── Update only last-test status (called from API route) ────────────────────

export async function updateSmtpTestStatus(
  status: "success" | "error",
  message: string
) {
  await prisma.smtpSettings.updateMany({
    where: { id: "smtp_global" },
    data: {
      lastTestStatus: status,
      lastTestMsg: message,
      lastTestedAt: new Date(),
    },
  });
}
