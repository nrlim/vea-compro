"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Search, Filter, RotateCcw, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  images: string[];
  manualUrl?: string | null;
  datasheetUrl?: string | null;
  summary: string;
  description: string;
  price: number;
};

interface ProductGridProps {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  const [selectedBrand, setSelectedBrand] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua Tipe");
  const [searchQuery, setSearchQuery] = useState("");

  const BRANDS = useMemo(
    () => ["Semua", ...Array.from(new Set(initialProducts.map((p) => p.brand || "PT VEA")))],
    [initialProducts]
  );

  const CATEGORIES = useMemo(
    () => ["Semua Tipe", ...Array.from(new Set(initialProducts.map((p) => p.category)))],
    [initialProducts]
  );

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const brandMatch = selectedBrand === "Semua" || p.brand === selectedBrand;
      const categoryMatch = selectedCategory === "Semua Tipe" || p.category === selectedCategory;
      const searchMatch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return brandMatch && categoryMatch && searchMatch;
    });
  }, [initialProducts, selectedBrand, selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedBrand("Semua");
    setSelectedCategory("Semua Tipe");
    setSearchQuery("");
  };

  return (
    <div className="bg-background min-h-screen pb-24">
      
      {/* Top Hero Banner — Seamless with Navbar Theme */}
      <div className="relative bg-navy-deep text-white pt-28 pb-16 md:pt-36 md:pb-20 border-b border-white/10 overflow-hidden">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-energy.png"
            alt="Katalog Instrumen PT VEA"
            fill
            priority
            className="object-cover object-center brightness-50 contrast-110"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(4, 10, 22, 0.85) 0%, rgba(7, 19, 38, 0.70) 50%, rgba(4, 10, 22, 0.95) 100%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-gold transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gold font-medium">Katalog Produk</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-3">
              Katalog Instrumen & Valves Industrial
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Daftar spesifikasi lengkap instrumen presisi, control valves, orifice fittings, dan tubing berstandar API & ASME dengan jaminan orisinalitas part number manufaktur.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalog Workspace */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 md:pt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sticky Filter Sidebar (Machined Industrial Corners) */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6 lg:sticky lg:top-24 bg-white p-5 sm:p-6 rounded-xl border border-border/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-navy" />
                <h3 className="font-serif font-bold text-sm text-navy">Filter Inventaris</h3>
              </div>
              {(selectedBrand !== "Semua" || selectedCategory !== "Semua Tipe" || searchQuery) && (
                <button
                  onClick={handleReset}
                  className="text-[11px] font-semibold text-gold-dark hover:text-navy flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Live Search Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Pencarian Model / Part
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Barton, Fisher, Valve..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-slate-50 text-navy placeholder:text-slate-400 focus:bg-white focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Kategori Komponen
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? "bg-navy text-white shadow-xs font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] font-mono ${selectedCategory === cat ? "text-gold" : "text-slate-400"}`}>
                      {cat === "Semua Tipe"
                        ? initialProducts.length
                        : initialProducts.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {BRANDS.length > 2 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Principal Brand
                </label>
                <div className="space-y-1">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedBrand === brand
                          ? "bg-gold/15 text-navy border border-gold/30 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                      }`}
                    >
                      <span>{brand}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {brand === "Semua"
                          ? initialProducts.length
                          : initialProducts.filter((p) => (p.brand || "PT VEA") === brand).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <span className="text-xs text-muted-foreground font-medium">
                Menampilkan <strong className="text-navy">{filteredProducts.length}</strong> produk spesifikasi
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">
                  Status: Siap Penawaran (RFQ)
                </span>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-border p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border flex items-center justify-center mx-auto text-slate-400">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-navy">
                    Tidak Ditemukan Produk yang Sesuai
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Silakan ubah kata kunci pencarian atau reset filter untuk melihat katalog lengkap.
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs font-semibold"
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
