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
      <label htmlFor={id} className="block text-xs font-semibold text-navy">
        {label} {required && <span className="text-gold-dark">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-9 pr-3.5 py-2.5 rounded-xs border text-xs sm:text-sm transition-colors outline-none bg-white text-navy focus:border-navy focus:ring-1 focus:ring-navy ${
            error ? "border-red-500" : "border-slate-300"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error[0]}</p>}
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
      className="py-16 md:py-24 bg-slate-50/50 relative overflow-hidden"
      aria-label="Contact and Request for Quotation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Direct Info (5 cols) */}
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gold-dark mb-2">
              Commercial &amp; Technical Inquiries
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-navy mb-4">
              Procurement Inquiries &amp; Quotation Requests
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-8">
              Submit your technical specifications, OEM part numbers, or Bill of Materials (BOM). Our engineering and procurement team will issue an official commercial quotation.
            </p>

            {/* Direct Contact Cards */}
            <div className="space-y-3.5 mb-8">
              <a
                href="https://wa.me/6281319994160"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 p-4 rounded-xs bg-white border border-slate-200/90 hover:border-slate-300 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xs bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">WhatsApp &amp; Direct Call</div>
                  <div className="text-sm font-bold text-navy mt-0.5 group-hover:text-gold-dark transition-colors">
                    +62 813-1999-4160
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">(+62) 21 50996969 Ext. 1641</div>
                </div>
              </a>

              <a
                href="mailto:harpenas@ptvea.com"
                className="flex items-start gap-3.5 p-4 rounded-xs bg-white border border-slate-200/90 hover:border-slate-300 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xs bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Commercial &amp; RFQ Email</div>
                  <div className="text-sm font-bold text-navy mt-0.5 group-hover:text-gold-dark transition-colors">
                    harpenas@ptvea.com
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Formal quotations &amp; technical datasheets</div>
                </div>
              </a>

              <div className="flex items-start gap-3.5 p-4 rounded-xs bg-white border border-slate-200/90">
                <div className="w-9 h-9 rounded-xs bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Representative Head Office</div>
                  <div className="text-sm font-bold text-navy mt-0.5">
                    Sudirman Central Business District (SCBD)
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Kebayoran Baru, South Jakarta 12190, Indonesia</div>
                </div>
              </div>
            </div>

            {/* SLA Badge */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Response SLA: Official commercial proposal within 1 business day (24 hours).</span>
            </div>
          </div>

          {/* Right Column: Clean RFQ Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xs bg-white border border-slate-200/90 shadow-2xs">
              <h3 className="text-lg font-bold text-navy mb-1">
                Formal Request for Quotation (RFQ)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Please complete the requirements below to receive an itemized proposal with technical verification.
              </p>

              {/* State Message Banner */}
              {state.message && (
                <div
                  className={`flex items-start gap-2.5 p-3 rounded-xs mb-5 text-xs border ${
                    state.success
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-red-50 text-red-800 border-red-300"
                  }`}
                >
                  {state.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <p className="flex-1">{state.message}</p>
                </div>
              )}

              <form ref={formRef} action={formAction} className="space-y-4" noValidate>
                <div className="absolute -left-[10000px]" aria-hidden="true">
                  <label htmlFor="rfq-website">Website</label>
                  <input id="rfq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    id="contact-name"
                    name="name"
                    label="Full Name"
                    placeholder="e.g. John Doe"
                    icon={User}
                    error={state.errors?.name}
                  />
                  <InputField
                    id="contact-company"
                    name="company"
                    label="Company / EPC Organization"
                    placeholder="e.g. PT Pertamina EP"
                    icon={Building2}
                    error={state.errors?.company}
                  />
                </div>

                <InputField
                  id="contact-email"
                  name="email"
                  label="Corporate Email"
                  type="email"
                  placeholder="john.doe@company.com"
                  icon={Mail}
                  error={state.errors?.email}
                />

                {/* Multi-Product Selector */}
                <div className="space-y-1.5 relative z-20">
                  <label className="block text-xs font-semibold text-navy">
                    Catalog Product Reference (Optional)
                  </label>

                  <input type="hidden" name="product" value={selectedProducts.join(",")} />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProductSelectOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between pl-9 pr-3.5 py-2.5 rounded-xs border border-slate-300 bg-white text-xs sm:text-sm text-left transition-colors hover:border-navy focus:border-navy"
                    >
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="truncate pr-4 text-xs font-medium text-navy">
                        {selectedProducts.length > 0
                          ? products
                              .filter((p) => selectedProducts.includes(p.id))
                              .map((p) => p.name)
                              .join(", ")
                          : "Select reference equipment from catalog..."}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isProductSelectOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProductSelectOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute w-full mt-1 bg-white border border-slate-300 shadow-md z-50 max-h-56 overflow-y-auto custom-scrollbar p-1 rounded-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProducts([]);
                              setIsProductSelectOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 flex items-center justify-between"
                          >
                            <span>General Inquiry / No Specific Catalog Item</span>
                            {selectedProducts.length === 0 && <Check className="w-3.5 h-3.5 text-navy" />}
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
                              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2.5 rounded-xs ${
                                selectedProducts.includes(p.id) ? "bg-slate-100 text-navy font-semibold" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${
                                  selectedProducts.includes(p.id)
                                    ? "bg-navy border-navy text-white"
                                    : "border-slate-400"
                                }`}
                              >
                                {selectedProducts.includes(p.id) && <Check className="w-2.5 h-2.5 text-gold" />}
                              </div>
                              <span className="truncate flex-1">{p.name}</span>
                              <span className="text-[10px] text-slate-400 uppercase">{p.category}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-navy">
                    Technical Specifications &amp; Scope <span className="text-gold-dark">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 pointer-events-none text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={3}
                      placeholder="Detail pressure class, pipe dimensions, fluid service (sweet/sour), actuator type, quantities, and delivery schedule..."
                      required
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xs border text-xs sm:text-sm transition-colors outline-none bg-white text-navy focus:border-navy focus:ring-1 focus:ring-navy resize-none ${
                        state.errors?.message ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                  </div>
                  {state.errors?.message && (
                    <p className="text-xs text-red-500 mt-1">{state.errors.message[0]}</p>
                  )}
                </div>

                {/* Document Attachment */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-attachment" className="block text-xs font-semibold text-navy">
                    Attach Bill of Materials (BOM) / Datasheets (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <input
                      id="contact-attachment"
                      name="attachment"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="w-full pl-9 pr-3 py-2 rounded-xs border border-slate-300 text-xs text-slate-600 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-xs file:text-xs file:font-medium file:bg-slate-100 file:text-navy hover:file:bg-slate-200 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (up to 5 files, 10 MB total).
                  </p>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 rounded-xs font-semibold text-xs sm:text-sm bg-navy text-white hover:bg-navy-deep transition-colors gap-2 mt-2"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting RFQ...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Submit Request for Quotation (RFQ)</span>
                      <Send className="w-3.5 h-3.5 text-gold" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
