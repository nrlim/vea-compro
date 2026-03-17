"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

  try {
    await prisma.contactRequest.create({
      data: parsed.data,
    });

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
