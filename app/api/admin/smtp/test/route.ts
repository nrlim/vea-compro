import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { decryptPassword } from "@/lib/smtp-crypto";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  const user = await verifyToken(token);
  if (!user) return null;
  if (user.role !== "admin" && user.role !== "super_admin") return null;
  return user;
}

// ─── POST /api/admin/smtp/test ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const actor = await requireAdmin();
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const testEmail: string | undefined = body?.testEmail;

    // Fetch SMTP config from DB
    const settings = await prisma.smtpSettings.findUnique({
      where: { id: "smtp_global" },
    });

    if (!settings) {
      return NextResponse.json(
        { success: false, error: "SMTP settings not configured yet." },
        { status: 422 }
      );
    }

    let decryptedPass = "";
    try {
      decryptedPass = decryptPassword(settings.smtpPassEnc);
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to decrypt SMTP password. Settings may be corrupt." },
        { status: 500 }
      );
    }

    // Build secure setting based on encryption type
    const encryptionMap: Record<string, { secure: boolean; requireTLS: boolean }> = {
      SSL: { secure: true, requireTLS: false },
      TLS: { secure: false, requireTLS: true },
      None: { secure: false, requireTLS: false },
    };
    const tlsOptions = encryptionMap[settings.smtpEncryption] ?? encryptionMap.TLS;

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: tlsOptions.secure,
      requireTLS: tlsOptions.requireTLS,
      auth: {
        user: settings.smtpUser,
        pass: decryptedPass,
      },
      connectionTimeout: 10_000, // 10 seconds
      greetingTimeout: 10_000,
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (verifyErr: any) {
      // Persist failure status
      await prisma.smtpSettings.update({
        where: { id: "smtp_global" },
        data: {
          lastTestStatus: "error",
          lastTestMsg: verifyErr.message || "Connection failed",
          lastTestedAt: new Date(),
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          action: "SMTP_TEST_FAIL",
          actorId: actor.id as string,
          actorEmail: actor.email as string,
          ipAddress:
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
          details: verifyErr.message,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: parseSmtpError(verifyErr.message),
        },
        { status: 422 }
      );
    }

    // Optionally send a test email
    const recipientEmail = testEmail || (actor.email as string);
    const info = await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to: recipientEmail,
      subject: "✅ SMTP Gateway Test — PT VEA Admin Panel",
      html: buildTestEmailHtml(settings.fromName, settings.smtpHost, settings.smtpPort),
    });

    // Persist success status
    await prisma.smtpSettings.update({
      where: { id: "smtp_global" },
      data: {
        lastTestStatus: "success",
        lastTestMsg: `Test email sent to ${recipientEmail} (msgId: ${info.messageId})`,
        lastTestedAt: new Date(),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "SMTP_TEST_SUCCESS",
        actorId: actor.id as string,
        actorEmail: actor.email as string,
        ipAddress:
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
        details: `Test email successfully relayed to ${recipientEmail} via ${settings.smtpHost}:${settings.smtpPort}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${recipientEmail}`,
      messageId: info.messageId,
    });
  } catch (err: any) {
    console.error("[SMTP Test] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during SMTP test." },
      { status: 500 }
    );
  }
}

// ─── Error message parser ─────────────────────────────────────────────────────

function parseSmtpError(msg: string): string {
  if (!msg) return "Unknown SMTP error.";
  const lower = msg.toLowerCase();
  if (lower.includes("authentication") || lower.includes("invalid login") || lower.includes("535"))
    return "Authentication failed: Invalid username or password.";
  if (lower.includes("econnrefused") || lower.includes("connect"))
    return "Connection refused: The SMTP server is unreachable. Check the host and port.";
  if (lower.includes("timeout") || lower.includes("etimedout"))
    return "Connection timed out: The server did not respond in time. Firewall or wrong port?";
  if (lower.includes("certificate") || lower.includes("self signed"))
    return "TLS/SSL certificate error: The server's certificate is invalid or untrusted.";
  return msg;
}

// ─── Test email HTML ──────────────────────────────────────────────────────────

function buildTestEmailHtml(fromName: string, host: string, port: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SMTP Test</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.07);">
    <div style="background: #0f172a; padding: 32px 40px; border-bottom: 4px solid #eab308;">
      <p style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">PT Vanguard Energy Amanah</p>
      <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 600;">SMTP Gateway Test ✅</h1>
    </div>
    <div style="padding: 40px;">
      <p style="color: #334155; line-height: 1.7; margin: 0 0 20px; font-size: 15px;">
        Congratulations! This test email confirms that your SMTP gateway is correctly configured and operational.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Connection Details</p>
        <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Host:</strong> ${host}</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: #0f172a;"><strong>Port:</strong> ${port}</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: #0f172a;"><strong>From:</strong> ${fromName}</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: #22c55e; font-weight: 700;"><strong>Status:</strong> Connected & Authenticated</p>
      </div>
      <p style="color: #64748b; font-size: 13px; margin: 0;">
        This is an automated test from the PT VEA Admin Panel. No action is required.
      </p>
    </div>
    <div style="background: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">© ${new Date().getFullYear()} PT Vanguard Energy Amanah · Admin Panel</p>
    </div>
  </div>
</body>
</html>`;
}
