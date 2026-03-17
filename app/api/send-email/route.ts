import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, subject, message, productName, productImage } = body;

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

    // 2. Email Template (Premium Industrial/Corporate Redesign)
    const htmlEmail = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inquiry Konsultasi Baru</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            margin: 0;
            padding: 40px 20px;
            -webkit-font-smoothing: antialiased;
          }
          .email-wrapper {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: #0f172a; /* Slate 900 / Navy */
            padding: 32px 40px;
            text-align: left;
            position: relative;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #eab308 0%, #fef08a 100%); /* Gold accent */
          }
          .header p.subtitle {
            color: #94a3b8;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            margin: 0 0 8px 0;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: -0.01em;
          }
          .body-content {
            padding: 40px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 24px;
            margin-top: 0;
            padding-bottom: 12px;
            border-bottom: 2px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
          }
          @media only screen and (max-width: 480px) {
            .info-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }
          }
          .info-item {
            background: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
          }
          .info-value {
            font-size: 14px;
            font-weight: 500;
            color: #0f172a;
            word-break: break-word;
          }
          
          /* Product Highlights */
          .product-box {
            background: linear-gradient(to right, #fffbeb, #fefce8);
            border: 1px solid #fef08a;
            border-left: 4px solid #eab308;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 32px;
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .product-image {
            width: 80px;
            height: 80px;
            border-radius: 6px;
            object-fit: cover;
            border: 1px solid #fcd34d;
            background-color: #ffffff;
          }
          .product-details {
            flex: 1;
          }
          .product-label {
            font-size: 12px;
            font-weight: 700;
            color: #854d0e;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .product-value {
            font-size: 16px;
            font-weight: 600;
            color: #422006;
          }

          /* Message Box */
          .message-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 40px;
            position: relative;
          }
          .message-box::before {
            content: '"';
            position: absolute;
            top: 10px;
            left: 15px;
            font-size: 60px;
            color: #f1f5f9;
            font-family: serif;
            line-height: 1;
          }
          .message-text {
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
            white-space: pre-wrap;
            position: relative;
            z-index: 1;
            margin: 0;
          }
          
          .footer {
            background-color: #f8fafc;
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            margin: 0;
            font-size: 13px;
            color: #64748b;
            line-height: 1.5;
          }
          .footer a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <p class="subtitle">Platform Konsultasi PT VEA</p>
            <h1>${subject}</h1>
          </div>
          
          <div class="body-content">
            <h2 class="section-title">Informasi Prospek</h2>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nama Lengkap</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Perusahaan</div>
                <div class="info-value">${company || "Menunggu Konfirmasi"}</div>
              </div>
              <div class="info-item" style="grid-column: 1 / -1;">
                <div class="info-label">Alamat Email</div>
                <div class="info-value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
              </div>
            </div>

            ${productName ? `
            <div class="product-box">
              ${absoluteProductImageUrl ? `<img src="${absoluteProductImageUrl}" alt="${productName}" class="product-image" />` : ''}
              <div class="product-details">
                <div class="product-label">
                  <span style="font-size: 16px;">📦</span> Produk Referensi Terpilih
                </div>
                <div class="product-value">${productName}</div>
              </div>
            </div>
            ` : ''}

            <h2 class="section-title">Detail Kebutuhan</h2>
            <div class="message-box">
              <p class="message-text">${message}</p>
            </div>
            
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PT Vanguard Energy Amanah.</p>
            <p style="margin-top: 8px; font-size: 12px; color: #94a3b8;">
              Pesan ini dibuat secara otomatis dari <a href="https://ptvea.com">ptvea.com</a>.<br>
              Harap segera membalas email prospek dalam waktu 1x24 jam kerja.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. Fetch AppSettings
    let settings = null;
    try {
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();
      settings = await prisma.appSettings.findUnique({ where: { id: "global" }});
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

    // 4. Send email using Resend
    const { data, error } = await resend.emails.send({
      from: settings?.emailFrom || defaultFrom,
      to: [settings?.emailTo || defaultTo],
      bcc: bccList,
      subject: finalSubject,
      html: finalHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully", data },
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
