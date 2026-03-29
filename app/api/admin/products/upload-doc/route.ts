import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// ── Constants ─────────────────────────────────────────────────────────────────
const ALLOWED_TYPES = ["application/pdf"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function getUploadsDir(): string {
  return path.join(process.cwd(), "public", "uploads", "docs");
}

async function ensureUploadsDir(): Promise<void> {
  const dir = getUploadsDir();
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function deleteOldUpload(oldDocUrl: string): Promise<void> {
  try {
    const url = new URL(oldDocUrl, "http://localhost");
    if (!url.pathname.startsWith("/uploads/docs/")) return;

    const filename = path.basename(url.pathname);
    if (filename.includes("..") || filename.includes("/")) return;

    const filePath = path.join(getUploadsDir(), filename);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (err) {
    console.warn("[Upload Doc] Could not delete old document:", err);
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await verifyToken(token);
  if (!session) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Failed to parse multipart form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum is 10 MB." }, { status: 413 });
  }

  const mimeType = file.type || "application/pdf";
  if (!ALLOWED_TYPES.includes(mimeType) && !file.name.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ error: `Unsupported file type. Please upload a PDF.` }, { status: 415 });
  }

  const oldDocUrl = formData.get("oldDocUrl") as string | null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").split(".")[0].slice(0, 40);
    const fileName = `doc-${Date.now()}-${safeName}.pdf`;

    await ensureUploadsDir();

    if (oldDocUrl) {
      await deleteOldUpload(oldDocUrl);
    }

    const destPath = path.join(getUploadsDir(), fileName);
    await writeFile(destPath, buffer);

    const publicUrl = `/uploads/docs/${fileName}`;

    // Document is just uploaded, linking to product is done via server action later

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("[Upload Doc] Write error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await verifyToken(token);
  if (!session) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    await deleteOldUpload(url);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Upload Doc] Delete error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
