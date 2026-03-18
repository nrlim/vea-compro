"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

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
  
  const attachment = formData.get("attachment") as File | null;
  let attachmentUrl: string | null = null;
  let attachmentName: string | null = null;

  if (attachment && attachment.size > 0) {
    if (attachment.size > 10 * 1024 * 1024) {
      return {
        success: false,
        message: "Ukuran file attachment maksimal 10MB.",
      };
    }
    
    try {
      const arrayBuffer = await attachment.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = attachment.name.replace(/[^a-zA-Z0-9.-]/g, "_").split(".")[0].slice(0, 40);
      const ext = attachment.name.split('.').pop();
      const fileName = `contact-${Date.now()}-${safeName}.${ext}`;
      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "vea-storage";
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: attachment.type || "application/octet-stream",
          cacheControl: "3600",
          upsert: false,
        });
        
      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);
        attachmentUrl = publicUrl;
        attachmentName = attachment.name;
      }
    } catch(err) {
      console.error("Attachment upload error", err);
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
