"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function FinishContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id") ?? params.get("orderId") ?? "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--navy)] text-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center bg-green-500/10 border-2 border-green-500/30">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold font-serif">Pembayaran Berhasil!</h1>
        <p className="text-white/60">
          Terima kasih atas pesanan Anda. Tim PT VEA akan segera memproses pesanan Anda.
        </p>
        {orderId && (
          <div className="bg-white/5 rounded-lg px-4 py-3 border border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Order ID</p>
            <p className="font-mono text-[var(--gold)] text-sm">{orderId}</p>
          </div>
        )}
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg text-sm font-semibold transition-all"
          style={{ backgroundColor: "var(--gold-dark)", color: "var(--navy)" }}
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}

export default function PaymentFinishPage() {
  return (
    <Suspense>
      <FinishContent />
    </Suspense>
  );
}
