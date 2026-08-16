"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, FileText, ChevronLeft, ChevronRight, Eye, Check, ArrowUpRight } from "lucide-react";
import { type Product } from "./ProductGrid";
import { ProductDetailModal } from "./ProductDetailModal";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const combinedImages = [product.image, ...(product.images || [])].filter(
    (url) => typeof url === "string" && url.length > 0 && url !== "/product-placeholder.png"
  );
  if (combinedImages.length === 0) combinedImages.push("/product-placeholder.png");
  const images = Array.from(new Set(combinedImages));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setIsAdded(true);
    toast.success(`Ditambahkan ke keranjang: ${product.name}`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="group relative flex flex-col w-full h-full bg-white rounded-xl border border-border/80 shadow-xs hover:shadow-xl hover:border-gold/50 transition-all duration-300 overflow-hidden cursor-pointer flex-1"
        onClick={() => setModalOpen(true)}
        aria-label={`Lihat spesifikasi ${product.name}`}
      >
        {/* Top: Image Canvas with Crisp Engineering Proportions */}
        <div className="relative w-full aspect-[4/3] bg-slate-50 p-5 flex items-center justify-center overflow-hidden shrink-0 border-b border-slate-100 group/image">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImgIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[currentImgIdx] || product.image || "/product-placeholder.png"}
                alt={product.name}
                fill
                unoptimized={(images[currentImgIdx] || product.image)?.startsWith("data:")}
                className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-400"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Quick View Tag on hover */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy text-white text-[10px] font-semibold shadow-xs">
              <Eye className="w-3 h-3 text-gold" />
              <span>Detail Teknis</span>
            </span>
          </div>

          {/* Carousel Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 border border-border shadow-xs flex items-center justify-center text-navy hover:bg-white transition-all opacity-0 group-hover/image:opacity-100"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 border border-border shadow-xs flex items-center justify-center text-navy hover:bg-white transition-all opacity-0 group-hover/image:opacity-100"
                aria-label="Foto selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all ${
                      idx === currentImgIdx ? "w-3 bg-navy" : "w-1 bg-navy/20"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Middle: Technical Details */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gold-dark">
              {product.brand} • {product.category}
            </span>
          </div>

          <h3 className="font-serif font-bold text-base text-navy leading-snug line-clamp-2 mb-2 group-hover:text-gold-dark transition-colors">
            {product.name}
          </h3>

          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>

          {/* Pricing & Commercial Status */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {product.price > 0 ? "Harga Satuan Estimasi" : "Status Pengadaan"}
            </span>
            <span className="font-mono text-base font-bold text-navy">
              {product.price > 0 ? formatRupiah(product.price) : "Hubungi Kami (RFQ)"}
            </span>
          </div>

          {/* Datasheet & Manual PDF Shortcuts */}
          {(product.manualUrl || product.datasheetUrl) && (
            <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
              {product.manualUrl && (
                <a
                  href={product.manualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-navy uppercase tracking-wider border border-border transition-colors"
                >
                  <FileText className="w-3 h-3 text-gold-dark" />
                  <span>Manual</span>
                </a>
              )}
              {product.datasheetUrl && (
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-navy uppercase tracking-wider border border-border transition-colors"
                >
                  <FileText className="w-3 h-3 text-gold-dark" />
                  <span>Datasheet</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom Tactile Action Button */}
        <div className="p-3 pt-0 bg-white">
          <Button
            onClick={handleAddToCart}
            className={`w-full h-10 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 gap-2 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-navy text-white hover:bg-navy-deep shadow-xs"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Berhasil Ditambahkan</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-gold" />
                <span>Tambah ke Keranjang</span>
              </>
            )}
          </Button>
        </div>
      </motion.article>

      {modalOpen && (
        <ProductDetailModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
