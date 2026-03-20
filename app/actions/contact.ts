"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import fs from "fs";
import path from "path";

const ContactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  company: z.string().min(2, "Nama perusahaan minimal 2 karakter").max(200),
  email: z.string().email("Format email tidak valid"),
  product: z.string().optional(),
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
    productName: formData.get("productName") as string,
    productImage: formData.get("productImage") as string,
    message: formData.get("message") as string,
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Mohon periksa kembali data yang Anda masukkan.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  
  const attachments = formData.getAll("attachment") as File[];
  const validAttachments = attachments.filter(a => a && a.size > 0);
  let attachmentUrl: string | null = null;
  let attachmentName: string | null = null;

  if (validAttachments.length > 0) {
    const totalSize = validAttachments.reduce((acc, curr) => acc + curr.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      return {
        success: false,
        message: "Total ukuran file attachment maksimal 10MB.",
      };
    }
    
    try {
      // Use parsed email to group uploads into distinct folders. Replace extremely odd characters to be safe.
      const safeEmailFolder = parsed.data.email.replace(/[^a-zA-Z0-9.\-_@]/g, "_");
      const uploadDir = path.join(process.cwd(), "public", "uploads", safeEmailFolder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const attachmentPaths: string[] = [];
      const attachmentNames: string[] = [];
      
      for (const attachment of validAttachments) {
        const arrayBuffer = await attachment.arrayBuffer();
        const uploadBuffer = Buffer.from(arrayBuffer);
        const safeName = attachment.name.replace(/[^a-zA-Z0-9.-]/g, "_").split(".")[0].slice(0, 40);
        const ext = attachment.name.split('.').pop() || "bin";
        const fileName = `contact-${Date.now()}-${safeName}.${ext}`;
        
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, uploadBuffer);
        
        attachmentPaths.push(`/uploads/${safeEmailFolder}/${fileName}`);
        attachmentNames.push(attachment.name);
      }
      
      attachmentUrl = attachmentPaths.join(',');
      attachmentName = attachmentNames.join(', ');

    } catch(err) {
      console.error("Attachment processing error", err);
    }
  }

  try {
    await prisma.contactRequest.create({
      data: {
        name: parsed.data.name,
        company: parsed.data.company,
        email: parsed.data.email,
        product: parsed.data.product,
        message: parsed.data.message,
        attachment: attachmentUrl
      },
    });

    // Trigger email via our new API Route
    try {
      // For local development, always use localhost. For production, use the public site URL.
      const baseUrl = process.env.NODE_ENV === "production" 
        ? (process.env.NEXT_PUBLIC_SITE_URL || "https://ptvea.com")
        : "http://localhost:3000";
        
      await fetch(`${baseUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          company: parsed.data.company,
          email: parsed.data.email,
          productName: raw.productName,
          productImage: raw.productImage,
          subject: `Inquiry Konsultasi Baru: ${parsed.data.name} - ${parsed.data.company}`,
          message: parsed.data.message,
          attachmentUrl,
          attachmentName,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send email API Route:", emailError);
    }

    return {
      success: true,
      message:
        "Terima kasih! Tim PT VEA akan menghubungi Anda dalam 1x24 jam kerja.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message:
        "Terjadi kesalahan teknis. Silakan coba lagi atau hubungi kami melalui WhatsApp.",
    };
  }
}

export async function deleteContactAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const contact = await prisma.contactRequest.findUnique({
      where: { id },
    });

    if (!contact) {
      return { success: false, message: "Pesan tidak ditemukan." };
    }

    // Delete associated files if any
    if (contact.attachment) {
      const paths = contact.attachment.split(",").map(p => p.trim()).filter(Boolean);
      for (const p of paths) {
        if (p.startsWith("/uploads")) {
          const absolutePath = path.join(process.cwd(), "public", p);
          if (fs.existsSync(absolutePath)) {
            try {
              fs.unlinkSync(absolutePath);
              // Check if directory is empty after deletion and remove it
              const dirPath = path.dirname(absolutePath);
              if (fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0) {
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
