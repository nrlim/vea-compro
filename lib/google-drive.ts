import { google } from "googleapis";
import { Readable } from "stream";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

export async function uploadFileToDrive(
  buffer: Buffer | Uint8Array,
  fileName: string,
  mimeType: string
): Promise<string | null> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!clientEmail || !privateKey || !folderId) {
    console.error("Missing Google Drive environment variables. Check GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_DRIVE_FOLDER_ID.");
    return null;
  }

  // Handle newlines in private keys parsed from env variables
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES,
      subject: process.env.GOOGLE_DRIVE_IMPERSONATE_EMAIL || undefined,
    });

    const drive = google.drive({ version: "v3", auth });

    // Convert Buffer/Uint8Array to a Readable stream to pass to Google Drive API
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // Create the file in the specific folder
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType,
      body: stream,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
      supportsAllDrives: true,
    });

    if (!file.data.id) {
        throw new Error("Failed to retrieve file ID from Google Drive");
    }

    // Make the file public so it can be viewed by anyone on the internet (since it's a product image)
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true,
    });

    // Return a direct embeddable view URL commonly used for generic `<img>` tags
    return `https://drive.google.com/uc?export=view&id=${file.data.id}`;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    return null;
  }
}
