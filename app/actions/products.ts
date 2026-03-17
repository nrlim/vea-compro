"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadFileToDrive } from "@/lib/google-drive";

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductFormData = {
  name: string;
  category: string;
  description: string;
  image_url?: string;
};

// ── List ──────────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<{ data: Product[]; error: string | null }> {
  try {
    const data = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { data, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
}

// ── Create ────────────────────────────────────────────────────────────────────
export async function createProduct(
  formData: ProductFormData
): Promise<{ error: string | null }> {
  try {
    await prisma.product.create({
      data: {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.image_url ?? null,
      },
    });
    revalidatePath("/internal-admin/products");
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  formData: ProductFormData
): Promise<{ error: string | null }> {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.image_url ?? null,
      },
    });
    revalidatePath("/internal-admin/products");
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/internal-admin/products");
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ── Image Upload ──────────────────────────────────────────────────────────────
export async function uploadProductImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { url: null, error: "No file uploaded" };
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    // Store in Google Drive
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    const driveUrl = await uploadFileToDrive(buffer, fileName, file.type || "image/jpeg");

    if (!driveUrl) {
      return { url: null, error: "Failed to upload to Google Drive. Check server logs." };
    }

    return { url: driveUrl, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
}
