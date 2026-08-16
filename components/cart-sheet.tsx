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
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Send,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

type CheckoutStep = "cart" | "form" | "success";

interface CustomerForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
}

export function CartSheet() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<CustomerForm>>({});
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
    if (!form.company.trim() || form.company.trim().length < 2) {
      errors.company = "Nama perusahaan wajib diisi";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format email tidak valid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSendWhatsAppRFQ() {
    if (!validateForm()) return;

    // Build structured B2B RFQ message
    const itemsList = items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}*\n   • Jumlah: ${item.quantity} unit\n   • Est. Satuan: ${
            item.price > 0 ? formatRupiah(item.price) : "Status RFQ"
          }`
      )
      .join("\n\n");

    const message = `*PERMINTAAN PENAWARAN RESMI (RFQ)*
*PT Vanguard Energy Amanah*
────────────────────────
*Data Pemohon:*
• Nama PIC: ${form.name.trim()}
• Perusahaan / Instansi: ${form.company.trim()}
• Email Korporat: ${form.email.trim()}
• No. WhatsApp / Telp: ${form.phone.trim() || "-"}
${form.notes.trim() ? `• Catatan Teknis / Lokasi Proyek: ${form.notes.trim()}\n` : ""}
────────────────────────
*Daftar Kebutuhan Instrumen & Komponen:*
${itemsList}

*Total Item*: ${totalItems()} unit
${totalPrice() > 0 ? `*Estimasi Total Subtotal*: ${formatRupiah(totalPrice())}\n` : ""}
Mohon surat penawaran resmi, ketersediaan stok, dan jadwal pengiriman teknis. Terima kasih.`;

    const targetUrl = `https://wa.me/6281319994160?text=${encodeURIComponent(message)}`;
    window.open(targetUrl, "_blank");

    toast.success("Daftar RFQ Terkirim!", {
      description: "Menghubungkan ke WhatsApp Sales Engineer PT VEA.",
    });

    setStep("success");
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
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 px-3 sm:px-3.5 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white text-xs font-semibold gap-1.5 backdrop-blur-sm transition-all cursor-pointer"
          aria-label="Buka Keranjang Belanja dan RFQ"
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
        className="w-full sm:max-w-md bg-white border-l border-border p-0 flex flex-col z-50 focus:outline-none shadow-2xl"
      >
        {/* Header Section */}
        <SheetHeader className="p-4 sm:p-5 border-b border-border bg-slate-surface flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex-1 pr-6">
            <SheetTitle className="text-sm sm:text-base font-serif font-bold text-navy flex items-center gap-2">
              {step === "form" && (
                <button
                  onClick={() => setStep("cart")}
                  className="text-slate-400 hover:text-navy transition-colors p-1 -ml-1 rounded-lg hover:bg-slate-100"
                  aria-label="Kembali ke daftar item"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {step === "form"
                ? "Formulir Permintaan Penawaran (RFQ)"
                : step === "success"
                ? "RFQ Berhasil Disiapkan"
                : `Daftar Kebutuhan (${totalItems()})`}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
              {step === "form"
                ? "Lengkapi profil PIC & perusahaan untuk penerbitan quotation resmi."
                : step === "success"
                ? "Daftar kebutuhan telah diteruskan ke tim engineering sales PT VEA."
                : "Daftar instrumen dan komponen yang ingin Anda ajukan penawaran."}
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* STEP 1: Cart Items */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-5 space-y-3">
              {items.length === 0 ? (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-border flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-navy">
                      Keranjang Kebutuhan Masih Kosong
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                      Pilih instrumen presisi atau control valve dari katalog untuk menambahkan ke daftar RFQ.
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs font-semibold text-navy border-border hover:bg-slate-50"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Link href="/produk">Jelajahi Katalog Produk</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl border border-border/80 bg-white shadow-xs items-start hover:border-gold/40 transition-colors"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 p-1">
                      <Image
                        src={item.image || "/product-placeholder.png"}
                        alt={item.name}
                        fill
                        unoptimized={item.image?.startsWith("data:") || item.image?.startsWith("/uploads/")}
                        className="object-contain"
                      />
                    </div>

                    {/* Info & Quantity Stepper */}
                    <div className="flex flex-col flex-1 min-h-[56px] justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-navy line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 -mr-1 transition-colors shrink-0 rounded-md hover:bg-red-50"
                          aria-label={`Hapus ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-mono text-xs font-bold text-navy">
                          {item.price > 0 ? formatRupiah(item.price) : "Status RFQ"}
                        </span>

                        {/* Stepper with comfortable mobile touch target */}
                        <div className="flex items-center gap-1 border border-border rounded-lg bg-slate-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-navy hover:bg-white rounded transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[11px] font-mono font-bold w-5 text-center text-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-navy hover:bg-white rounded transition-colors"
                            aria-label="Tambah kuantitas"
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

            {/* Bottom Actions Bar */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-border bg-slate-surface space-y-3 shrink-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Estimasi Subtotal</span>
                  <span className="font-mono text-navy font-bold text-base sm:text-lg">
                    {totalPrice() > 0 ? formatRupiah(totalPrice()) : "Penawaran Khusus (RFQ)"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  *Harga resmi, diskon volume, dan jadwal pengiriman diterbitkan melalui Surat Penawaran Resmi (Quotation).
                </p>

                <Button
                  onClick={() => setStep("form")}
                  className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-navy text-white hover:bg-navy-deep transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lanjutkan ke Pengajuan RFQ</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: PIC & Company Form */}
        {step === "form" && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4">
              
              {/* Order Summary Snapshot */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gold-dark uppercase tracking-widest font-bold">
                    Ringkasan {totalItems()} Komponen
                  </span>
                  <button
                    onClick={() => setStep("cart")}
                    className="text-[11px] font-semibold text-navy hover:text-gold-dark transition-colors underline"
                  >
                    Ubah
                  </button>
                </div>
                <div className="space-y-1.5 text-xs max-h-28 overflow-y-auto custom-scrollbar pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-baseline gap-2">
                      <span className="text-slate-700 truncate text-[11px]">
                        • {item.name} <strong className="text-navy">({item.quantity}x)</strong>
                      </span>
                      <span className="text-navy font-mono text-[11px] font-semibold shrink-0">
                        {item.price > 0 ? formatRupiah(item.price * item.quantity) : "RFQ"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                {/* PIC Name */}
                <div className="space-y-1">
                  <label htmlFor="checkout-name" className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Nama Lengkap PIC <span className="text-red-500">*</span>
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
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-[10px] text-red-500 font-medium">{formErrors.name}</p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label htmlFor="checkout-company" className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Perusahaan / Instansi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="checkout-company"
                      type="text"
                      value={form.company}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, company: e.target.value }));
                        if (formErrors.company) setFormErrors((fe) => ({ ...fe, company: undefined }));
                      }}
                      placeholder="e.g. PT Pertamina EP / Rekayasa Industri"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                    />
                  </div>
                  {formErrors.company && (
                    <p className="text-[10px] text-red-500 font-medium">{formErrors.company}</p>
                  )}
                </div>

                {/* Corporate Email */}
                <div className="space-y-1">
                  <label htmlFor="checkout-email" className="block text-[11px] font-bold uppercase tracking-wider text-navy">
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
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-[10px] text-red-500 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-1">
                  <label htmlFor="checkout-phone" className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    No. WhatsApp / Telepon PIC
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="081234567890"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                    />
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-1">
                  <label htmlFor="checkout-notes" className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Catatan Sizing / Lokasi Proyek
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <textarea
                      id="checkout-notes"
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Tekanan operasional, material compliance (NACE), timeline..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-navy focus:ring-1 focus:ring-navy outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Compliance Notice */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Permintaan diproses langsung oleh tim engineering sales PT VEA dengan jaminan sertifikat part number resmi.
                </p>
              </div>
            </div>

            {/* Action Button: Send RFQ via WhatsApp */}
            <div className="p-4 sm:p-5 border-t border-border bg-slate-surface space-y-2 shrink-0">
              <Button
                onClick={handleSendWhatsAppRFQ}
                className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Ajukan RFQ Resmi via WhatsApp</span>
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="font-serif font-bold text-navy text-lg">
                Permintaan RFQ Berhasil Disiapkan
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                Tim sales engineering kami akan segera merespons surat penawaran resmi untuk <strong className="text-navy">{form.company || "perusahaan Anda"}</strong>.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 pt-2">
              <Button
                onClick={() => {
                  clearCart();
                  setIsSheetOpen(false);
                  setStep("cart");
                }}
                className="w-full h-10 rounded-lg text-xs font-bold uppercase tracking-wider bg-navy text-white hover:bg-navy-deep"
              >
                Selesai & Kosongkan Keranjang
              </Button>

              <Button
                onClick={() => {
                  setIsSheetOpen(false);
                  setStep("cart");
                }}
                variant="outline"
                className="w-full h-10 rounded-lg text-xs font-semibold text-slate-600"
              >
                Tetap Simpan Daftar Item
              </Button>
            </div>
          </div>
        )}

      </SheetContent>
    </Sheet>
  );
}
