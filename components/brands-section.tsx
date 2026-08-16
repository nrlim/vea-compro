"use client";

import { useState } from "react";
import type { Brand } from "@/app/actions/brands";
import { ArrowUpRight, Cpu, Layers, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function BrandsSection({ brands }: { brands: Brand[] }) {
  const brandList = brands || [];
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Extract unique categories
  const categories = ["all", ...Array.from(new Set(brandList.map((b) => b.category).filter(Boolean))) as string[]];

  const filteredBrands =
    activeCategory === "all"
      ? brandList
      : brandList.filter((b) => b.category === activeCategory);

  return (
    <section
      id="brands"
      className="py-20 md:py-28 bg-background relative overflow-hidden"
      aria-label="Platform & Principal Brands PT VEA"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border/80">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-dark mb-1">
              Principal Manufaktur Terkemuka
            </p>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-navy tracking-tight">
              Platform & Principal Brands
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-3">
              Kemitraan resmi dengan manufaktur instrumen global untuk jaminan orisinalitas part number, sertifikat pengujian pabrik, dan ketersediaan suku cadang berkelanjutan.
            </p>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy hover:text-gold-dark transition-colors group shrink-0"
          >
            <span>Buka Katalog Lengkap</span>
            <ArrowUpRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-navy text-white shadow-sm"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-navy"
                }`}
              >
                {cat === "all" ? "Semua Principal Brands" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Brand Showcase Grid */}
        {filteredBrands.length === 0 ? (
          <div className="text-center py-16 bg-slate-surface rounded-2xl border border-dashed border-border">
            <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-medium">Belum ada brand dalam kategori ini.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredBrands.map((brand) => (
                <motion.div
                  key={brand.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href="/produk"
                    className="group block h-full bg-white rounded-2xl p-6 sm:p-7 border border-border/80 shadow-xs hover:shadow-xl hover:border-gold/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 focus:outline-none"
                  >
                    <div>
                      {/* Top Header: Category Tag & Verified Icon */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        {brand.category ? (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/10 text-gold-dark border border-gold/20">
                            {brand.category}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy/5 text-navy">
                            Principal Resmi
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-emerald-600 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-medium">100% Original</span>
                        </div>
                      </div>

                      {/* Logo Canvas */}
                      <div className="h-32 mb-5 flex items-center justify-center p-5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-slate-100/60 transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={brand.logoUrl}
                          alt={`Logo ${brand.name}`}
                          className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Brand Title & Description */}
                      <h3 className="font-serif font-bold text-xl text-navy group-hover:text-gold-dark transition-colors">
                        {brand.name}
                      </h3>

                      {brand.description && (
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mt-2 line-clamp-3">
                          {brand.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-navy group-hover:text-gold-dark transition-colors">
                      <span>Jelajahi Produk Brand</span>
                      <ArrowUpRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
