import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ptvea.co.id' },
    update: {},
    create: {
      email: 'admin@ptvea.co.id',
      password: hashedPassword,
      fullName: 'Super Admin',
      role: 'admin',
      isActive: true,
    },
  })

  const rawHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Konsultasi Baru</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 40px 10px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
    
    /* Header Industrial */
    .header { background-color: #0f172a; padding: 40px; text-align: left; border-bottom: 4px solid #f59e0b; }
    .header .badge { display: inline-block; padding: 4px 12px; background-color: #f59e0b; color: #0f172a; font-size: 11px; font-weight: 800; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; line-height: 1.2; }
    
    .body-content { padding: 40px; }
    
    /* Stats/Info Grid */
    .section-label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; display: block; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .info-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 12px; }
    .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
    .value { font-size: 15px; color: #0f172a; font-weight: 600; }
    
    /* Highlight Produk */
    .product-highlight { display: flex; align-items: center; gap: 20px; background-color: #fff7ed; border: 1px dashed #fdba74; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .product-image { width: 80px; height: 80px; border-radius: 6px; object-fit: cover; border: 1px solid #fed7aa; background-color: #ffffff; }
    .product-name { font-size: 18px; color: #9a3412; font-weight: 700; margin: 0; }
    
    /* Message Box */
    .message-container { background-color: #ffffff; border-left: 4px solid #0f172a; padding: 20px; font-style: italic; color: #475569; line-height: 1.6; background-color: #f8fafc; }
    
    .footer { background-color: #0f172a; padding: 30px 40px; text-align: center; }
    .footer p { margin: 0; font-size: 12px; color: #94a3b8; }
    .footer .brand { color: #ffffff; font-weight: 700; font-size: 14px; margin-bottom: 8px; display: block; }
    
    .btn { display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Inquiry Masuk</span>
      <h1>{{subject}}</h1>
    </div>
    
    <div class="body-content">
      <span class="section-label">Profil Prospek</span>
      
      <div class="info-card">
        <div class="label">Nama Pengirim</div>
        <div class="value">{{name}}</div>
      </div>
      
      <div class="info-card">
        <div class="label">Instansi / Perusahaan</div>
        <div class="value">{{company}}</div>
      </div>
      
      <div class="info-card">
        <div class="label">Email Kontak</div>
        <div class="value">{{email}}</div>
      </div>

      <div style="margin-top: 30px;">
        <span class="section-label">Ketertarikan Produk</span>
        <div class="product-highlight">
          <img src="{{productImage}}" alt="Product" class="product-image" onerror="this.style.display='none'" />
          <p class="product-name">📦 {{product}}</p>
        </div>
      </div>

      <span class="section-label">Pesan / Kebutuhan Tambahan</span>
      <div class="message-container">
        "{{message}}"
      </div>

      <center>
        <a href="mailto:{{email}}" class="btn">Balas Email Sekarang</a>
      </center>
    </div>
    
    <div class="footer">
      <span class="brand">PT Vanguard Energy Amanah</span>
      <p>Automated Inquiry System • <a href="https://ptvea.com" style="color: #f59e0b; text-decoration: none;">ptvea.com</a></p>
      <p style="margin-top: 15px; opacity: 0.6;">Harap respons inquiry ini dalam waktu 1x24 jam untuk menjaga SLA pelayanan.</p>
    </div>
  </div>
</body>
</html>`;

  await prisma.appSettings.upsert({
    where: { id: "global" },
    update: {
      emailHtml: rawHtml,
      emailAttachProduct: true,
      whatsappNumber: "628123456789",
      whatsappMessage: "Halo PT VEA, saya ingin berkonsultasi mengenai layanan energi Anda.",
    },
    create: {
      id: "global",
      emailFrom: "PT VEA <noreply@ptvea.com>",
      emailTo: "sales@ptvea.com",
      emailSubject: "Konsultasi Baru: {{name}} - {{company}}",
      emailHtml: rawHtml,
      emailAttachProduct: true,
      whatsappNumber: "628123456789",
      whatsappMessage: "Halo PT VEA, saya ingin berkonsultasi mengenai layanan energi Anda.",
    }
  });

  console.log('✅ Default admin user created/verified:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Password: admin123`)
  console.log(`✅ Default App Settings Seeded.`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
