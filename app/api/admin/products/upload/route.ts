import { NextRequest, NextResponse } from "next/server";
import { optimizeImage } from "@/lib/imageOptimizer";
import { supabase } from "@/lib/supabaseClient";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // If productId is provided for direct DB update

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  // ── Auth guard ─────────────────────────────────────────────────────────────
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifyToken(token);
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  // ── Parse multipart body ───────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Failed to parse multipart form data. Ensure Content-Type is multipart/form-data." },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided in the 'file' field." }, { status: 400 });
  }

  // ── Validation ────────────────────────────────────────────────────────────
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      {
        error: `File too large. Maximum is 10 MB (received ${(file.size / 1024 / 1024).toFixed(1)} MB).`,
      },
      { status: 413 }
    );
  }

  const mimeType = file.type || "image/jpeg";
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported file type: "${mimeType}". Allowed: ${ALLOWED_TYPES.join(", ")}.` },
      { status: 415 }
    );
  }

  const oldImageUrl = formData.get("oldImageUrl") as string | null;

  try {
    // ── Image Optimization Pipeline ──────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress using sharp (WebP, max-width 800px, quality 50, stripped EXIF)
    const optimizedBuffer = await optimizeImage(buffer);

    // ── Supabase Storage Upload ──────────────────────────────────────────────
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").split(".")[0].slice(0, 40);
    const fileName = `product-${Date.now()}-${safeName}.webp`; // Always WebP

    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "vea-storage";

    // ── Delete Old Image (If exists) ─────────────────────────────────────────
    if (oldImageUrl) {
      try {
        // Extract the path from the old image URL
        // A typical Supabase URL looks like: https://something.supabase.co/storage/v1/object/public/vea-storage/product-1234.webp
        const urlParts = oldImageUrl.split("/");
        const publicIndex = urlParts.indexOf("public");
        if (publicIndex !== -1 && urlParts.length > publicIndex + 2) {
          // urlParts[publicIndex + 1] is the bucket name, the rest is the file path
          const oldFilePath = urlParts.slice(publicIndex + 2).join("/");
          
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([oldFilePath]);
            
          if (deleteError) {
            console.warn("Could not delete old image:", deleteError.message);
          }
        }
      } catch (err) {
        console.warn("Failed to parse or delete old image:", err);
      }
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, optimizedBuffer, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image to Supabase Storage." },
        { status: 502 }
      );
    }

    // Retrieve the Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);

    // ── Database Update (Optional) ──────────────────────────────────────────
    // If a productId was sent, we update the existing record directly
    const productId = formData.get("productId") as string | null;
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: { imageUrl: publicUrl },
      });
    }

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Image processing/upload error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during image optimization and upload." },
      { status: 500 }
    );
  }
}
