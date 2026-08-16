"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product } from "./ProductGrid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText,
  Phone,
  X,
  ShieldCheck,
  Award,
  ShoppingCart,
  Check,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/lib/store/cart";
import { toast } from "sonner";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  if (!product) return null;

  const combinedImages = [product.image, ...(product.images || [])].filter(
    (url) => typeof url === "string" && url.length > 0 && url !== "/product-placeholder.png"
  );
  if (combinedImages.length === 0) combinedImages.push("/product-placeholder.png");
  const images = Array.from(new Set(combinedImages));

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddToCart = () => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] md:w-[88vw] lg:w-[80vw] max-w-5xl h-[90dvh] md:h-[82dvh] p-0 gap-0 flex flex-col overflow-hidden rounded-xl md:rounded-2xl border border-border shadow-2xl bg-white focus:outline-none z-50"
        aria-describedby="product-dialog-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription id="product-dialog-description">
            Detail spesifikasi teknik dari {product.name}
          </DialogDescription>
        </DialogHeader>

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/95 border border-border shadow-sm flex items-center justify-center text-slate-500 hover:text-navy hover:bg-white transition-colors"
          aria-label="Tutup detail produk"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Body: Flex Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Left Gallery Panel */}
          <div className="w-full md:w-[45%] h-[240px] md:h-full bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border shrink-0">
            {/* Main Featured Photo */}
            <div className="relative flex-1 w-full min-h-[160px] flex items-center justify-center">
              <Image
                src={images[currentImgIdx] || product.image || "/product-placeholder.png"}
                alt={product.name}
                fill
                unoptimized={(images[currentImgIdx] || product.image)?.startsWith("data:")}
                className="object-contain mix-blend-multiply transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-3 shrink-0">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIdx(idx)}
                    className={`relative w-12 h-12 rounded-lg border overflow-hidden shrink-0 transition-all bg-white ${
                      idx === currentImgIdx
                        ? "border-navy ring-2 ring-navy/20 shadow-xs"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Info & Specs Panel */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-white">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-gold/10 text-gold-dark border border-gold/20">
                    {product.brand}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-navy/5 text-navy border border-navy/10">
                    {product.category}
                  </span>
                </div>

                <h2 className="font-serif font-bold text-xl sm:text-2xl text-navy leading-tight">
                  {product.name}
                </h2>
              </div>

              {/* Price & Commercial Terms */}
              <div className="p-4 rounded-xl bg-slate-50 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {product.price > 0 ? "Estimasi Harga Satuan" : "Status Penawaran"}
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-navy">
                    {product.price > 0 ? formatRupiah(product.price) : "Hubungi Kami (RFQ)"}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  *Excluding PPN & Freight Charges
                </span>
              </div>

              {/* Technical Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                  Deskripsi & Spesifikasi Produk
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {product.description}
                </div>
              </div>

              {/* Verified Features */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { icon: ShieldCheck, title: "Original Warranty", desc: "Sertifikat Manufaktur" },
                  { icon: Award, title: "Standar Industri", desc: "API / ANSI / ASME" },
                ].map((f) => (
                  <div key={f.title} className="p-3 rounded-lg border border-border bg-white flex items-center gap-3">
                    <f.icon className="w-5 h-5 text-gold-dark shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-navy">{f.title}</p>
                      <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Downloadable Documents */}
              {(product.manualUrl || product.datasheetUrl) && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                    Dokumen Teknis
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {product.manualUrl && (
                      <a
                        href={product.manualUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-bold text-navy border border-border transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gold-dark" />
                        <span>Manual Book (PDF)</span>
                      </a>
                    )}
                    {product.datasheetUrl && (
                      <a
                        href={product.datasheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-bold text-navy border border-border transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gold-dark" />
                        <span>Datasheet (PDF)</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pinned Bottom Actions Bar */}
            <div className="p-4 sm:p-5 border-t border-border bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-10 rounded-lg text-xs font-bold uppercase tracking-wider text-navy border-border hover:bg-white"
                >
                  <a
                    href={`https://wa.me/6281319994160?text=${encodeURIComponent(
                      `Halo PT VEA, saya ingin menanyakan ketersediaan dan penawaran untuk produk: ${product.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Tanya via WA
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="ghost"
                  className="hidden sm:inline-flex h-10 rounded-lg text-xs font-semibold text-slate-600 hover:text-navy"
                >
                  <Link href={`/produk/${product.id}`}>
                    <span>Halaman Detail</span>
                    <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                  </Link>
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className={`w-full sm:w-auto h-10 px-6 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 gap-2 ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-navy text-white hover:bg-navy-deep shadow-xs"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ditambahkan ke Keranjang</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-gold" />
                    <span>Tambah ke Keranjang</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
