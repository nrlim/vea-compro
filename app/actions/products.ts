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
  manualUrl: string | null;
  datasheetUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductFormData = {
  name: string;
  category: string;
  description: string;
  price?: string;
  imageUrl?: string;
  manualUrl?: string;
  datasheetUrl?: string;
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
        manualUrl: formData.manualUrl ?? null,
        datasheetUrl: formData.datasheetUrl ?? null,
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
        manualUrl: formData.manualUrl ?? null,
        datasheetUrl: formData.datasheetUrl ?? null,
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

    // Find the product first to check if it has a local image that needs deleting
    const productToDelete = await prisma.product.findUnique({ where: { id } });

    // Ensure we actually found it
    if (productToDelete) {
      // If it exists and has an image path uploaded to the local VPS
      if (productToDelete.imageUrl && productToDelete.imageUrl.startsWith("/uploads/")) {
        const urlObj = new URL(productToDelete.imageUrl, "http://localhost");
        const filename = require("path").basename(urlObj.pathname);
        
        // Prevent path traversal
        if (!filename.includes("..") && !filename.includes("/")) {
          const filePath = require("path").join(process.cwd(), "public", "uploads", filename);
          if (require("fs").existsSync(filePath)) {
            // Delete the orphaned file from the VPS drive
            await require("fs/promises").unlink(filePath).catch((err: unknown) => {
              console.warn("[DeleteProduct] Could not delete image file on disk:", err);
            });
          }
        }
      }

      // Local doc delete
      if (productToDelete.manualUrl && productToDelete.manualUrl.startsWith("/uploads/docs/")) {
        const docUrlObj = new URL(productToDelete.manualUrl, "http://localhost");
        const docFilename = require("path").basename(docUrlObj.pathname);
        if (!docFilename.includes("..") && !docFilename.includes("/")) {
          const docFilePath = require("path").join(process.cwd(), "public", "uploads", "docs", docFilename);
          if (require("fs").existsSync(docFilePath)) {
            await require("fs/promises").unlink(docFilePath).catch(() => {});
          }
        }
      }

      if (productToDelete.datasheetUrl && productToDelete.datasheetUrl.startsWith("/uploads/docs/")) {
        const docUrlObj = new URL(productToDelete.datasheetUrl, "http://localhost");
        const docFilename = require("path").basename(docUrlObj.pathname);
        if (!docFilename.includes("..") && !docFilename.includes("/")) {
          const docFilePath = require("path").join(process.cwd(), "public", "uploads", "docs", docFilename);
          if (require("fs").existsSync(docFilePath)) {
            await require("fs/promises").unlink(docFilePath).catch(() => {});
          }
        }
      }
    }

    // Now delete the record from the physical database
    await prisma.product.delete({ where: { id } });
    
    revalidatePath("/internal-admin/products");
    return { error: null };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}

// End of file
