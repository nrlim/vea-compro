"use client";

import { useState } from "react";
import type { Brand } from "@/app/actions/brands";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function BrandsSection({ brands }: { brands: Brand[] }) {
  const brandList = brands || [];
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories: string[] = [
    "all",
    ...Array.from(
      new Set(
        brandList
          .map((b) => b.category)
          .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
      )
    ),
  ];

  const filteredBrands =
    activeCategory === "all"
      ? brandList
      : brandList.filter((b) => b.category === activeCategory);

  return (
    <section
      id="brands"
      className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-200/80"
      aria-label="Authorized Manufacturers and Principal Brands"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header (No Badge) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gold-dark mb-2">
              Principal Brands &amp; Global Manufacturers
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">
              Certified Distribution &amp; Manufacturer Network
            </h2>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-navy hover:text-gold-dark transition-colors shrink-0"
          >
            <span>View All Products &rarr;</span>
          </Link>
        </div>

        {/* Minimal Category Tabs */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xs transition-colors shrink-0 ${
                  activeCategory === cat
                    ? "bg-navy text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat === "all" ? "All Manufacturers" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Seamless Clean Grid (No Badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/produk?q=${encodeURIComponent(brand.name)}`}
              className="p-6 sm:p-7 bg-white rounded-xs border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {brand.category || "Principal Brand"}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    OEM Verified
                  </span>
                </div>

                <div className="h-16 mb-4 flex items-center justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logoUrl}
                    alt={`Logo ${brand.name}`}
                    className="max-h-full max-w-[150px] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                <h3 className="font-bold text-lg text-navy group-hover:text-gold-dark transition-colors mb-2">
                  {brand.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {brand.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-navy group-hover:text-gold-dark">
                <span>Explore Series</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-gold-dark" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
