import nodemailer from "nodemailer";

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be an integer between 1 and 65535");
  }

  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();
  if (secureValue && secureValue !== "true" && secureValue !== "false") {
    throw new Error("SMTP_SECURE must be true or false");
  }
  const secure = secureValue ? secureValue === "true" : port === 465;
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  if (!user || !password) {
    throw new Error("SMTP_USER and SMTP_PASSWORD are required when SMTP_HOST is set");
  }

  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() || user;
  const fromName = process.env.SMTP_FROM_NAME?.trim() || "PT VEA Notification";

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: !secure,
      auth: { user, pass: password },
      tls: { minVersion: "TLSv1.2" },
    }),
    from: `"${fromName.replace(/["\r\n]/g, "")}" <${fromEmail}>`,
    cc: process.env.SMTP_CC?.split(/[;,]/).map((email) => email.trim()).filter(Boolean) || [],
    bcc: process.env.SMTP_BCC?.split(/[;,]/).map((email) => email.trim()).filter(Boolean) || [],
  };
}
