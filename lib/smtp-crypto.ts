/**
 * AES-256-CBC Encryption utility for SMTP passwords stored at rest.
 * Uses Node.js native `crypto` module — no external dependencies.
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES block size
const KEY_LENGTH = 32; // 256-bit key

function getKey(): Buffer {
  const hexKey = process.env.SMTP_ENCRYPTION_KEY;
  if (!hexKey || hexKey.length !== 64) {
    throw new Error(
      "SMTP_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). " +
        "Generate with: openssl rand -hex 32"
    );
  }
  return Buffer.from(hexKey, "hex");
}

/**
 * Encrypts a plaintext string with AES-256-CBC.
 * Returns a colon-delimited string: `iv:encryptedHex`
 */
export function encryptPassword(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts an AES-256-CBC cipher string (format: `iv:encryptedHex`).
 * Returns the original plaintext.
 */
export function decryptPassword(cipherText: string): string {
  const key = getKey();
  const [ivHex, encryptedHex] = cipherText.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid cipher text format.");
  }
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
