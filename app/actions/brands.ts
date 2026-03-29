"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/actions/auth";
import fs from "fs";
import path from "path";

export type Brand = {
  id: string;
  name: string;
  logoUrl: string;
  description: string | null;
  category: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function getBrands(): Promise<{ data: Brand[]; error: string | null }> {
  try {
    const data = await prisma.brand.findMany({
      orderBy: { order: "asc" },
    });
    return { data: data as Brand[], error: null };
  } catch (error: unknown) {
    return { data: [], error: (error as Error).message };
  }
}

async function handleFileUpload(file: File | null, oldUrl?: string): Promise<string | null> {
  if (!file || file.size === 0) return oldUrl || null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "brands");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  // If there's an old image, try to delete it
  if (oldUrl && oldUrl.startsWith("/uploads/brands/")) {
    const oldFileName = path.basename(oldUrl);
    const oldFilePath = path.join(uploadDir, oldFileName);
    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
      } catch (err) {
        console.warn("Could not delete old image:", err);
      }
    }
  }

  return `/uploads/brands/${fileName}`;
}

export async function createBrand(formData: FormData): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const file = formData.get("file") as File | null;
    const isActive = formData.get("isActive") === "true";

    if (!name) return { error: "Name is required" };
    if (!file || file.size === 0) return { error: "Logo is required" };

    const logoUrl = await handleFileUpload(file);

    if (!logoUrl) return { error: "Failed to upload logo" };

    // Get max order
    const maxOrderBrand = await prisma.brand.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    const order = (maxOrderBrand?.order ?? -1) + 1;

    await prisma.brand.create({
      data: {
        name,
        description: description || null,
        category: category || null,
        logoUrl,
        order,
        isActive,
      },
    });

    revalidatePath("/internal-admin/brands");
    revalidatePath("/brands");
    return { error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

export async function updateBrand(id: string, formData: FormData): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const file = formData.get("file") as File | null;
    const isActive = formData.get("isActive") === "true";
    const oldImageUrl = formData.get("oldImageUrl") as string | undefined;

    if (!name) return { error: "Name is required" };

    let logoUrl = oldImageUrl;
    if (file && file.size > 0) {
      const newUrl = await handleFileUpload(file, oldImageUrl);
      if (newUrl) logoUrl = newUrl;
    }

    if (!logoUrl) return { error: "Logo is required" };

    await prisma.brand.update({
      where: { id },
      data: {
        name,
        description: description || null,
        category: category || null,
        logoUrl,
        isActive,
      },
    });

    revalidatePath("/internal-admin/brands");
    revalidatePath("/brands");
    return { error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

export async function deleteBrand(id: string): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    const brand = await prisma.brand.findUnique({ where: { id } });
    if (brand && brand.logoUrl && brand.logoUrl.startsWith("/uploads/brands/")) {
      const fileName = path.basename(brand.logoUrl);
      const filePath = path.join(process.cwd(), "public", "uploads", "brands", fileName);
      if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
      }
    }

    await prisma.brand.delete({ where: { id } });

    revalidatePath("/internal-admin/brands");
    revalidatePath("/brands");
    return { error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

export async function reorderBrands(items: { id: string; order: number }[]): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    // Run in transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.brand.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/internal-admin/brands");
    revalidatePath("/brands");
    return { error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}
