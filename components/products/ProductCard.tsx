"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingCart, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { type Product } from "./ProductGrid";
import { ProductDetailModal } from "./ProductDetailModal";
import { useCart } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function ProductCard({ product }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const { addItem } = useCart();
  
  const combinedImages = [product.image, ...(product.images || [])].filter(
    (url) => typeof url === "string" && url.length > 0 && url !== "/product-placeholder.png"
  );
  if (combinedImages.length === 0) combinedImages.push("/product-placeholder.png");
  const images = Array.from(new Set(combinedImages));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal from opening
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
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
        variants={itemVariants}
        className="group relative flex flex-col w-full h-full cursor-pointer transition-all duration-500 overflow-hidden border border-[#001F3F]/10 hover:border-[#001F3F]/30"
        style={{ backgroundColor: "white" }}
        onClick={() => setModalOpen(true)}
        aria-label={`Lihat detail produk: ${product.name}`}
      >
        {/* Top: Image Section on stark white background for contrast */}
        <div 
          className="relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center p-6 bg-white shrink-0 group/image"
          onClick={(e) => {
            // Because outer div has onClick, this handles the click to modal 
            // but we'll prevent default on the arrows
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImgIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[currentImgIdx] || product.image || "/product-placeholder.png"}
                alt={product.name}
                fill
                unoptimized={(images[currentImgIdx] || product.image)?.startsWith("data:") || Math.random() < 2}
                className="object-contain mix-blend-multiply transition-transform duration-700 ease-[0.16_1_0.3_1] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-black/10 shadow-sm flex items-center justify-center text-black/60 hover:text-[#001F3F] hover:bg-white opacity-80 md:opacity-0 md:group-hover/image:opacity-100 transition-all z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-black/10 shadow-sm flex items-center justify-center text-black/60 hover:text-[#001F3F] hover:bg-white opacity-80 md:opacity-0 md:group-hover/image:opacity-100 transition-all z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImgIdx ? "bg-navy w-3" : "bg-navy/30"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Middle: Content Section */}
        <div className="flex flex-col flex-1 p-5 md:p-6">
          <div className="flex flex-col gap-1.5 mb-2">
            <span 
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "var(--gold)" }}
            >
              {product.brand} • {product.category}
            </span>
            <h3 
              className="font-serif text-lg md:text-xl leading-tight line-clamp-2 transition-colors"
              style={{ color: "#1A1A1A" }}
            >
              {product.name}
            </h3>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-1">
            <span className="font-mono text-xl font-bold tracking-tight" style={{ color: "#1A1A1A" }}>
              {product.price > 0 ? formatRupiah(product.price) : "Hubungi Kami"}
            </span>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(26,26,26,0.4)" }}>
              {product.price > 0 ? "Excluding Sales Tax | Shipping Policy" : "Product Inquiry"}
            </span>
          </div>

          {/* Document Links */}
          {(product.manualUrl || product.datasheetUrl) && (
            <div className="flex gap-2 mt-5" onClick={(e) => e.stopPropagation()}>
              {product.manualUrl && (
                <a
                  href={product.manualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex text-center py-2.5 px-3 rounded-lg bg-[#001F3F]/5 hover:bg-[#001F3F]/10 text-[10px] font-bold text-[#001F3F] uppercase tracking-wider transition-colors items-center justify-center gap-1.5 border border-[#001F3F]/10"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Manual Book
                </a>
              )}
              {product.datasheetUrl && (
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex text-center py-2.5 px-3 rounded-lg bg-[#001F3F]/5 hover:bg-[#001F3F]/10 text-[10px] font-bold text-[#001F3F] uppercase tracking-wider transition-colors items-center justify-center gap-1.5 border border-[#001F3F]/10"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Datasheet
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA Full Width */}
        <Button
          onClick={handleAddToCart}
          className="w-full rounded-none h-14 border-t font-bold uppercase tracking-widest text-xs transition-colors duration-300 hover:opacity-90"
          style={{ backgroundColor: "var(--navy)", color: "var(--gold)", borderColor: "rgba(0, 31, 63, 0.1)" }}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
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
