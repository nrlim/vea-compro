"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
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
  const { addItem } = useCart();

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
          className="relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center p-6 bg-white"
        >
          <motion.div
            className="relative w-full h-full"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-[0.16_1_0.3_1]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
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
              {formatRupiah(product.price)}
            </span>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(26,26,26,0.4)" }}>
              Excluding Sales Tax | Shipping Policy
            </span>
          </div>
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
