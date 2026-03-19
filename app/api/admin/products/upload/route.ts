import { NextRequest, NextResponse } from "next/server";
import { optimizeImage } from "@/lib/imageOptimizer";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// ── Constants ─────────────────────────────────────────────────────────────────
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB (pre-optimization)

/**
 * Resolves the absolute path to the public/uploads directory.
 * Works correctly in both local dev and production (process.cwd() = project root).
 */
function getUploadsDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}

/**
 * Ensures the uploads directory exists; creates it recursively if not.
 */
async function ensureUploadsDir(): Promise<void> {
  const dir = getUploadsDir();
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Deletes an old upload from the filesystem if its URL path matches
 * the local /uploads/ pattern (guards against deleting arbitrary files).
 */
async function deleteOldUpload(oldImageUrl: string): Promise<void> {
  try {
    // Only delete files that are local uploads (path starts with /uploads/)
    const url = new URL(oldImageUrl, "http://localhost");
    if (!url.pathname.startsWith("/uploads/")) return;

    const filename = path.basename(url.pathname);
    // Extra safety: reject path traversal
    if (filename.includes("..") || filename.includes("/")) return;

    const filePath = path.join(getUploadsDir(), filename);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (err) {
    console.warn("[Upload] Could not delete old image:", err);
  }
}

// ── POST Handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // ── Auth guard ─────────────────────────────────────────────────────────────
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 }
    );
  }

  // ── Parse multipart body ───────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      {
        error:
          "Failed to parse multipart form data. Ensure Content-Type is multipart/form-data.",
      },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json(
      { error: "No file provided in the 'file' field." },
      { status: 400 }
    );
  }

  // ── Validation ────────────────────────────────────────────────────────────
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      {
        error: `File too large. Maximum is 5 MB (received ${(file.size / 1024 / 1024).toFixed(1)} MB).`,
      },
      { status: 413 }
    );
  }

  const mimeType = file.type || "image/jpeg";
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json(
      {
        error: `Unsupported file type: "${mimeType}". Allowed: ${ALLOWED_TYPES.join(", ")}.`,
      },
      { status: 415 }
    );
  }

  const oldImageUrl = formData.get("oldImageUrl") as string | null;

  try {
    // ── Image Optimization Pipeline ──────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress with Sharp → WebP, max-width 800px, quality 50, strip EXIF
    const optimizedBuffer = await optimizeImage(buffer);

    // ── Build unique filename ─────────────────────────────────────────────────
    const safeName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .split(".")[0]
      .slice(0, 40);
    const fileName = `product-${Date.now()}-${safeName}.webp`;

    // ── Ensure upload directory exists ────────────────────────────────────────
    await ensureUploadsDir();

    // ── Delete old local image (if exists and is local) ───────────────────────
    if (oldImageUrl) {
      await deleteOldUpload(oldImageUrl);
    }

    // ── Write file to disk ────────────────────────────────────────────────────
    const destPath = path.join(getUploadsDir(), fileName);
    await writeFile(destPath, optimizedBuffer);

    // ── Build the relative public URL ─────────────────────────────────────────
    // Next.js serves /public/* as /* at the root, so /uploads/file.webp is correct.
    const publicUrl = `/uploads/${fileName}`;

    // ── Database Update (optional) ────────────────────────────────────────────
    // If a productId was sent in the form, update the record directly.
    const productId = formData.get("productId") as string | null;
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: { imageUrl: publicUrl },
      });
    }

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("[Upload] Image processing/write error:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred during image optimization or file write.",
      },
      { status: 500 }
    );
  }
}

// ── DELETE Handler (For cleanup when user cancels upload) ─────────────────────
export async function DELETE(req: NextRequest) {
  // ── Auth guard
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    await deleteOldUpload(url);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Upload] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
