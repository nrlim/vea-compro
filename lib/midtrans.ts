/**
 * lib/midtrans.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Midtrans Snap client — SERVER-SIDE ONLY.
 * Jangan pernah import file ini dari komponen Client ('use client').
 * Server key hanya ada di process.env dan tidak pernah dikirim ke browser.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Guard: pastikan file ini hanya berjalan di Node.js (server)
if (typeof window !== "undefined") {
  throw new Error(
    "[midtrans.ts] File ini hanya boleh diimport di sisi server (Server Action / API Route). " +
      "Jangan tambahkan 'use client' di file yang mengimport ini."
  );
}

import midtransClient from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.MIDTRANS_CLIENT_KEY;
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

if (!serverKey || !clientKey) {
  throw new Error(
    "[midtrans.ts] MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY harus diset di .env"
  );
}

/**
 * Singleton Snap instance.
 * Gunakan ini untuk createTransaction() di Server Action.
 */
const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

/**
 * CoreApi instance — digunakan untuk verifikasi status transaksi on-demand
 * (opsional, tersedia jika dibutuhkan).
 */
const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});

export { snap, coreApi, isProduction };
