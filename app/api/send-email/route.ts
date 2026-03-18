import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { getDecryptedSmtpConfig } from "@/app/actions/smtp-settings";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, subject, message, productName, productImage, attachmentUrl, attachmentName } = body;

    // 1. Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, subject, message)" },
        { status: 400 }
      );
    }

    // Process local product image URL mapping to absolute for email rendering
    let absoluteProductImageUrl = productImage;
    if (productImage && productImage.startsWith('/')) {
      absoluteProductImageUrl = `https://ptvea.com${productImage}`;
    }

    // 2. Email Template (Paragraph style)
    const htmlEmail = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Inquiry Konsultasi Baru</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
    
    <tr>
      <td style="background-color: #0f172a; padding: 40px; border-bottom: 4px solid #f59e0b;">
        <span style="display: inline-block; padding: 4px 12px; background-color: #f59e0b; color: #0f172a; font-size: 11px; font-weight: 800; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Inquiry Masuk</span>
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; line-height: 1.2;">${subject}</h1>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px;">
        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Profil Prospek</span>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Nama Pengirim</div>
              <div style="font-size: 15px; color: #0f172a; font-weight: 600;">${name}</div>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Instansi / Perusahaan</div>
              <div style="font-size: 15px; color: #0f172a; font-weight: 600;">${company || 'Menunggu Konfirmasi'}</div>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Email Kontak</div>
              <div style="font-size: 15px; color: #0f172a; font-weight: 600;">${email}</div>
            </td>
          </tr>
        </table>

        ${productName ? `
        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Ketertarikan Produk</span>
        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #fff7ed; border: 1px dashed #fdba74; border-radius: 8px; margin-bottom: 30px;">
          <tr>
            <td>
              <p style="font-size: 18px; color: #9a3412; font-weight: 700; margin: 0;">📦 ${productName}</p>
            </td>
          </tr>
        </table>
        ` : ''}

        ${attachmentUrl ? `
        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Lampiran Tambahan</span>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              <div style="font-size: 15px; color: #0f172a; font-weight: 600;"><a href="${attachmentUrl}" target="_blank" style="color: #2563eb; text-decoration: none;">📄 ${attachmentName || 'Unduh Dokumen'}</a></div>
            </td>
          </tr>
        </table>
        ` : ''}

        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Pesan / Kebutuhan Tambahan</span>
        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #0f172a; margin-bottom: 30px;">
          <tr>
            <td style="font-style: italic; color: #475569; line-height: 1.6; white-space: pre-wrap;">"
${message}
"</td>
          </tr>
        </table>

        <table width="100%">
          <tr>
            <td align="center">
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Balas Email Sekarang</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="background-color: #0f172a; padding: 30px 40px; text-align: center;">
        <span style="color: #ffffff; font-weight: 700; font-size: 14px; margin-bottom: 8px; display: block;">PT Vanguard Energy Amanah</span>
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Automated Inquiry System • <a href="https://ptvea.com" style="color: #f59e0b; text-decoration: none;">ptvea.com</a></p>
        <p style="margin-top: 15px; font-size: 12px; color: #94a3b8; opacity: 0.6;">Harap respons inquiry ini dalam waktu 1x24 jam untuk menjaga SLA pelayanan.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 2. Fetch AppSettings and SmtpSettings
    let settings = null;
    let smtpConfig = null;
    try {
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();
      settings = await prisma.appSettings.findUnique({ where: { id: "global" }});
      smtpConfig = await getDecryptedSmtpConfig();
    } catch(err) {
      console.error("Failed to fetch settings from DB in API Route", err);
    }

    const defaultFrom = "PT VEA <noreply@ptvea.com>";
    const defaultTo = "sales@ptvea.com";
    
    // Process Subject (Parse tags)
    let finalSubject = settings?.emailSubject || `Inquiry Konsultasi Baru: {{name}} - {{company}}`;
    finalSubject = finalSubject.replace(/\{\{name\}\}/g, name);
    finalSubject = finalSubject.replace(/\{\{company\}\}/g, company || "N/A");

    // BCC Logic
    let bccList: string[] = [];
    if (settings?.emailBcc) {
      bccList = settings.emailBcc.split(",").map((s: string) => s.trim()).filter((s: string) => s);
    } else if (process.env.OWNER_EMAIL) {
      bccList = [process.env.OWNER_EMAIL];
    }

    // Process HTML Template
    let finalHtml = "";
    if (settings?.emailHtml && settings.emailHtml.trim().length > 0) {
      // User has custom HTML in settings, parse the tags
      finalHtml = settings.emailHtml
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{company\}\}/g, company || "N/A")
        .replace(/\{\{email\}\}/g, email)
        .replace(/\{\{product\}\}/g, productName || "Belum dipilih")
        .replace(/\{\{productImage\}\}/g, absoluteProductImageUrl || "")
        .replace(/\{\{subject\}\}/g, finalSubject)
        .replace(/\{\{attachment\}\}/g, attachmentUrl ? `<a href="${attachmentUrl}">Lihat Lampiran</a>` : "Tidak ada lampiran")
        .replace(/\{\{message\}\}/g, message);
    } else {
      // Use beautifully designed hardcoded fallback
      finalHtml = htmlEmail; // (The htmlEmail variable from above)
    }

    // 3. Prepare Attachments
    const attachments = [];
    if (absoluteProductImageUrl && (settings?.emailAttachProduct !== false)) {
      const isPng = absoluteProductImageUrl.toLowerCase().endsWith('.png');
      const safeProductName = productName ? productName.replace(/[^a-z0-9]/gi, '_') : 'referensi';
      
      attachments.push({
        filename: `Produk_${safeProductName}.${isPng ? 'png' : 'jpg'}`,
        path: absoluteProductImageUrl,
      });
    }

    if (attachmentUrl) {
      attachments.push({
        filename: attachmentName || `Lampiran_${Date.now()}`,
        path: attachmentUrl,
      });
    }

    // 4. Send email using dynamically configured SMTP gateway, or fallback to Resend
    let sendResult: any = null;
    let finalFrom = settings?.emailFrom || defaultFrom;
    const finalTo = [settings?.emailTo || defaultTo];
    
    if (smtpConfig && smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
      // Use Custom SMTP via Nodemailer
      finalFrom = `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`;
      
      const encryptionMap: Record<string, { secure: boolean; requireTLS: boolean }> = {
        SSL: { secure: true, requireTLS: false },
        TLS: { secure: false, requireTLS: true },
        None: { secure: false, requireTLS: false },
      };
      const tlsOptions = encryptionMap[smtpConfig.encryption] ?? encryptionMap.TLS;

      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: tlsOptions.secure,
        requireTLS: tlsOptions.requireTLS,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

      const info = await transporter.sendMail({
        from: finalFrom,
        to: finalTo,
        bcc: bccList,
        subject: finalSubject,
        html: finalHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      sendResult = { messageId: info.messageId, method: "smtp" };
    } else {
      // Fallback to Resend
      const { data, error } = await resend.emails.send({
        from: finalFrom,
        to: finalTo,
        bcc: bccList,
        subject: finalSubject,
        html: finalHtml,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      if (error) {
        console.error("Resend API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      sendResult = { data, method: "resend" };
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully", data: sendResult },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
