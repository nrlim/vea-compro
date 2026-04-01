"use server";

/**
 * app/actions/payment.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server Actions untuk Midtrans Payment Gateway.
 *
 * Semua data sensitif (harga, item) diambil DARI DATABASE, bukan dari input
 * client. Ini mencegah client-side price manipulation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { snap } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ItemDetail = {
  id: string;
  price: number; // Integer — Rupiah
  quantity: number;
  name: string;
};

export type CreateOrderResult =
  | { success: true; snapToken: string; orderId: string; redirectUrl: string }
  | { success: false; error: string };

// ─── Helper: generate order ID unik ──────────────────────────────────────────

function generateOrderId(): string {
  // Format: VEA-{timestamp}-{random 6 hex chars}
  const ts = Date.now();
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `VEA-${ts}-${rand}`;
}

// ─── Internal: shared order creation logic ────────────────────────────────────

async function _buildAndCreateOrder({
  customerName,
  customerEmail,
  customerPhone,
  itemDetails,
  grossAmount,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemDetails: ItemDetail[];
  grossAmount: number;
}): Promise<CreateOrderResult> {
  const orderId = generateOrderId();

  await prisma.order.create({
    data: {
      orderId,
      grossAmount,
      status: "pending",
      customerName,
      customerEmail,
      itemDetails: JSON.stringify(itemDetails),
    },
  });

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: itemDetails.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name,
    })),
    customer_details: {
      first_name: customerName,
      email: customerEmail,
      phone: customerPhone ?? "",
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/finish`,
      error: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/error`,
      pending: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/pending`,
    },
  };

  const snapResponse = await snap.createTransaction(parameter);

  await prisma.order.update({
    where: { orderId },
    data: {
      snapToken: snapResponse.token,
      snapRedirectUrl: snapResponse.redirect_url,
    },
  });

  return {
    success: true,
    snapToken: snapResponse.token,
    orderId,
    redirectUrl: snapResponse.redirect_url,
  };
}

// ─── Action: createSnapTransaction (single product) ───────────────────────────

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productId: string;
  quantity?: number;
};

export async function createSnapTransaction(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    const { customerName, customerEmail, customerPhone, productId, quantity = 1 } = input;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true },
    });

    if (!product) return { success: false, error: "Produk tidak ditemukan." };

    const priceRaw = product.price ? product.price.replace(/\D/g, "") : "0";
    const priceInt = parseInt(priceRaw, 10);

    if (!priceInt || priceInt <= 0) {
      return { success: false, error: "Harga produk tidak valid atau belum dikonfigurasi." };
    }

    const itemDetails: ItemDetail[] = [{
      id: product.id,
      price: priceInt,
      quantity,
      name: product.name.substring(0, 50),
    }];

    return await _buildAndCreateOrder({
      customerName, customerEmail, customerPhone,
      itemDetails, grossAmount: priceInt * quantity,
    });
  } catch (err) {
    console.error("[createSnapTransaction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Terjadi kesalahan." };
  }
}

// ─── Action: createCartTransaction (multi-item dari shopping cart) ────────────

export type CartItemInput = {
  /** Prisma Product.id — dipakai untuk verifikasi harga di server */
  id: string;
  quantity: number;
};

export type CreateCartInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  /** Items dari cart store — harga diambil ulang dari DB, bukan dari client */
  items: CartItemInput[];
};

/**
 * Membuat satu transaksi Midtrans Snap untuk seluruh isi keranjang belanja.
 *
 * Keamanan:
 * - Harga dari client (CartItem.price) diabaikan sepenuhnya.
 * - Setiap item diverifikasi harganya langsung dari Prisma DB.
 * - Satu Snap token untuk seluruh keranjang.
 */
export async function createCartTransaction(
  input: CreateCartInput
): Promise<CreateOrderResult> {
  try {
    const { customerName, customerEmail, customerPhone, items } = input;

    if (!items || items.length === 0) {
      return { success: false, error: "Keranjang belanja kosong." };
    }

    // Verifikasi semua produk dari DB sekaligus (1 query)
    const productIds = items.map((i) => i.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    });

    type ProductRecord = { id: string; name: string; price: string | null };
    const productMap = new Map<string, ProductRecord>(products.map((p) => [p.id, p]));

    const itemDetails: ItemDetail[] = [];
    let grossAmount = 0;

    for (const cartItem of items) {
      const product = productMap.get(cartItem.id);
      if (!product) {
        console.warn(`[createCartTransaction] Produk tidak ditemukan: ${cartItem.id}`);
        continue;
      }

      const priceRaw = product.price ? product.price.replace(/\D/g, "") : "0";
      const priceInt = parseInt(priceRaw, 10);

      if (!priceInt || priceInt <= 0) {
        console.warn(`[createCartTransaction] Harga tidak valid: ${product.name}`);
        continue;
      }

      itemDetails.push({
        id: product.id,
        price: priceInt,
        quantity: cartItem.quantity,
        name: product.name.substring(0, 50),
      });

      grossAmount += priceInt * cartItem.quantity;
    }

    if (itemDetails.length === 0) {
      return {
        success: false,
        error:
          "Tidak ada produk valid dengan harga yang bisa diproses. Pastikan harga produk sudah dikonfigurasi oleh admin.",
      };
    }

    return await _buildAndCreateOrder({
      customerName, customerEmail, customerPhone,
      itemDetails, grossAmount,
    });
  } catch (err) {
    console.error("[createCartTransaction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Terjadi kesalahan." };
  }
}

// ─── Action: getOrderStatus ───────────────────────────────────────────────────

export type OrderStatusResult =
  | {
      success: true;
      status: string;
      grossAmount: number;
      paymentType: string | null;
      paidAt: string | null;
    }
  | { success: false; error: string };

export async function getOrderStatus(orderId: string): Promise<OrderStatusResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { orderId },
      select: { status: true, grossAmount: true, paymentType: true, paidAt: true },
    });

    if (!order) return { success: false, error: "Order tidak ditemukan." };

    return {
      success: true,
      status: order.status,
      grossAmount: order.grossAmount,
      paymentType: order.paymentType,
      paidAt: order.paidAt?.toISOString() ?? null,
    };
  } catch (err) {
    console.error("[getOrderStatus] Error:", err);
    return { success: false, error: "Gagal mengambil status order." };
  }
}
