import assert from "node:assert/strict";
import { getSmtpConfig } from "../lib/smtp";

const keys = ["SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM_NAME", "SMTP_FROM_EMAIL", "SMTP_CC", "SMTP_BCC"] as const;
const original = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

try {
  for (const key of keys) delete process.env[key];
  assert.equal(getSmtpConfig(), null);

  Object.assign(process.env, {
    SMTP_HOST: "mail.example.test",
    SMTP_PORT: "587",
    SMTP_SECURE: "false",
    SMTP_USER: "sender@example.test",
    SMTP_PASSWORD: "test-only",
    SMTP_FROM_NAME: "PT VEA",
    SMTP_CC: "sales@example.test; manager@example.test",
    SMTP_BCC: "ops@example.test; audit@example.test",
  });
  const config = getSmtpConfig();
  assert.ok(config);
  assert.equal(config.from, '"PT VEA" <sender@example.test>');
  assert.deepEqual(config.cc, ["sales@example.test", "manager@example.test"]);
  assert.deepEqual(config.bcc, ["ops@example.test", "audit@example.test"]);
  assert.equal((config.transporter as unknown as { options: { requireTLS: boolean; secure: boolean } }).options.requireTLS, true);

  process.env.SMTP_PORT = "99999";
  assert.throws(() => getSmtpConfig(), /SMTP_PORT/);
  process.env.SMTP_PORT = "587";
  delete process.env.SMTP_PASSWORD;
  assert.throws(() => getSmtpConfig(), /SMTP_USER and SMTP_PASSWORD/);
} finally {
  for (const key of keys) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
}
