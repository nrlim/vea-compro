"use client";

import { useEffect, useState, useRef } from "react";
import { useCart } from "@/lib/store/cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  User,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createCartTransaction } from "@/app/actions/payment";

// ─── Midtrans Snap type ────────────────────────────────────────────────────────
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

// ─── Types ────────────────────────────────────────────────────────────────────

type CheckoutStep = "cart" | "form" | "processing" | "success" | "error";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CartSheet() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<CustomerForm>({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState<Partial<CustomerForm>>({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);

  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Focus first input when form step opens
  useEffect(() => {
    if (step === "form") {
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [step]);

  // Reset step when sheet closes
  useEffect(() => {
    if (!isSheetOpen) {
      setTimeout(() => {
        if (step !== "success") setStep("cart");
        setFormErrors({});
        setErrorMsg("");
      }, 300);
    }
  }, [isSheetOpen, step]);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  // ─── Form Validation ──────────────────────────────────────────────────────

  function validateForm(): boolean {
    const errors: Partial<CustomerForm> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = "Nama minimal 2 karakter";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format email tidak valid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // ─── Checkout Handler ─────────────────────────────────────────────────────

  async function handleCheckout() {
    if (!validateForm()) return;

    setStep("processing");
    setErrorMsg("");

    try {
      const result = await createCartTransaction({
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim() || undefined,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      });

      if (!result.success) {
        setErrorMsg(result.error);
        setStep("error");
        return;
      }

      setCurrentOrderId(result.orderId);

      // Open Midtrans Snap popup
      if (typeof window !== "undefined" && window.snap) {
        setIsPaymentOpen(true); // Disable Sheet focus trap
        
        window.snap.pay(result.snapToken, {
          onSuccess: () => {
            setIsPaymentOpen(false);
            clearCart();
            setStep("success");
          },
          onPending: () => {
            // Pembayaran pending — order terbuat, redirect ke halaman status
            setIsPaymentOpen(false);
            setStep("success");
          },
          onError: () => {
            setIsPaymentOpen(false);
            setErrorMsg("Pembayaran gagal atau dibatalkan oleh gateway. Silakan coba lagi.");
            setStep("error");
          },
          onClose: () => {
            // User tutup popup tanpa bayar — kembali ke cart
            setIsPaymentOpen(false);
            setStep("cart");
          },
        });
      } else {
        // Fallback: redirect ke Snap hosted page jika popup tidak tersedia
        window.location.href = result.redirectUrl;
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi. Periksa internet Anda dan coba lagi.");
      setStep("error");
    }
  }

  // ─── Hydration guard ──────────────────────────────────────────────────────

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

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Sheet 
      open={isSheetOpen} 
      onOpenChange={(open) => {
        // Jangan biarkan klik di luar menutup sheet saat Midtrans popup terbuka
        if (isPaymentOpen) return;
        setIsSheetOpen(open);
      }}
      modal={!isPaymentOpen} // Disable Focus Trap saat Midtrans aktif agar iframe tergrap focus
    >
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
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <SheetHeader className="p-6 pb-4 border-b border-white/10 flex flex-row items-center justify-between space-y-0">
          <div>
            <SheetTitle className="text-xl font-serif text-white m-0 flex items-center gap-2">
              {step === "form" && (
                <button
                  onClick={() => setStep("cart")}
                  className="text-white/50 hover:text-white transition-colors mr-1"
                  aria-label="Kembali ke keranjang"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {step === "form"
                ? "Detail Pembeli"
                : step === "processing"
                ? "Memproses..."
                : step === "success"
                ? "Pembayaran Berhasil"
                : step === "error"
                ? "Terjadi Kesalahan"
                : `Keranjang (${totalItems()})`}
            </SheetTitle>
            <SheetDescription className="text-white/60 text-xs mt-0.5">
              {step === "form"
                ? "Isi data pemesan untuk melanjutkan pembayaran."
                : step === "processing"
                ? "Menghubungkan ke payment gateway Midtrans..."
                : step === "success"
                ? "Terima kasih! Order Anda sedang diproses."
                : step === "error"
                ? "Pembayaran tidak dapat diselesaikan."
                : "Review bagian pesanan industri Anda."}
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* ── STEP: Cart Items ──────────────────────────────────────────────── */}
        {step === "cart" && (
          <>
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
                        unoptimized={item.image?.startsWith("data:") || item.image?.startsWith("/uploads/")}
                        className="object-contain"
                      />
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-white/20 rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
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
                          aria-label={`Hapus ${item.name} dari keranjang`}
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
                  id="btn-checkout-industri"
                  className="w-full rounded-md h-12 font-bold shadow-[0_0_20px_rgba(200,160,80,0.25)] hover:shadow-[0_0_25px_rgba(200,160,80,0.4)] transition-all flex items-center gap-2"
                  style={{ backgroundColor: "var(--gold-dark)", color: "var(--navy)" }}
                  onClick={() => setStep("form")}
                >
                  <CreditCard className="w-4 h-4" />
                  Checkout Industri
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── STEP: Customer Form ───────────────────────────────────────────── */}
        {step === "form" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Order Summary Mini */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-2 font-semibold">
                  Ringkasan Pesanan
                </p>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70 truncate pr-2">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="text-white font-mono flex-shrink-0">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold">
                    <span className="text-white/80">Total</span>
                    <span className="text-[var(--gold)] font-mono">{formatRupiah(totalPrice())}</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-name" className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest">
                    <User className="w-3.5 h-3.5" />
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, name: e.target.value }));
                      if (formErrors.name) setFormErrors((fe) => ({ ...fe, name: undefined }));
                    }}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold)] focus:bg-white/15 transition-all"
                    style={formErrors.name ? { borderColor: "#f87171" } : {}}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-email" className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest">
                    <Mail className="w-3.5 h-3.5" />
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, email: e.target.value }));
                      if (formErrors.email) setFormErrors((fe) => ({ ...fe, email: undefined }));
                    }}
                    placeholder="nama@perusahaan.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold)] focus:bg-white/15 transition-all"
                    style={formErrors.email ? { borderColor: "#f87171" } : {}}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="checkout-phone" className="flex items-center gap-2 text-xs font-semibold text-white/60 uppercase tracking-widest">
                    <Phone className="w-3.5 h-3.5" />
                    No. Telepon <span className="text-white/30 normal-case font-normal">(opsional)</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="081234567890"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold)] focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <p className="text-[10px] text-white/30 italic text-center">
                Data Anda aman dan hanya digunakan untuk notifikasi pembayaran.
              </p>
            </div>

            {/* Submit Button */}
            <div className="p-6 border-t border-white/10 bg-navy">
              <Button
                id="btn-bayar-sekarang"
                onClick={handleCheckout}
                className="w-full rounded-md h-12 font-bold shadow-[0_0_20px_rgba(200,160,80,0.25)] hover:shadow-[0_0_25px_rgba(200,160,80,0.4)] transition-all flex items-center gap-2"
                style={{ backgroundColor: "var(--gold-dark)", color: "var(--navy)" }}
              >
                <CreditCard className="w-4 h-4" />
                Bayar {formatRupiah(totalPrice())}
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP: Processing ──────────────────────────────────────────────── */}
        {step === "processing" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(200,160,80,0.15)", border: "2px solid rgba(200,160,80,0.3)" }}
            >
              <Loader2 className="w-9 h-9 animate-spin" style={{ color: "var(--gold-dark)" }} />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white">Menyiapkan Pembayaran</p>
              <p className="text-sm text-white/50">
                Menghubungkan ke Midtrans Payment Gateway...
              </p>
            </div>
          </div>
        )}

        {/* ── STEP: Success ─────────────────────────────────────────────────── */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(74, 222, 128, 0.1)", border: "2px solid rgba(74, 222, 128, 0.3)" }}
            >
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white text-lg">Pembayaran Berhasil!</p>
              <p className="text-sm text-white/60">
                Konfirmasi akan dikirim ke{" "}
                <span className="text-[var(--gold)]">{form.email}</span>
              </p>
              {currentOrderId && (
                <p className="text-xs text-white/30 font-mono mt-2">
                  Order ID: {currentOrderId}
                </p>
              )}
            </div>
            <Button
              onClick={() => {
                setIsSheetOpen(false);
                setStep("cart");
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Tutup
            </Button>
          </div>
        )}

        {/* ── STEP: Error ───────────────────────────────────────────────────── */}
        {step === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(248, 113, 113, 0.1)", border: "2px solid rgba(248, 113, 113, 0.3)" }}
            >
              <AlertCircle className="w-9 h-9 text-red-400" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white text-lg">Pembayaran Gagal</p>
              <p className="text-sm text-white/60 max-w-xs">
                {errorMsg || "Terjadi kesalahan yang tidak terduga."}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setStep("form")}
                className="font-semibold"
                style={{ backgroundColor: "var(--gold-dark)", color: "var(--navy)" }}
              >
                Coba Lagi
              </Button>
              <Button
                onClick={() => {
                  setIsSheetOpen(false);
                  setStep("cart");
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Batal
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
