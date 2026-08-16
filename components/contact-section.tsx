"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Building2,
  User,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Package,
  ChevronDown,
  Check,
  Paperclip,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitContactAction, type ContactFormState } from "@/app/actions/contact";
import { type Product } from "@/components/products/ProductGrid";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

function InputField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  required = true,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  required?: boolean;
  error?: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-navy">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none bg-white text-navy focus:border-navy focus:ring-2 focus:ring-navy/10 ${
            error ? "border-red-500" : "border-border"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error[0]}</p>}
    </div>
  );
}

export function ContactSection({ products }: { products: Product[] }) {
  const [state, formAction, isPending] = useActionState(submitContactAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isProductSelectOpen, setIsProductSelectOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      setSelectedProducts([]);
    }
  }, [state.success]);

  return (
    <section
      id="kontak"
      className="py-24 md:py-32 bg-slate-surface/40 relative overflow-hidden"
      aria-label="Konsultasi Proyek & RFQ PT VEA"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Left Column — Contact Info & Direct Channels */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold-dark text-[11px] font-bold tracking-widest uppercase mb-4 self-start">
              <span>Konsultasi & Permintaan Penawaran</span>
            </div>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-navy tracking-tight leading-[1.15] mb-6">
              Diskusikan Kebutuhan Instrumen & Valves Anda Bersama Tim Ahli.
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
              Tim engineering dan procurement PT VEA siap memberikan rekomendasi spesifikasi teknis, ketersediaan stok, dan penawaran harga resmi (Quotation) dalam 1x24 jam kerja.
            </p>

            {/* Direct Channel Cards */}
            <div className="space-y-3.5 mb-8">
              {[
                {
                  icon: Phone,
                  title: "Direct WhatsApp & Hotline",
                  value: "+62 813-1999-4160",
                  sub: "(+62) 21 50996969 Ext. 1641",
                  href: "https://wa.me/6281319994160",
                },
                {
                  icon: Mail,
                  title: "Email Procurement & RFQ",
                  value: "harpenas@ptvea.com",
                  sub: "Dukungan Teknis & Penawaran Resmi",
                  href: "mailto:harpenas@ptvea.com",
                },
                {
                  icon: MapPin,
                  title: "Head Office & Representative",
                  value: "Sudirman Central Business District",
                  sub: "Kebayoran Baru, Jakarta Selatan 12190",
                  href: "#",
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border/80 shadow-xs hover:border-gold/50 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-navy/5 border border-navy/10 flex items-center justify-center shrink-0 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                    <item.icon className="w-5 h-5 text-navy group-hover:text-gold-dark transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">
                      {item.title}
                    </p>
                    <p className="text-sm font-bold text-navy truncate mt-0.5">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* SLA Trust Badge */}
            <div className="p-4 rounded-xl bg-navy text-white flex items-center gap-3 border border-navy-deep">
              <Clock className="w-5 h-5 text-gold shrink-0" />
              <p className="text-xs text-white/80 leading-snug">
                <strong className="text-white font-semibold">Respon Cepat:</strong> Permintaan penawaran harga & ketersediaan stok diproses maksimal 1 hari kerja.
              </p>
            </div>
          </motion.div>

          {/* Right Column — Enterprise RFQ Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="double-bezel shadow-xl">
              <div className="double-bezel-inner p-6 sm:p-8 md:p-10 bg-white border border-border/60">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-5 mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-navy">
                      Formulir RFQ & Konsultasi
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Silakan isi detail spesifikasi atau lampirkan dokumen kebutuhan proyek Anda.
                    </p>
                  </div>
                  <ShieldCheck className="w-7 h-7 text-gold-dark shrink-0" />
                </div>

                {/* State Message Banner */}
                {state.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-xl mb-6 text-xs font-medium border ${
                      state.success
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}
                  >
                    {state.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <p className="flex-1">{state.message}</p>
                  </motion.div>
                )}

                <form ref={formRef} action={formAction} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField
                      id="contact-name"
                      name="name"
                      label="Nama Lengkap"
                      placeholder="e.g. Budi Santoso"
                      icon={User}
                      error={state.errors?.name}
                    />
                    <InputField
                      id="contact-company"
                      name="company"
                      label="Nama Perusahaan"
                      placeholder="e.g. PT Pertamina Hulu"
                      icon={Building2}
                      error={state.errors?.company}
                    />
                  </div>

                  <InputField
                    id="contact-email"
                    name="email"
                    label="Email Korporat"
                    type="email"
                    placeholder="budi@perusahaan.co.id"
                    icon={Mail}
                    error={state.errors?.email}
                  />

                  {/* Multi-Product Reference Select */}
                  <div className="space-y-1.5 relative z-20">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy">
                      Produk Terkait (Opsional)
                    </label>

                    <input type="hidden" name="product" value={selectedProducts.join(",")} />
                    <input
                      type="hidden"
                      name="productName"
                      value={products
                        .filter((p) => selectedProducts.includes(p.id))
                        .map((p) => p.name)
                        .join("|||")}
                    />
                    <input
                      type="hidden"
                      name="productImage"
                      value={products.find((p) => selectedProducts.includes(p.id))?.image || ""}
                    />

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsProductSelectOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-sm text-left transition-all hover:border-navy/40 focus:border-navy focus:ring-2 focus:ring-navy/10"
                      >
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <Package className="w-4 h-4" />
                        </div>
                        <span className="truncate pr-4 text-xs font-medium text-navy">
                          {selectedProducts.length > 0
                            ? products
                                .filter((p) => selectedProducts.includes(p.id))
                                .map((p) => p.name)
                                .join(", ")
                            : "Pilih produk referensi dari katalog..."}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isProductSelectOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isProductSelectOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProducts([]);
                                setIsProductSelectOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 flex items-center justify-between"
                            >
                              <span>Kosongkan Pilihan (Pertanyaan Umum)</span>
                              {selectedProducts.length === 0 && <Check className="w-3.5 h-3.5 text-gold-dark" />}
                            </button>

                            {products.map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedProducts((prev) =>
                                    prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                                  );
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-3 ${
                                  selectedProducts.includes(p.id) ? "bg-slate-100 text-navy font-bold" : "hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    selectedProducts.includes(p.id)
                                      ? "bg-navy border-navy text-white"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {selectedProducts.includes(p.id) && <Check className="w-3 h-3 text-gold" />}
                                </div>
                                <span className="truncate flex-1">{p.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">{p.category}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Message Details */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-navy">
                      Detail Kebutuhan & Spesifikasi <span className="text-gold-dark">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-3.5 pointer-events-none text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        placeholder="Jelaskan jenis instrumen/valve, quantity, rating tekanan (Class 150/300/600), material body, dan timeline proyek..."
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all outline-none bg-white text-navy focus:border-navy focus:ring-2 focus:ring-navy/10 resize-none ${
                          state.errors?.message ? "border-red-500" : "border-border"
                        }`}
                      />
                    </div>
                    {state.errors?.message && (
                      <p className="text-xs text-red-500 font-medium">{state.errors.message[0]}</p>
                    )}
                  </div>

                  {/* Document Attachment */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-attachment" className="block text-xs font-bold uppercase tracking-wider text-navy">
                      Lampiran Dokumen / Data Sheet (Opsional)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <input
                        id="contact-attachment"
                        name="attachment"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-navy/5 file:text-navy hover:file:bg-navy/10 cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Maksimal 10 MB per file (PDF, DOCX, JPG, PNG).
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 rounded-full font-bold text-xs uppercase tracking-wider bg-navy text-white hover:bg-navy-deep transition-all shadow-md gap-2"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengirimkan Permintaan...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Kirim Permintaan Penawaran (RFQ)</span>
                        <Send className="w-4 h-4 text-gold" />
                      </span>
                    )}
                  </Button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Data Anda tersimpan aman dan tidak akan dibagikan kepada pihak ketiga.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
