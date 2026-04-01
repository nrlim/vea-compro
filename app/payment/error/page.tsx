"use client";

import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id") ?? params.get("orderId") ?? "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--navy)] text-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-red-500/10 border-2 border-red-500/30">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold font-serif">Pembayaran Gagal</h1>
        <p className="text-white/60">
          Terjadi kesalahan dalam proses pembayaran. Silakan coba lagi atau hubungi tim PT VEA untuk bantuan.
        </p>
        {orderId && (
          <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Order ID</p>
            <p className="font-mono text-[var(--gold)] text-sm">{orderId}</p>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Link
            href="/produk"
            className="inline-block px-5 py-3 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/15 transition-all border border-white/10"
          >
            Kembali ke Produk
          </Link>
          <Link
            href="/"
            className="inline-block px-5 py-3 rounded-lg text-sm font-semibold transition-all"
            style={{ backgroundColor: "var(--gold-dark)", color: "var(--navy)" }}
          >
            Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
