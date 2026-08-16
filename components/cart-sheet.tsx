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
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createCartTransaction } from "@/app/actions/payment";
import { toast } from "sonner";

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

type CheckoutStep = "cart" | "form" | "processing" | "success" | "error";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
}

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

  useEffect(() => {
    if (step === "form") {
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [step]);

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

      if (typeof window !== "undefined" && window.snap) {
        setIsPaymentOpen(true);
        window.snap.pay(result.snapToken, {
          onSuccess: () => {
            setIsPaymentOpen(false);
            clearCart();
            setStep("success");
          },
          onPending: () => {
            setIsPaymentOpen(false);
            setStep("success");
          },
          onError: () => {
            setIsPaymentOpen(false);
            setErrorMsg("Pembayaran gagal atau dibatalkan. Silakan coba lagi.");
            setStep("error");
          },
          onClose: () => {
            setIsPaymentOpen(false);
            setStep("cart");
          },
        });
      } else {
        window.location.href = result.redirectUrl;
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi. Periksa jaringan Anda dan coba lagi.");
      setStep("error");
    }
  }

  if (!isMounted) {
    return (
      <Button
        variant="outline"
        className="relative h-9 px-3 rounded-full border-border/80 text-navy hover:bg-slate-100 text-xs font-semibold gap-1.5"
        aria-label="Lihat Keranjang"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        <span className="hidden sm:inline-block">Keranjang</span>
      </Button>
    );
  }

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        if (isPaymentOpen) return;
        setIsSheetOpen(open);
      }}
      modal={!isPaymentOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 px-3.5 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white text-xs font-semibold gap-1.5 backdrop-blur-sm transition-all"
          aria-label="Lihat Keranjang Belanja"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-gold-light" />
          <span className="hidden sm:inline-block">Keranjang</span>
          {totalItems() > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-gold text-navy px-1 shadow-xs ml-0.5">
              {totalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="w-[92vw] sm:max-w-md bg-white border-l border-border p-0 flex flex-col z-50 focus:outline-none"
      >
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border flex flex-row items-center justify-between space-y-0 bg-slate-surface">
          <div>
            <SheetTitle className="text-base font-serif font-bold text-navy flex items-center gap-2">
              {step === "form" && (
                <button
                  onClick={() => setStep("cart")}
                  className="text-slate-400 hover:text-navy transition-colors mr-1"
                  aria-label="Kembali ke keranjang"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {step === "form"
                ? "Informasi Pemesan"
                : step === "processing"
                ? "Menghubungkan Pembayaran..."
                : step === "success"
                ? "Pembayaran Sukses"
                : step === "error"
                ? "Status Pembayaran"
                : `Daftar Pengadaan (${totalItems()})`}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-[11px] mt-0.5">
              {step === "form"
                ? "Isi data identitas untuk invoice dan notifikasi Midtrans."
                : step === "processing"
                ? "Menyiapkan token transaksi payment gateway..."
                : step === "success"
                ? "Pesanan Anda telah tercatat dalam sistem PT VEA."
                : step === "error"
                ? "Silakan coba kembali atau gunakan metode lain."
                : "Komponen dan instrumen yang Anda pilih."}
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* STEP: Cart Items */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-400 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-border flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">
                    Keranjang komponen Anda masih kosong.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 rounded-xl border border-border/80 bg-white shadow-xs items-start"
                  >
                    <div className="relative w-16 h-16 bg-slate-50 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 p-1.5">
                      <Image
                        src={item.image || "/product-placeholder.png"}
                        alt={item.name}
                        fill
                        unoptimized={item.image?.startsWith("data:") || item.image?.startsWith("/uploads/")}
                        className="object-contain"
                      />
                    </div>

                    <div className="flex flex-col flex-1 min-h-[64px] justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-navy line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5 transition-colors shrink-0"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-mono text-xs font-bold text-navy">
                          {formatRupiah(item.price)}
                        </span>

                        <div className="flex items-center gap-1.5 border border-border rounded-lg bg-slate-50 px-1 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-navy hover:bg-white rounded transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[11px] font-mono font-bold w-4 text-center text-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-navy hover:bg-white rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pinned Bottom Checkout Bar */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border bg-slate-surface space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Estimasi Subtotal</span>
                  <span className="font-mono text-navy font-bold text-base">
                    {formatRupiah(totalPrice())}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  *Belum termasuk PPN dan ongkos kirim ke fasilitas proyek Anda.
                </p>

                <Button
                  onClick={() => setStep("form")}
                  className="w-full h-11 rounded-full font-bold text-xs uppercase tracking-wider bg-navy text-white hover:bg-navy-deep transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Lanjutkan ke Pemesanan</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* STEP: Customer Info Form */}
        {step === "form" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
              {/* Order Summary Mini */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-border">
                <p className="text-[10px] text-gold-dark uppercase tracking-widest mb-2 font-bold">
                  Ringkasan Item
                </p>
                <div className="space-y-1 text-xs">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-navy truncate pr-2">
                        {item.name} &times;{item.quantity}
                      </span>
                      <span className="text-navy font-mono font-bold shrink-0">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-navy">
                    <span>Total</span>
                    <span className="text-gold-dark font-mono">{formatRupiah(totalPrice())}</span>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="checkout-name" className="block text-xs font-bold uppercase tracking-wider text-navy">
                    Nama Lengkap / Kontak PIC <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="checkout-name"
                      ref={nameRef}
                      type="text"
                      value={form.name}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, name: e.target.value }));
                        if (formErrors.name) setFormErrors((fe) => ({ ...fe, name: undefined }));
                      }}
                      placeholder="e.g. Budi Santoso"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white text-navy focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-[10px] text-red-500 font-medium">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="checkout-email" className="block text-xs font-bold uppercase tracking-wider text-navy">
                    Email Korporat <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="checkout-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, email: e.target.value }));
                        if (formErrors.email) setFormErrors((fe) => ({ ...fe, email: undefined }));
                      }}
                      placeholder="budi@perusahaan.co.id"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white text-navy focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-[10px] text-red-500 font-medium">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="checkout-phone" className="block text-xs font-bold uppercase tracking-wider text-navy">
                    No. Telepon / WhatsApp (Opsional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="081234567890"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-white text-navy focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                <p className="text-[10px] text-muted-foreground">
                  Transaksi diproses aman melalui gateway terverifikasi Midtrans.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-border bg-slate-surface space-y-2">
              <Button
                id="btn-bayar-sekarang"
                onClick={handleCheckout}
                className="w-full h-11 rounded-full font-bold text-xs uppercase tracking-wider bg-navy text-white hover:bg-navy-deep shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-gold" />
                <span>Bayar {formatRupiah(totalPrice())}</span>
              </Button>
            </div>
          </div>
        )}

        {/* STEP: Processing */}
        {step === "processing" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gold-dark" />
            </div>
            <div>
              <p className="font-serif font-bold text-navy text-base">Menyiapkan Transaksi</p>
              <p className="text-xs text-muted-foreground mt-1">
                Menghubungkan dengan gateway pembayaran Midtrans...
              </p>
            </div>
          </div>
        )}

        {/* STEP: Success */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="font-serif font-bold text-navy text-lg">Transaksi Berhasil</p>
              <p className="text-xs text-muted-foreground mt-1">
                Konfirmasi dan detail pesanan dikirimkan ke <strong className="text-navy">{form.email}</strong>.
              </p>
              {currentOrderId && (
                <p className="text-[10px] font-mono text-slate-400 mt-2">
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
              size="sm"
              className="rounded-full text-xs font-semibold"
            >
              Kembali ke Katalog
            </Button>
          </div>
        )}

        {/* STEP: Error */}
        {step === "error" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="font-serif font-bold text-navy text-lg">Transaksi Terkendala</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {errorMsg || "Terjadi kendala saat memproses pesanan."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setStep("form")}
                size="sm"
                className="bg-navy text-white text-xs font-semibold rounded-full"
              >
                Coba Lagi
              </Button>
              <Button
                onClick={() => {
                  setIsSheetOpen(false);
                  setStep("cart");
                }}
                variant="outline"
                size="sm"
                className="text-xs font-semibold rounded-full"
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
