"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/app/actions/auth";

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductFormData = {
  name: string;
  category: string;
  description: string;
  price?: string;
  imageUrl?: string;
};

// ── List ──────────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<{ data: Product[]; error: string | null }> {
  try {
    const data = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { data: data as Product[], error: null };
  } catch (error: unknown) {
    return { data: [], error: (error as Error).message };
  }
}

// ── Create ────────────────────────────────────────────────────────────────────
export async function createProduct(
  formData: ProductFormData
): Promise<{ id?: string; error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    const created = await (prisma.product as any).create({
      data: {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: formData.price ?? null,
        imageUrl: formData.imageUrl ?? null,
      },
    });
    revalidatePath("/internal-admin/products");
    return { id: created.id, error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  formData: ProductFormData
): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    await (prisma.product as any).update({
      where: { id },
      data: {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: formData.price ?? null,
        imageUrl: formData.imageUrl ?? null,
      },
    });
    revalidatePath("/internal-admin/products");
    return { error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized request" };

    await prisma.product.delete({ where: { id } });
    revalidatePath("/internal-admin/products");
    return { error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

// End of file
