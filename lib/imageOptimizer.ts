import sharp from "sharp";

/**
 * Optimizes an image buffer before uploading to storage.
 * - Converts to WebP (mandatory)
 * - Resizes to max width 800px (maintain aspect ratio)
 * - Aggressive compression (quality 50, effort 6)
 * - Strips all EXIF/metadata
 */
export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 50, effort: 6 })
    .toBuffer();
}
