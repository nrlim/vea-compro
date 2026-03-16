"use client";

import Image from "next/image";
import { type Product } from "./ProductGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Link as LinkIcon, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[90vw] max-w-5xl p-0 gap-0 overflow-hidden rounded-2xl md:rounded-3xl border shadow-2xl bg-white max-h-[90vh] flex flex-col"
        style={{ borderColor: "rgba(0, 31, 63, 0.1)" }}
        aria-describedby="product-dialog-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription id="product-dialog-description">Detail Spesifikasi teknis dari {product.name}</DialogDescription>
        </DialogHeader>

        {/* This wrapper scrolls the entire content seamlessly on mobile, and flexes row on desktop */}
        <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden w-full">
          {/* Left: Image Panel (Fixed height on mobile, flex-1 on desktop) */}
          <div className="relative w-full md:w-5/12 h-[250px] sm:h-[300px] md:h-auto shrink-0 bg-[#F9F7F2]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover md:object-contain p-6 mix-blend-multiply"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 pointer-events-none" 
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.03) 0%, transparent 40%)" }}
            />
          </div>

          {/* Right: Info Panel (Auto-expand on mobile, scrollable on desktop) */}
          <div className="flex flex-col flex-1 bg-white md:overflow-y-auto p-5 sm:p-6 md:p-8">
            <div className="mb-6 space-y-3 pr-6">
              <span 
                className="inline-block px-3 py-1 rounded bg-[#F9F7F2] text-xs font-semibold tracking-widest uppercase w-fit"
                style={{ color: "#001F3F" }}
              >
                {product.category}
              </span>
              <h2
                className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl leading-tight"
                style={{ color: "#1A1A1A" }}
              >
                {product.name}
              </h2>
            </div>

            <div className="space-y-6">
              <div 
                className="font-medium text-[15px] leading-relaxed pb-6 border-b"
                style={{ color: "#001F3F", borderColor: "#F9F7F2" }}
              >
                {product.summary}
              </div>
              
              <div className="space-y-3 pb-6 md:pb-0">
                <h4 
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "#1A1A1A" }}
                >
                  <FileText className="w-4 h-4 opacity-50" />
                  Detail Spesifikasi
                </h4>
                <p 
                  className="text-[14px] leading-relaxed text-balance"
                  style={{ color: "rgba(26, 26, 26, 0.75)" }}
                >
                  {product.description}
                </p>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-3 mt-auto" style={{ borderColor: "#F9F7F2" }}>
              <Button 
                className="flex-1 rounded-xl h-12 shadow-md hover:shadow-lg transition-all text-sm font-semibold"
                style={{ backgroundColor: "#001F3F", color: "white" }}
                onClick={() => {
                  window.location.href = "/#kontak";
                  onClose();
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Hubungi Tim Ahli
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-12 text-sm font-medium"
                style={{ borderColor: "rgba(0, 31, 63, 0.2)", color: "#001F3F" }}
              >
                <LinkIcon className="w-4 h-4 mr-2 opacity-50" />
                Unduh Brosur
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
