"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, FileCheck, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function FinishContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id") ?? params.get("orderId") ?? "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-navy-gradient text-white px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--gold), transparent 70%)",
        }}
      />

      <div className="max-w-md w-full relative z-10">
        <div className="double-bezel-dark shadow-2xl">
          <div className="double-bezel-inner-dark p-8 sm:p-10 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-light">
                Transaksi Berhasil
              </span>
              <h1 className="text-2xl font-serif font-bold text-white mt-1">
                Pembayaran Dikonfirmasi
              </h1>
              <p className="text-xs sm:text-sm text-white/65 mt-2 leading-relaxed">
                Terima kasih atas pesanan Anda. Tim logistik dan procurement PT VEA akan segera memproses pengiriman instrumen Anda.
              </p>
            </div>

            {orderId && (
              <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10 text-left flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                    Order Reference ID
                  </p>
                  <p className="font-mono text-gold text-xs sm:text-sm font-bold mt-0.5">{orderId}</p>
                </div>
                <FileCheck className="w-5 h-5 text-emerald-400/70" />
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="w-full h-11 rounded-full font-bold text-xs uppercase tracking-wider bg-gold hover:bg-gold-light text-navy transition-all"
              >
                <Link href="/produk">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span>Katalog Produk</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-11 rounded-full font-semibold text-xs uppercase tracking-wider text-white border-white/20 hover:bg-white/10"
              >
                <Link href="/">Beranda</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentFinishPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-white text-xs">Memuat status pesanan...</div>}>
      <FinishContent />
    </Suspense>
  );
}
