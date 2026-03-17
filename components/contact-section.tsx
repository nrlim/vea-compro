"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Building2, User, MessageSquare, Send, CheckCircle, AlertCircle, Phone, MapPin, Package, ChevronDown, Check } from "lucide-react";
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
      <label
        htmlFor={id}
        className="block text-sm font-semibold"
        style={{ color: "var(--navy)" }}
      >
        {label} {required && <span style={{ color: "var(--gold-dark)" }}>*</span>}
      </label>
      <div className="relative">
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden
        >
          <Icon className="w-4 h-4" style={{ color: "oklch(0.65 0.02 255)" }} strokeWidth={1.5} />
        </div>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none"
          style={{
            borderColor: error ? "oklch(0.577 0.245 27.325)" : "var(--border)",
            background: "white",
            color: "var(--navy)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--navy)";
            e.target.style.boxShadow = `0 0 0 3px oklch(0.22 0.065 255 / 0.08)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "oklch(0.577 0.245 27.325)" : "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      {error && (
        <p className="text-xs" style={{ color: "oklch(0.577 0.245 27.325)" }}>
          {error[0]}
        </p>
      )}
    </div>
  );
}

export function ContactSection({ products }: { products: Product[] }) {
  const [state, formAction, isPending] = useActionState(submitContactAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isProductSelectOpen, setIsProductSelectOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      setSelectedProduct("");
    }
  }, [state.success]);

  return (
    <section
      id="kontak"
      className="py-20 md:py-32"
      style={{ background: "oklch(0.975 0.005 250)" }}
      aria-label="Formulir Kontak PT Vanguard Energy Amanah"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 xl:gap-16">
          {/* Left — Info Panel (2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--gold-dark)" }}
            >
              Hubungi Kami
            </p>
            <h2
              className="font-serif font-bold text-fluid-4xl gold-line mb-4"
              style={{ color: "var(--navy)" }}
            >
              Mulai Konsultasi Anda
            </h2>
            <p
              className="mt-8 text-fluid-base leading-relaxed mb-10"
              style={{ color: "oklch(0.45 0.02 255)" }}
            >
              Tim ahli PT VEA siap mendampingi Anda dalam merancang solusi energi
              yang tepat. Sampaikan kebutuhan Anda dan kami akan merespons dalam
              1x24 jam kerja.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  label: "WhatsApp / Telepon",
                  value: "+62 813-1999-4160 / (+62) 21 50996969 Ext. 1641",
                },
                {
                  icon: Mail,
                  label: "Email Korporat",
                  value: "harpenas@ptvea.com",
                },
                {
                  icon: MapPin,
                  label: "Kantor Pusat",
                  value: "Jl. Jenderal Sudirman, RT.5/RW.3, Senayan, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12190",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4 rounded-xl border bg-white"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "oklch(0.22 0.065 255 / 0.08)",
                    }}
                  >
                    <item.icon
                      className="w-4 h-4"
                      style={{ color: "var(--navy)" }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "oklch(0.60 0.02 255)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: "var(--navy)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form (3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div
              className="bg-white rounded-2xl p-8 md:p-10 border shadow-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <h3
                className="font-serif font-bold text-2xl mb-7"
                style={{ color: "var(--navy)" }}
              >
                Formulir Konsultasi
              </h3>

              {/* Success / Error Banner */}
              {state.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl mb-6"
                  style={{
                    background: state.success
                      ? "oklch(0.95 0.08 145 / 0.5)"
                      : "oklch(0.95 0.08 27 / 0.5)",
                    border: `1px solid ${state.success ? "oklch(0.75 0.12 145)" : "oklch(0.75 0.12 27)"}`,
                  }}
                >
                  {state.success ? (
                    <CheckCircle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: "oklch(0.55 0.15 145)" }}
                      strokeWidth={1.5}
                    />
                  ) : (
                    <AlertCircle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: "oklch(0.577 0.245 27.325)" }}
                      strokeWidth={1.5}
                    />
                  )}
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: state.success
                        ? "oklch(0.35 0.12 145)"
                        : "oklch(0.45 0.2 27)",
                    }}
                  >
                    {state.message}
                  </p>
                </motion.div>
              )}

              <form ref={formRef} action={formAction} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <InputField
                    id="contact-name"
                    name="name"
                    label="Nama Lengkap"
                    placeholder="Budi Santoso"
                    icon={User}
                    error={state.errors?.name}
                  />
                  <InputField
                    id="contact-company"
                    name="company"
                    label="Nama Perusahaan"
                    placeholder="PT Maju Bersama"
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

                {/* Custom Product Select with framer-motion */}
                <div className="space-y-1.5 relative z-10">
                  <label
                    htmlFor="contact-product"
                    className="block text-sm font-semibold"
                    style={{ color: "var(--navy)" }}
                  >
                    Produk yang Diminati
                  </label>

                  {/* Hidden input to hold the actual value for FormData */}
                  <input type="hidden" name="product" value={selectedProduct} />

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProductSelectOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none text-left"
                      style={{
                        borderColor: isProductSelectOpen ? "var(--navy)" : "var(--border)",
                        background: "white",
                        color: selectedProduct ? "var(--navy)" : "oklch(0.65 0.02 255)",
                        boxShadow: isProductSelectOpen ? `0 0 0 3px oklch(0.22 0.065 255 / 0.08)` : "none",
                      }}
                    >
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden>
                        <Package className="w-4 h-4" style={{ color: "oklch(0.65 0.02 255)" }} strokeWidth={1.5} />
                      </div>

                      <span className="truncate pr-4">
                        {selectedProduct
                          ? products.find(p => p.id === selectedProduct)?.name
                          : "Pilih produk referensi (opsional)"}
                      </span>

                      <ChevronDown
                        className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                        style={{ transform: isProductSelectOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>

                    <AnimatePresence>
                      {isProductSelectOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {/* Empty Selection */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProduct("");
                                setIsProductSelectOpen(false);
                              }}
                              className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between"
                              style={{
                                background: selectedProduct === "" ? "oklch(0.975 0.005 250)" : "transparent",
                                color: selectedProduct === "" ? "var(--navy)" : "oklch(0.45 0.02 255)",
                              }}
                            >
                              <span>Kosongkan / Tidak spesifik</span>
                              {selectedProduct === "" && (
                                <Check className="w-4 h-4" style={{ color: "var(--gold-dark)" }} />
                              )}
                            </button>

                            {/* Product List */}
                            {products.map((product) => (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => {
                                  setSelectedProduct(product.id);
                                  setIsProductSelectOpen(false);
                                }}
                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors group flex items-start gap-3"
                                style={{
                                  background: selectedProduct === product.id ? "oklch(0.975 0.005 250)" : "transparent",
                                  color: selectedProduct === product.id ? "var(--navy)" : "oklch(0.20 0.02 255)",
                                }}
                              >
                                {selectedProduct === product.id ? (
                                  <Check className="w-4 h-4 mt-3 flex-shrink-0" style={{ color: "var(--gold-dark)" }} />
                                ) : (
                                  <div className="w-4 h-4 mt-3 flex-shrink-0" /> // Spacer
                                )}
                                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-50 border flex-shrink-0" style={{ borderColor: "var(--border)" }}>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col justify-center min-h-[40px]">
                                  <div className="font-semibold group-hover:text-[var(--gold-dark)] transition-colors line-clamp-1">
                                    {product.name}
                                  </div>
                                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.02 255)" }}>
                                    {product.category}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Message textarea */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold"
                    style={{ color: "var(--navy)" }}
                  >
                    Pesan / Kebutuhan Anda{" "}
                    <span style={{ color: "var(--gold-dark)" }}>*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3.5 pointer-events-none" aria-hidden>
                      <MessageSquare
                        className="w-4 h-4"
                        style={{ color: "oklch(0.65 0.02 255)" }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Ceritakan kebutuhan energi perusahaan Anda..."
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none resize-none"
                      style={{
                        borderColor: state.errors?.message
                          ? "oklch(0.577 0.245 27.325)"
                          : "var(--border)",
                        background: "white",
                        color: "var(--navy)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--navy)";
                        e.target.style.boxShadow = `0 0 0 3px oklch(0.22 0.065 255 / 0.08)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = state.errors?.message
                          ? "oklch(0.577 0.245 27.325)"
                          : "var(--border)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {state.errors?.message && (
                    <p className="text-xs" style={{ color: "oklch(0.577 0.245 27.325)" }}>
                      {state.errors.message[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full touch-target font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none group"
                  style={{
                    background: isPending
                      ? "oklch(0.45 0.02 255)"
                      : "linear-gradient(135deg, var(--navy), var(--navy-light))",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          d="M21 12a9 9 0 11-6.219-8.56"
                          strokeLinecap="round"
                        />
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Kirim Pesan
                      <Send
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                        strokeWidth={1.5}
                      />
                    </span>
                  )}
                </Button>

                <p
                  className="text-xs text-center"
                  style={{ color: "oklch(0.65 0.02 255)" }}
                >
                  Data Anda terlindungi dan tidak akan disebarkan kepada pihak ketiga.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
