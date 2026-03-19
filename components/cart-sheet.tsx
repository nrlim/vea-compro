"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CartSheet() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle hydration mismatch safely
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isMounted) {
    return (
      <Button
        variant="outline"
        className="relative touch-target h-10 px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md bg-white hover:bg-slate-50"
        aria-label="Lihat Keranjang Belanja"
        style={{ borderColor: "rgba(0, 31, 63, 0.15)", color: "var(--navy)" }}
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="hidden sm:inline-block font-semibold text-sm">Keranjang</span>
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative touch-target h-10 px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md bg-white hover:bg-slate-50"
          aria-label="Lihat Keranjang Belanja"
          style={{ borderColor: "rgba(0, 31, 63, 0.15)", color: "var(--navy)" }}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline-block font-semibold text-sm">Keranjang</span>
          {totalItems() > 0 && (
            <span
              className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-[20px] text-[11px] font-bold rounded-full text-white px-1.5 shadow-sm border-2 border-white"
              style={{ backgroundColor: "var(--gold-dark)" }}
            >
              {totalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="w-[90vw] sm:max-w-md bg-navy-light border-l border-white/10 p-0 flex flex-col"
        style={{ color: "white" }}
      >
        <SheetHeader className="p-6 pb-4 border-b border-white/10 flex flex-row items-center justify-between space-y-0">
          <div>
            <SheetTitle className="text-xl font-serif text-white m-0">
              Keranjang ({totalItems()})
            </SheetTitle>
            {/* Description required by Shadcn Accessibility */}
            <SheetDescription className="text-white/60 text-xs">
              Review bagian pesanan industri Anda.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
              <ShoppingCart className="w-12 h-12" />
              <p className="text-sm">Keranjang komponen Anda masih kosong.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="relative w-20 h-20 bg-white rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 p-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                  {/* Faux shadow to emulate 3D lighting in small scale */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                </div>

                <div className="flex flex-col flex-1 h-20 justify-between">
                  <div>
                    <h4 className="text-sm font-semibold line-clamp-2 text-white/90 pr-6">
                      {item.name}
                    </h4>
                    <p className="text-sm text-[var(--gold)] font-mono mt-1">
                      {formatRupiah(item.price)}
                    </p>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-white/20 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-white/40 hover:text-red-400 p-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Checkout Panel */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-navy space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm text-white/60">
                <span>Total Estimasi</span>
                <span className="font-mono text-white text-base">
                  {formatRupiah(totalPrice())}
                </span>
              </div>
              <p className="text-[10px] text-white/40 italic">
                *Belum termasuk PPN (Sales Tax) dan biaya pengiriman laut/darat.
              </p>
            </div>

            <Button
              className="w-full rounded-md h-12 font-bold shadow-[0_0_20px_rgba(200,160,80,0.25)] hover:shadow-[0_0_25px_rgba(200,160,80,0.4)]"
              style={{
                backgroundColor: "var(--gold-dark)",
                color: "var(--navy)",
              }}
              onClick={() => {
                alert("Mengarah ke Halaman Checkout..."); // Placeholder
              }}
            >
              Checkout Industri
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
