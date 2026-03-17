"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  summary: string;
  description: string;
  price: number;
};

// Hardcoded mockup data
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Transformator Distribusi 20kV",
    category: "Power Grid",
    brand: "VoltMax",
    image: "/product-placeholder.png",
    summary: "Transformator efisiensi tinggi untuk jaringan distribusi menengah.",
    description: "Transformator distribusi 20kV dari PT Vanguard Energy Amanah dirancang khusus untuk memenuhi standar ketat infrastruktur kelistrikan Indonesia. Material kumparan presisi dan inti besi berkualitas unggul memastikan kehilangan daya (losses) yang sangat minim.",
    price: 45000000,
  },
  {
    id: "p2",
    name: "Panel Switchgear Tegangan Menengah",
    category: "Power Grid",
    brand: "EnergyCore",
    image: "/product-placeholder.png",
    summary: "Sistem proteksi dan distribusi sirkuit yang tangguh dan aman.",
    description: "Panel Switchgear Medium Voltage (MV) kami dilengkapi fitur keselamatan mutakhir (arc-proof design) untuk melindungi peralatan vital dan personel. Konstruksi modular memudahkan ekspansi sistem di masa depan.",
    price: 38500000,
  },
  {
    id: "p3",
    name: "Smart Inverter Sistem Surya 50kW",
    category: "Renewable Energy",
    brand: "EcoPower",
    image: "/product-placeholder.png",
    summary: "Inverter fotovoltaik cerdas pengelola konversi energi optimal.",
    description: "Inverter surya 50kW ini menggunakan teknologi Maximum Power Point Tracking (MPPT) ganda adaptif yang mampu mengekstrak daya maksimal bahkan di bawah kondisi iluminasi parsial.",
    price: 12500000,
  },
  {
    id: "p4",
    name: "Sistem Penyimpanan Energi Baterai (BESS)",
    category: "Renewable Energy",
    brand: "EnergyCore",
    image: "/product-placeholder.png",
    summary: "Solusi baterai grid-scale untuk manajemen beban dan cadangan.",
    description: "Battery Energy Storage System (BESS) komersial yang dirancang untuk menjaga stabilitas grid (frequency regulation) dan peak shaving.",
    price: 85000000,
  },
  {
    id: "p5",
    name: "Turbin Angin Mikro Vertikal",
    category: "Renewable Energy",
    brand: "EcoPower",
    image: "/product-placeholder.png",
    summary: "Generator angin aerodinamis kompak untuk lingkungan terpencil.",
    description: "Turbin angin sumbu vertikal (VAWT) ini didesain aerodinamis untuk menangkap angin dari segala arah (omnidirectional). Beroperasi dengan level kebisingan sangat rendah.",
    price: 24000000,
  },
  {
    id: "p6",
    name: "Kabel Transmisi Bawah Laut 150kV",
    category: "Power Grid",
    brand: "VoltMax",
    image: "/product-placeholder.png",
    summary: "Kabel transmisi kelas berat tahan tekanan laut dalam.",
    description: "Kabel isolasi polimer terstruktur tingkat lanjut (XLPE) untuk transmisi kelistrikan bawah laut 150kV. Memiliki lapisan pelindung galvanis ganda dan perisai kedap air (water-blocking).",
    price: 5500000,
  }
];

export function ProductGrid() {
  const [selectedBrand, setSelectedBrand] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua Tipe");

  // Dynamically generate lists from mockup
  const BRANDS = ["Semua", ...Array.from(new Set(PRODUCTS.map((p) => p.brand)))];
  const CATEGORIES = ["Semua Tipe", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  const filteredProducts = PRODUCTS.filter((p) => {
    const brandMatch = selectedBrand === "Semua" || p.brand === selectedBrand;
    const categoryMatch = selectedCategory === "Semua Tipe" || p.category === selectedCategory;
    return brandMatch && categoryMatch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <section
      id="katalog-produk"
      // Uses the existing corporate light theme
      className="pt-8 md:pt-12"
      style={{ backgroundColor: "#F9F7F2" }}
      aria-label="Katalog Produk PT Vanguard Energy Amanah"
    >
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* 2-Column Industrial Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
          
          {/* Left Column (Stretches to the full height of the right column natively) */}
          <div className="w-full lg:w-72 flex-shrink-0">
            {/* The actual sticky element that slides around inside the stretched left column */}
            <aside className="space-y-8 pr-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar pb-8 z-10">
            
            {/* Header Title */}
            <div className="border-b border-black/10 pb-6 mb-2">
              <h2
                className="font-serif font-bold text-3xl tracking-tight"
                style={{ color: "#1A1A1A" }}
              >
                Katalog Inventaris Industrial
              </h2>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "rgba(26,26,26,0.6)" }}>
                Komponen kelistrikan presisi tinggi. Harga belum termasuk PPN dan biaya pengiriman laut/darat.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                Merek Principal
              </h3>
              <div className="flex flex-col gap-2">
                {BRANDS.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                        selectedBrand === brand ? 'border-transparent' : 'border-[#001F3F]/20 group-hover:border-[#001F3F]/50'
                      }`}
                      style={{ backgroundColor: selectedBrand === brand ? "var(--gold)" : "transparent" }}
                      onClick={() => setSelectedBrand(brand)}
                    >
                      {selectedBrand === brand && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: "#1A1A1A" }} />
                      )}
                    </div>
                    <span 
                      className={`text-sm transition-colors font-medium`}
                      style={{ color: selectedBrand === brand ? "#1A1A1A" : "rgba(26,26,26,0.6)" }}
                    >
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
                Tipe Komponen
              </h3>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                        selectedCategory === cat ? 'border-transparent' : 'border-[#001F3F]/20 group-hover:border-[#001F3F]/50'
                      }`}
                      style={{ backgroundColor: selectedCategory === cat ? "var(--gold)" : "transparent" }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {selectedCategory === cat && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: "#1A1A1A" }} />
                      )}
                    </div>
                    <span 
                      className={`text-sm transition-colors font-medium`}
                      style={{ color: selectedCategory === cat ? "#1A1A1A" : "rgba(26,26,26,0.6)" }}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            </aside>
          </div>

          {/* Right: Dense E-commerce Grid */}
          <div className="flex-1 w-full relative min-h-[100svh] pb-16 md:pb-24">
            <motion.div
              key={`${selectedBrand}-${selectedCategory}`} // re-render on any filter
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center" style={{ color: "rgba(26,26,26,0.5)" }}>
                  Tidak ada komponen yang sesuai dengan filter Anda.
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
