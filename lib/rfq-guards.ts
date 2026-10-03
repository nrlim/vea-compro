const signatures: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  png: [0x89, 0x50, 0x4e, 0x47],
  jpg: [0xff, 0xd8, 0xff],
  jpeg: [0xff, 0xd8, 0xff],
  doc: [0xd0, 0xcf, 0x11, 0xe0],
  docx: [0x50, 0x4b, 0x03, 0x04],
};

export function isRfqRateLimited(fromEmail: number, recentTotal: number): boolean {
  return fromEmail >= 3 || recentTotal >= 30;
}

export function isAllowedRfqFile(filename: string, content: Uint8Array): boolean {
  const ext = filename.toLowerCase().split(".").pop() || "";
  const signature = signatures[ext];
  return !!signature && signature.every((byte, index) => content[index] === byte);
}
