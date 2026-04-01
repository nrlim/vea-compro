/**
 * components/payment/PaymentButton.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Contoh komponen Client yang memanggil Server Action createSnapTransaction
 * dan membuka UI Midtrans Snap.
 *
 * CARA PAKAI:
 *   <PaymentButton productId="clxxx..." customerName="Budi" customerEmail="budi@example.com" />
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { useState } from "react";
import { createSnapTransaction } from "@/app/actions/payment";

// Snap.js akan di-inject ke window oleh script tag di layout.tsx
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface PaymentButtonProps {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  quantity?: number;
  label?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function PaymentButton({
  productId,
  customerName,
  customerEmail,
  customerPhone,
  quantity = 1,
  label = "Bayar Sekarang",
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePayment() {
    setLoading(true);
    setError(null);

    try {
      // 1. Panggil Server Action — dapatkan snap_token
      const result = await createSnapTransaction({
        productId,
        customerName,
        customerEmail,
        customerPhone,
        quantity,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      // 2. Buka UI Midtrans Snap
      if (typeof window !== "undefined" && window.snap) {
        window.snap.pay(result.snapToken, {
          onSuccess: (snapResult) => {
            console.log("Payment success:", snapResult);
            // Redirect ke halaman sukses
            window.location.href = `/payment/finish?order_id=${result.orderId}`;
          },
          onPending: (snapResult) => {
            console.log("Payment pending:", snapResult);
            window.location.href = `/payment/pending?order_id=${result.orderId}`;
          },
          onError: (snapResult) => {
            console.error("Payment error:", snapResult);
            setError("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: () => {
            console.log("Snap popup ditutup user");
          },
        });
      } else {
        // Fallback: redirect ke Snap payment page
        window.location.href = result.redirectUrl;
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#9ca3af" : "#0066cc",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {loading ? "Memproses..." : label}
      </button>

      {error && (
        <p style={{ color: "#dc2626", marginTop: "8px", fontSize: "14px" }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
