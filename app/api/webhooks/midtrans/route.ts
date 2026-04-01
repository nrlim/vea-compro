/**
 * app/api/webhooks/midtrans/route.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Midtrans Notification / Webhook Handler (POST)
 *
 * Security layers yang diimplementasikan:
 * 1. Signature verification: SHA512(order_id + status_code + gross_amount + server_key)
 * 2. Idempotency guard: order dengan status 'settlement' tidak bisa diubah lagi
 * 3. Constant-time comparison mencegah timing attack pada signature check
 * 4. Tidak ada operasi DB sebelum signature divalidasi
 *
 * Dokumentasi resmi: https://docs.midtrans.com/reference/handling-notifications
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getDecryptedSmtpConfig } from "@/app/actions/smtp-settings";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Payload notification dari Midtrans.
 * Referensi: https://docs.midtrans.com/reference/notification-json-object
 */
interface MidtransNotificationPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;         // String dari Midtrans ("150000.00")
  signature_key: string;
  transaction_status: string;   // settlement | pending | expire | cancel | deny | failure
  payment_type?: string;
  transaction_id?: string;
  transaction_time?: string;
  fraud_status?: string;
  currency?: string;
  [key: string]: unknown;
}

// ─── Status mapping ───────────────────────────────────────────────────────────

/**
 * Terminal statuses — jika order sudah dalam status ini, abaikan callback baru.
 * Mencegah "Double Processing" / replay attack.
 */
const TERMINAL_STATUSES = new Set(["settlement", "expire", "cancel", "deny", "failure"]);

/**
 * Map Midtrans transaction_status ke status internal kita.
 */
function mapTransactionStatus(midtransStatus: string): string {
  const statusMap: Record<string, string> = {
    capture: "settlement",   // Credit card captured = berhasil
    settlement: "settlement",
    pending: "pending",
    deny: "deny",
    cancel: "cancel",
    expire: "expire",
    failure: "failure",
    refund: "cancel",
    partial_refund: "cancel",
    chargeback: "cancel",
  };
  return statusMap[midtransStatus] ?? "unknown";
}

// ─── Signature Verification ───────────────────────────────────────────────────

/**
 * Verifikasi signature Midtrans menggunakan constant-time comparison.
 *
 * Formula resmi Midtrans:
 *   SHA512(order_id + status_code + gross_amount + server_key)
 *
 * @returns true jika signature valid, false jika tidak
 */
