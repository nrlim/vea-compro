import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("file");

  if (!fileUrl) {
    return new NextResponse("URL file diperlukan", { status: 400 });
  }

  try {
    let fileName = "unduhan";
    let fileBuffer: Buffer | ArrayBuffer;
    
    // Handle full URLs (like old Supabase files or full localhost URLs)
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      const urlObj = new URL(fileUrl);
      
      // If it's an external URL (Supabase storage)
      if (urlObj.hostname !== "localhost" && !urlObj.hostname.includes("vea.com")) {
        const resp = await fetch(fileUrl);
        if (!resp.ok) return new NextResponse("File eksternal tidak ditemukan", { status: 404 });
        
        fileBuffer = await resp.arrayBuffer();
        fileName = urlObj.pathname.split('/').pop() || "unduhan";
      } else {
        // It's a localhost/internal URL masquerading as a full string
        let cleanFileUrl = urlObj.pathname.replace(/^\//, "");
        if (cleanFileUrl.includes("..")) return new NextResponse("Jalur file tidak valid", { status: 400 });
        
        const filePath = path.join(process.cwd(), "public", cleanFileUrl);
        if (!fs.existsSync(filePath)) return new NextResponse("File tidak ditemukan", { status: 404 });
        
        fileBuffer = fs.readFileSync(filePath);
        fileName = path.basename(filePath);
      }
    } else {
      // Handle normal relative paths (e.g. "/uploads/...png")
      const cleanFileUrl = fileUrl.replace(/^\//, "");
      if (cleanFileUrl.includes("..")) return new NextResponse("Jalur file tidak valid", { status: 400 });

      const filePath = path.join(process.cwd(), "public", cleanFileUrl);
      if (!fs.existsSync(filePath)) return new NextResponse("File tidak ditemukan", { status: 404 });

      fileBuffer = fs.readFileSync(filePath);
      fileName = path.basename(filePath);
    }

    // Map correct MIME type to prevent browser from interpreting as text
    const ext = path.extname(fileName).toLowerCase();
    let mimeType = "application/octet-stream";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    else if (ext === ".pdf") mimeType = "application/pdf";
    else if (ext === ".zip") mimeType = "application/zip";
    else if (ext === ".doc" || ext === ".docx") mimeType = "application/msword";

    return new NextResponse(new Uint8Array(fileBuffer as any), {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    console.error("Kesalahan proses unduh file (API):", error);
    return new NextResponse("Kesalahan Server Internal", { status: 500 });
  }
}
