"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, ShoppingBag, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function ErrorContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id") ?? params.get("orderId") ?? "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-navy-gradient text-white px-4 py-12 relative overflow-hidden">
      <div className="max-w-md w-full relative z-10">
        <div className="double-bezel-dark shadow-2xl">
          <div className="double-bezel-inner-dark p-8 sm:p-10 text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/30">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-300">
                Status Transaksi
              </span>
              <h1 className="text-2xl font-serif font-bold text-white mt-1">
                Pembayaran Tidak Berhasil
              </h1>
              <p className="text-xs sm:text-sm text-white/65 mt-2 leading-relaxed">
                Terjadi kendala saat memproses transaksi pembayaran. Silakan coba kembali atau hubungi representatif kami untuk bantuan invoice manual.
              </p>
            </div>

            {orderId && (
              <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10 text-left">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                  Order Reference ID
                </p>
                <p className="font-mono text-gold text-xs sm:text-sm font-bold mt-0.5">{orderId}</p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="w-full h-11 rounded-full font-bold text-xs uppercase tracking-wider bg-gold hover:bg-gold-light text-navy transition-all"
              >
                <Link href="/produk">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span>Coba Lagi di Katalog</span>
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

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-white text-xs">Memuat status pesanan...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
