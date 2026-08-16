import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".doc",
  ".docx",
  ".zip",
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileParam = searchParams.get("file");

  if (!fileParam) {
    return new NextResponse("Parameter file diperlukan", { status: 400 });
  }

  try {
    // 1. Extract and sanitize file path
    let relativePath = fileParam;

    // If a full URL is passed, parse the pathname only
    if (fileParam.startsWith("http://") || fileParam.startsWith("https://")) {
      try {
        const parsed = new URL(fileParam);
        relativePath = parsed.pathname;
      } catch {
        return new NextResponse("URL tidak valid", { status: 400 });
      }
    }

    // Strip leading slashes
    const cleanRelative = relativePath.replace(/^\/+/, "");

    // 2. Resolve absolute path and enforce public directory boundary
    const publicDir = path.resolve(process.cwd(), "public");
    const targetPath = path.resolve(publicDir, cleanRelative);

    // Guard against Directory Traversal (e.g. "../../../etc/passwd")
    if (!targetPath.startsWith(publicDir)) {
      return new NextResponse("Akses ditolak: Jalur file tidak valid", { status: 403 });
    }

    // 3. Extension Whitelist Check
    const ext = path.extname(targetPath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return new NextResponse("Tipe file tidak diizinkan untuk diunduh", { status: 403 });
    }

    // 4. File existence check
    if (!fs.existsSync(targetPath)) {
      return new NextResponse("File tidak ditemukan", { status: 404 });
    }

    const stat = fs.statSync(targetPath);
    if (!stat.isFile()) {
      return new NextResponse("Permintaan tidak valid", { status: 400 });
    }

    // 5. Read file safely
    const fileBuffer = fs.readFileSync(targetPath);
    const fileName = path.basename(targetPath);

    // Map MIME type
    let mimeType = "application/octet-stream";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    else if (ext === ".webp") mimeType = "image/webp";
    else if (ext === ".pdf") mimeType = "application/pdf";
    else if (ext === ".zip") mimeType = "application/zip";
    else if (ext === ".doc") mimeType = "application/msword";
    else if (ext === ".docx") mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": mimeType,
        "Content-Length": stat.size.toString(),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[Download API] Kesalahan pemrosesan berkas:", error);
    return new NextResponse("Kesalahan Server Internal", { status: 500 });
  }
}
