import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { isAllowedRfqFile, isRfqRateLimited } from "../lib/rfq-guards";

assert.equal(existsSync("app/api/send-email/route.ts"), false, "Public mail endpoint must remain removed");
assert.equal(isAllowedRfqFile("bom.pdf", Buffer.from("%PDF-1.7")), true);
assert.equal(isAllowedRfqFile("bom.pdf", Buffer.from("<html>")), false);
assert.equal(isAllowedRfqFile("payload.svg", Buffer.from("<svg>")), false);
assert.equal(isAllowedRfqFile("image.jpg", Buffer.from([0xff, 0xd8, 0xff, 0x00])), true);
assert.equal(isAllowedRfqFile("fake.jpg", Buffer.from([0x00])), false);
assert.equal(isRfqRateLimited(2, 29), false);
assert.equal(isRfqRateLimited(3, 0), true);
assert.equal(isRfqRateLimited(0, 30), true);
