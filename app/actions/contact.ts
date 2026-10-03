"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { getSession } from "@/app/actions/auth";
import { sendInquiry, type Inquiry } from "@/lib/send-inquiry";
import { isAllowedRfqFile, isRfqRateLimited } from "@/lib/rfq-guards";
import { FALLBACK_DATA } from "@/lib/fallback-data";

const ContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  company: z.string().min(2, "Nama perusahaan minimal 2 karakter").max(200),
  email: z.string().email("Format email tidak valid").max(320).toLowerCase(),
  product: z.string().max(1000).optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
});

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContactAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    email: formData.get("email") as string,
    product: formData.get("product") as string,
    message: formData.get("message") as string,
  };

  // Honeypot: bots filling hidden fields do not reach the database or mailer.
  if (formData.get("website")) return { success: true, message: "Terima kasih! Permintaan Anda diterima." };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Mohon periksa kembali data yang Anda masukkan.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  
  const productIds = (parsed.data.product || "").split(",").filter(Boolean);
  if (productIds.length > 10) return { success: false, message: "Maksimal 10 produk referensi." };
  const validAttachments = formData.getAll("attachment").filter((file): file is File => file instanceof File && file.size > 0);
  if (validAttachments.length > 5 || validAttachments.reduce((total, file) => total + file.size, 0) > 10 * 1024 * 1024) {
    return { success: false, message: "Maksimal 5 lampiran dengan total ukuran 10 MB." };
  }

  // ponytail: DB count limits are shared across replicas but not atomic under bursts; add WAF-level throttling if traffic grows.
  const since = new Date(Date.now() - 15 * 60_000);
  let selectedProducts: { id: string; name: string; imageUrl?: string | null; image?: string }[] = [];
  try {
    const [fromEmail, recentTotal] = await Promise.all([
      prisma.contactRequest.count({ where: { email: parsed.data.email, createdAt: { gte: since } } }),
      prisma.contactRequest.count({ where: { createdAt: { gte: new Date(Date.now() - 5 * 60_000) } } }),
    ]);
    if (isRfqRateLimited(fromEmail, recentTotal)) {
      return { success: false, message: "Terlalu banyak permintaan. Coba kembali beberapa saat lagi." };
    }
    const products = productIds.length ? await prisma.product.findMany({ where: { id: { in: productIds } } }) : [];
    selectedProducts = productIds.map((id) => products.find((product) => product.id === id) || FALLBACK_DATA.products.find((product) => product.id === id)).filter((product) => product !== undefined);
  } catch (error) {
    console.error("RFQ validation error:", error);
    return { success: false, message: "Layanan sedang tidak tersedia. Silakan coba lagi nanti." };
  }
  const productName = selectedProducts.map((product) => product.name).join("|||");
  const productImage = selectedProducts[0]?.imageUrl || selectedProducts[0]?.image || "";

  const savedAttachments: Inquiry["attachments"] = [];
  try {
    if (validAttachments.length) {
      const folder = parsed.data.email.replace(/[^a-zA-Z0-9.\-_@]/g, "_");
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
      fs.mkdirSync(uploadDir, { recursive: true });
      for (const file of validAttachments) {
        const content = Buffer.from(await file.arrayBuffer());
        if (!isAllowedRfqFile(file.name, content)) {
          throw new Error("Format lampiran tidak sesuai atau file rusak.");
        }
        const ext = file.name.toLowerCase().split(".").pop();
        const fileName = `contact-${randomUUID()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, content, { flag: "wx" });
        savedAttachments.push({ filename: path.basename(file.name).slice(0, 100), path: filePath, url: `/uploads/${folder}/${fileName}` });
      }
    }
  } catch (error) {
    for (const file of savedAttachments) fs.rmSync(file.path, { force: true });
    console.error("RFQ attachment error:", error);
    return { success: false, message: "Lampiran tidak valid atau gagal disimpan. Gunakan PDF, DOC, DOCX, JPG, atau PNG." };
  }
  const attachmentUrl = savedAttachments.map((file) => file.url).join(",") || null;

  try {
    await prisma.contactRequest.create({
      data: {
        name: parsed.data.name,
        company: parsed.data.company,
        email: parsed.data.email,
        product: selectedProducts.map((product) => product.id).join(","),
        message: parsed.data.message,
        attachment: attachmentUrl
      },
    });

    // Email errors are logged; the RFQ remains available to staff in the dashboard.
    try {
      await sendInquiry({
        name: parsed.data.name,
        company: parsed.data.company,
        email: parsed.data.email,
        productName,
        productImage,
        subject: `Inquiry Konsultasi Baru: ${parsed.data.name} - ${parsed.data.company}`,
        message: parsed.data.message,
        attachments: savedAttachments,
      });
    } catch (emailError) {
      console.error("Failed to send RFQ notification:", emailError);
    }

    return {
      success: true,
      message: "Terima kasih! Tim PT VEA akan menghubungi Anda dalam 1x24 jam kerja.",
    };
  } catch (error) {
    for (const file of savedAttachments) fs.rmSync(file.path, { force: true });
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan teknis. Silakan coba lagi atau hubungi kami melalui WhatsApp.",
    };
  }
}

export async function deleteContactAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Enforce authentication guard
    const session = await getSession();
    if (!session) {
      return { success: false, message: "Akses ditolak: Sesi tidak valid." };
    }

    const contact = await prisma.contactRequest.findUnique({
      where: { id },
    });

    if (!contact) {
      return { success: false, message: "Pesan tidak ditemukan." };
    }

    // Delete associated files safely within public directory
    if (contact.attachment) {
      const paths = contact.attachment.split(",").map(p => p.trim()).filter(Boolean);
      const publicDir = path.resolve(process.cwd(), "public");

      for (const p of paths) {
        if (p.startsWith("/uploads")) {
          const absolutePath = path.resolve(publicDir, p.replace(/^\/+/, ""));
          if (absolutePath.startsWith(publicDir) && fs.existsSync(absolutePath)) {
            try {
              fs.unlinkSync(absolutePath);
              const dirPath = path.dirname(absolutePath);
              if (dirPath.startsWith(publicDir) && fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
                fs.rmdirSync(dirPath);
              }
            } catch (err) {
              console.error("Gagal menghapus file lampiran:", err);
            }
          }
        }
      }
    }

    await prisma.contactRequest.delete({
      where: { id },
    });
    
    revalidatePath("/internal-admin/contacts");
    return { success: true, message: "Pesan berhasil dihapus." };
  } catch (error) {
    console.error("Delete contact error:", error);
    return { success: false, message: "Gagal menghapus pesan konsultasi." };
  }
}
