import { Resend } from "resend";
import { getSmtpConfig } from "@/lib/smtp";
import { prisma } from "@/lib/prisma";
import path from "node:path";
import fs from "node:fs";

export type Inquiry = {
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
  productName?: string;
  productImage?: string;
  attachments: { filename: string; path: string; url: string }[];
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]!);

export async function sendInquiry({ name, company, email, subject, message, productName, productImage, attachments }: Inquiry) {
    // Only local product images may be referenced or attached; never fetch a supplied URL.
    const publicDir = path.resolve(process.cwd(), "public");
    const localProductPath = productImage?.startsWith("/") && !productImage.startsWith("//")
      ? path.resolve(publicDir, productImage.slice(1)) : null;
    const validProductPath = localProductPath && localProductPath.startsWith(publicDir + path.sep)
      && /\.(png|jpe?g|webp|gif)$/i.test(localProductPath) && fs.existsSync(localProductPath) && fs.statSync(localProductPath).isFile()
      ? localProductPath : null;
    const absoluteProductImageUrl = validProductPath ? `https://ptvea.com${encodeURI(productImage!)}` : "";
    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    // Process productName for list format
    let formattedProductList = productName;
    let plainProductList = productName;
    if (productName && productName.includes('|||')) {
      const products = productName.split('|||');
      formattedProductList = '<ul style="margin: 0; padding-left: 20px; font-size: 16px; color: #9a3412; font-weight: 700;">' + products.map((p: string) => `<li style="margin-bottom: 4px;">📦 ${escapeHtml(p)}</li>`).join('') + '</ul>';
      plainProductList = products.join(', ');
    } else if (productName) {
      formattedProductList = `<p style="font-size: 18px; color: #9a3412; font-weight: 700; margin: 0;">📦 ${escapeHtml(productName)}</p>`;
      plainProductList = productName;
    }

    const attachmentHtmlLinks = attachments.map(({ filename, url }) =>
      `<div style="font-size: 15px; color: #0f172a; font-weight: 600; margin-bottom: 8px;"><a href="https://ptvea.com${encodeURI(url)}" target="_blank" style="color: #2563eb; text-decoration: none;">📄 ${escapeHtml(filename)}</a></div>`
    ).join("");

    // 2. Email Template
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
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; line-height: 1.2;">${safeSubject}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px;">
        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Profil Prospek</span>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Nama Pengirim</div>
              <div style="font-size: 15px; color: #0f172a; font-weight: 600;">${safeName}</div>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Instansi / Perusahaan</div>
              <div style="font-size: 15px; color: #0f172a; font-weight: 600;">${safeCompany}</div>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Email Kontak</div>
              <div style="font-size: 15px; color: #0f172a; font-weight: 600;">${safeEmail}</div>
            </td>
          </tr>
        </table>

        ${productName ? `
        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Ketertarikan Produk</span>
        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #fff7ed; border: 1px dashed #fdba74; border-radius: 8px; margin-bottom: 30px;">
          <tr>
            <td>
              ${formattedProductList}
            </td>
          </tr>
        </table>
        ` : ''}

        ${attachmentHtmlLinks ? `
        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Lampiran Tambahan</span>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
              ${attachmentHtmlLinks}
            </td>
          </tr>
        </table>
        ` : ''}

        <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block;">Pesan / Kebutuhan Tambahan</span>
        <table width="100%" cellpadding="20" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #0f172a; margin-bottom: 30px;">
          <tr>
            <td style="font-style: italic; color: #475569; line-height: 1.6; white-space: pre-wrap;">"
${safeMessage}
"</td>
          </tr>
        </table>

        <table width="100%">
          <tr>
            <td align="center">
              <a href="mailto:${safeEmail}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Balas Email Sekarang</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background-color: #0f172a; padding: 30px 40px; text-align: center;">
        <span style="color: #ffffff; font-weight: 700; font-size: 14px; margin-bottom: 8px; display: block;">PT Vanguard Energy Amanah</span>
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Automated Inquiry System • <a href="https://ptvea.com" style="color: #f59e0b; text-decoration: none;">ptvea.com</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 3. SMTP configuration is supplied by the server environment.
    const smtpConfig = getSmtpConfig();

    // Form uploads are always attached; the workflow option controls only the product image.
    const uploadedAttachments = attachments.map(({ filename, path: filePath }) => ({ filename, path: filePath }));
    const productImageAttachments: { filename: string; path: string }[] = [];
    if (validProductPath) {
      const imageExtension = path.extname(validProductPath).slice(1).toLowerCase();
      const safeProductName = plainProductList ? plainProductList.split(',')[0].replace(/[^a-z0-9]/gi, '_') : 'referensi';
      productImageAttachments.push({
        filename: `Produk_${safeProductName}.${imageExtension}`,
        path: validProductPath,
      });
    }

    // 4. Determine Configurations (Routes) using Singleton Prisma Client
    const routes = await prisma.emailRoute.findMany({
      where: { triggerEvent: "INQUIRY", isActive: true }
    });

    if (routes.length === 0) throw new Error("No active INQUIRY email route");
    if (!smtpConfig && !process.env.RESEND_API_KEY) throw new Error("Email delivery is not configured");

    const defaultTo = "sales@ptvea.com";
    const ccGlobalList = smtpConfig?.cc || [];
    const bccGlobalList = smtpConfig?.bcc || [];
    const transporter = smtpConfig?.transporter;
    const finalFrom = smtpConfig?.from || "PT VEA <noreply@ptvea.com>";

    // Send Emails Loop
    for (const route of routes) {
      let finalSubject = route.subjectTemplate || `Inquiry Konsultasi: {{name}}`;
      finalSubject = finalSubject.replace(/\{\{name\}\}/g, name)
                                 .replace(/\{\{company\}\}/g, company || "N/A");

      const routeHtml = route.htmlTemplate?.trim() ? route.htmlTemplate : htmlEmail;
      const finalHtml = routeHtml
        .replace(/\{\{name\}\}/g, safeName)
        .replace(/\{\{company\}\}/g, safeCompany)
        .replace(/\{\{email\}\}/g, safeEmail)
        .replace(/\{\{product\}\}/g, escapeHtml(plainProductList || "Belum dipilih"))
        .replace(/\{\{productImage\}\}/g, escapeHtml(absoluteProductImageUrl))
        .replace(/\{\{subject\}\}/g, escapeHtml(finalSubject))
        .replace(/\{\{attachment\}\}/g, attachmentHtmlLinks || "Tidak ada lampiran")
        .replace(/\{\{message\}\}/g, safeMessage);

      const targetEmail = route.toEmail && route.toEmail.trim() ? route.toEmail : defaultTo;
      
      let bccList = [...bccGlobalList];
      if (route.bccEmail) {
         const routeBcc = route.bccEmail.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean);
         bccList = [...new Set([...bccList, ...routeBcc])];
      }

      const emailAttachments = route.attachProduct
        ? [...uploadedAttachments, ...productImageAttachments]
        : uploadedAttachments;

      if (transporter) {
        await transporter.sendMail({
          from: finalFrom,
          to: targetEmail,
          cc: ccGlobalList,
          bcc: bccList,
          subject: finalSubject,
          html: finalHtml,
          attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
        });
      } else {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: finalFrom,
          to: targetEmail,
          cc: ccGlobalList,
          bcc: bccList,
          subject: finalSubject,
          html: finalHtml,
          attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
        });

        if (error) throw error;
      }
    }
}