function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  receivedSignature: string
): boolean {
  const rawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const expectedSignature = createHash("sha512").update(rawString).digest("hex");

  // Constant-time comparison mencegah timing side-channel attack
  try {
    const expected = Buffer.from(expectedSignature, "utf8");
    const received = Buffer.from(receivedSignature, "utf8");

    // timingSafeEqual requires equal lengths
    if (expected.length !== received.length) {
      return false;
    }
    return timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

// ─── Post-Payment Email Sending ────────────────────────────────────────────────
async function sendTransactionSuccessEmail(order: any, midtransPayload?: any) {
  try {
    const routes = await (prisma as any).emailRoute.findMany({ 
      where: { triggerEvent: "TRANSACTION", isActive: true } 
    });
    
    if (!routes || routes.length === 0) return;

    const smtpConfig = await getDecryptedSmtpConfig();
    const formatRupiah = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

    let productListHtml = "";
    let subtotal = 0;
    if (order.itemDetails) {
      try {
        const items = JSON.parse(order.itemDetails);
        items.forEach((item: any) => {
          subtotal += item.price * item.quantity;
          productListHtml += `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 15px 0;">
                <div style="color: #0f172a; font-weight: 600; font-size: 14px;">${item.name}</div>
                <div style="color: #94a3b8; font-size: 12px;">Qty: ${item.quantity}</div>
              </td>
              <td align="right" style="color: #0f172a; font-weight: 600; font-size: 14px;">${formatRupiah(item.price * item.quantity)}</td>
            </tr>`;
        });
      } catch {}
    }

    if (smtpConfig && smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
      const encryptionMap: Record<string, { secure: boolean; requireTLS: boolean }> = {
        SSL: { secure: true, requireTLS: false },
        TLS: { secure: false, requireTLS: true },
        None: { secure: false, requireTLS: false },
      };
      const tlsOptions = encryptionMap[smtpConfig.encryption] ?? encryptionMap.TLS;

      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: tlsOptions.secure,
        requireTLS: tlsOptions.requireTLS,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
        ...(smtpConfig.ignoreTls && { tls: { rejectUnauthorized: false } }),
      });

      for (const route of routes) {
        let subject = route.subjectTemplate || "Detail Transaksi PT VEA: {{order_id}}";
        subject = subject.replace(/\{\{order_id\}\}/gi, order.orderId)
                         .replace(/\{\{customer_name\}\}/gi, order.customerName || "Customer")
                         .replace(/\{\{tagihan\}\}/gi, formatRupiah(order.grossAmount));

        const rawHtml = route.htmlTemplate || "<h2>Pembayaran Berhasil!</h2><p>{{order_id}} by {{customer_name}}</p>";
        
        const paymentMethod = midtransPayload?.payment_type || order.paymentType || "Transfer Bank / QRIS";
        const transactionTime = midtransPayload?.transaction_time || order.paidAt?.toLocaleString("id-ID") || new Date().toLocaleString("id-ID");
        const taxVal = order.grossAmount > subtotal ? order.grossAmount - subtotal : 0;
        const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders` : "#";

        let finalHtml = rawHtml
          .replace(/\{\{order_id\}\}/gi, order.orderId)
          .replace(/\{\{customer_name\}\}/gi, order.customerName || "Customer")
          .replace(/\{\{name\}\}/gi, order.customerName || "Customer")
          .replace(/\{\{customer_email\}\}/gi, order.customerEmail || "")
          .replace(/\{\{tagihan\}\}/gi, formatRupiah(order.grossAmount))
          .replace(/\{\{total_amount\}\}/gi, formatRupiah(order.grossAmount))
          .replace(/\{\{subtotal\}\}/gi, formatRupiah(subtotal > 0 ? subtotal : order.grossAmount))
          .replace(/\{\{tax\}\}/gi, taxVal > 0 ? formatRupiah(taxVal) : "Rp 0")
          .replace(/\{\{payment_method\}\}/gi, String(paymentMethod).replace(/_/g, " ").toUpperCase())
          .replace(/\{\{transaction_time\}\}/gi, transactionTime)
          .replace(/\{\{dashboard_url\}\}/gi, dashboardUrl)
          .replace(/\{\{product_list\}\}/gi, productListHtml || `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 15px 0;">
                <div style="color: #0f172a; font-weight: 600; font-size: 14px;">Item Transaksi</div>
              </td>
              <td align="right" style="color: #0f172a; font-weight: 600; font-size: 14px;">${formatRupiah(order.grossAmount)}</td>
            </tr>
          `);

        const targetEmail = route.toEmail && route.toEmail.trim() ? route.toEmail : order.customerEmail;
        if (!targetEmail) continue;

        let bccList: string[] = [];
        if (route.bccEmail) {
          bccList = route.bccEmail.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean);
        }
        if (smtpConfig.bccEmail) {
          const extraBcc = smtpConfig.bccEmail.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean);
          bccList = [...new Set([...bccList, ...extraBcc])];
        }

        try {
          await transporter.sendMail({
            from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
            to: targetEmail,
            bcc: bccList,
            subject: subject,
            html: finalHtml,
          });
          console.info(`[Midtrans Webhook] ✉️ Transaksi Email sent using route '${route.name}' to ${targetEmail}`);
        } catch (err) {
          console.error(`[Midtrans Webhook] Error sending via route '${route.name}':`, err);
        }
      }
    } else {
      console.warn("[Midtrans Webhook] SMTP config is missing, skipping transaction emails.");
    }
  } catch (err) {
    console.error("[Midtrans Webhook] Error processing transaction emails:", err);
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // ── 0. Pastikan Content-Type adalah JSON ─────────────────────────────────────
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { message: "Unsupported Media Type" },
      { status: 415 }
    );
  }

  // ── 1. Parse body ─────────────────────────────────────────────────────────────
  let payload: MidtransNotificationPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    payment_type,
    transaction_id,
    transaction_time,
    fraud_status,
  } = payload;

  // ── 2. Validasi field wajib ───────────────────────────────────────────────────
  if (!order_id || !status_code || !gross_amount || !signature_key) {
    console.warn("[Midtrans Webhook] Missing required fields", {
      order_id,
      status_code,
      gross_amount,
      has_signature: !!signature_key,
    });
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // ── 3. VERIFIKASI SIGNATURE (WAJIB — lakukan sebelum operasi DB apapun) ───────
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.error("[Midtrans Webhook] MIDTRANS_SERVER_KEY tidak dikonfigurasi");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const isSignatureValid = verifyMidtransSignature(
    order_id,
    status_code,
    gross_amount,
    serverKey,
    signature_key
  );

  if (!isSignatureValid) {
    // Log warning untuk monitoring — jangan ekspos detail ke response
    console.warn("[Midtrans Webhook] ⚠️  SIGNATURE INVALID!", {
      order_id,
      status_code,
      receivedSignature: signature_key.substring(0, 16) + "...", // Partial log saja
      ip: request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip"),
    });
    return NextResponse.json(
      { message: "Forbidden: Invalid signature" },
      { status: 403 }
    );
  }

  // ── 4. Cari order di database ─────────────────────────────────────────────────
  let order;
  try {
    order = await prisma.order.findUnique({
      where: { orderId: order_id },
      select: { 
        id: true, 
        status: true, 
        paidAt: true,
        customerEmail: true,
        customerName: true,
        grossAmount: true,
        itemDetails: true,
        orderId: true
      },
    });
  } catch (err) {
    console.error("[Midtrans Webhook] DB lookup error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  if (!order) {
    // Bisa jadi race condition — Midtrans callback lebih cepat dari DB write
    // Return 404 agar Midtrans retry otomatis
    console.warn(`[Midtrans Webhook] Order tidak ditemukan: ${order_id}`);
    return NextResponse.json(
      { message: "Order not found" },
      { status: 404 }
    );
  }

  // ── 5. IDEMPOTENCY CHECK ──────────────────────────────────────────────────────
  // Jika order sudah terminal, abaikan callback ini (kembalikan 200 agar Midtrans
  // tidak retry terus-menerus, tapi tidak lakukan perubahan data).
  if (TERMINAL_STATUSES.has(order.status)) {
    console.info(
      `[Midtrans Webhook] Idempotency guard: order ${order_id} sudah dalam status terminal '${order.status}'. Callback diabaikan.`
    );
    return NextResponse.json(
      { message: "Already processed", status: order.status },
      { status: 200 }
    );
  }

  // ── 6. Update order di database ───────────────────────────────────────────────
  const newStatus = mapTransactionStatus(transaction_status);
  const isSettlement = newStatus === "settlement";

  let transactionTimeDate: Date | undefined = undefined;
  if (transaction_time) {
    transactionTimeDate = new Date(transaction_time);
  }

  try {
    await prisma.order.update({
      where: { orderId: order_id },
      data: {
        status: newStatus,
        paymentType: payment_type ?? null,
        transactionId: transaction_id ?? null,
        transactionTime: transactionTimeDate,
        fraudStatus: fraud_status ?? null,
        // Hanya set paidAt satu kali ketika pertama kali settlement
        paidAt: isSettlement ? new Date() : undefined,
        // Simpan raw payload untuk audit trail
        lastWebhookPayload: JSON.stringify(payload),
      },
    });

    console.info(
      `[Midtrans Webhook] ✅ Order ${order_id} updated: ${order.status} → ${newStatus}` +
      (isSettlement ? " | PAID" : "")
    );
  } catch (err) {
    console.error("[Midtrans Webhook] DB update error:", err);
    // Return 500 agar Midtrans retry — jangan return 200 jika DB gagal
    return NextResponse.json(
      { message: "Internal server error: failed to update order" },
      { status: 500 }
    );
  }

  // ── 7. Post-payment side effects (opsional — extend di sini) ─────────────────
  if (isSettlement) {
    if (order.customerEmail) {
      // Async fire and forget
      sendTransactionSuccessEmail(order, payload).catch(console.error);
    }
    // TODO: Update inventory / stok
    // TODO: Trigger fulfillment workflow
    console.info(`[Midtrans Webhook] 💳 Payment settlement: ${order_id}`);
  }

  // ── 8. Return 200 ke Midtrans ─────────────────────────────────────────────────
  return NextResponse.json(
    { message: "OK", orderId: order_id, newStatus },
    { status: 200 }
  );
}

// ─── GET — Health check ───────────────────────────────────────────────────────

export async function GET() {
  return NextResponse.json(
    { message: "Midtrans Webhook endpoint is active. Use POST." },
    { status: 200 }
  );
}
