"use client";

import Image from "next/image";
import { type Product } from "./ProductGrid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FileText,
  Link as LinkIcon,
  Phone,
  X,
  ShieldCheck,
  Zap,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/*
       * ── Layout contract ──────────────────────────────────────────────────
       *
       * The golden rule for "scrollable content + pinned bar" layouts:
       * EVERY ancestor in the chain must have a FIXED (not auto) height.
       *
       * Mobile (< md):
       *   DialogContent [flex-col, h-[92dvh]]
       *     ├─ Image Panel   [h-[200px], shrink-0]
       *     └─ Right Panel   [flex-col, flex-1, min-h-0]
       *          ├─ Scroll   [flex-1, min-h-0, overflow-y-auto]
       *          └─ Bar      [shrink-0]
       *
       * Desktop (≥ md):
       *   DialogContent [flex-row (via inner), h-[85dvh]]
       *     ├─ Image Panel   [w-[42%], self-stretch]   ← fills full sidebar height
       *     └─ Right Panel   [flex-col, flex-1, min-h-0, min-w-0]
       *          ├─ Scroll   [flex-1, min-h-0, overflow-y-auto]
       *          └─ Bar      [shrink-0]
       *
       * Key: md:h-auto is REMOVED — it broke the flex height chain on desktop.
       * ────────────────────────────────────────────────────────────────────
       */}
      <DialogContent
        showCloseButton={false}
        className={[
          // Positioning
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          // Width — responsive scaling with a sensible max
          "w-[92vw] md:w-[88vw] lg:w-[82vw] max-w-5xl",
          // *** CRITICAL: always a fixed height — never h-auto ***
          // dvh accounts for mobile browser chrome (address bar, etc.)
          "h-[92dvh] md:h-[85dvh]",
          // Reset Shadcn defaults that conflict with our layout
          "p-0 gap-0",
          // Container is a flex column; inner div switches to row on md+
          "flex flex-col",
          // Visual
          "overflow-hidden rounded-2xl md:rounded-[2rem] border-0 shadow-2xl bg-white",
          "focus:outline-none",
        ].join(" ")}
        aria-describedby="product-dialog-description"
      >
        {/* Screen-reader accessible title */}
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription id="product-dialog-description">
            Detail spesifikasi teknis dari {product.name}
          </DialogDescription>
        </DialogHeader>

        {/* Close button — absolute over entire modal */}
        <DialogClose className="absolute top-3 right-3 z-50 rounded-full p-2 bg-white/80 backdrop-blur-md shadow-md border border-neutral-200 text-neutral-500 hover:text-[#001F3F] hover:bg-white transition-all focus:outline-none">
          <X className="w-4 h-4" />
          <span className="sr-only">Tutup</span>
        </DialogClose>

        {/* ── Main inner wrapper ───────────────────────────────────────────
            Mobile  → flex-col  (image on top, content below)
            Desktop → flex-row  (image sidebar on left, content on right)
        ─────────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 w-full">

          {/* ╔══════════════════════════════════════════╗
              ║  IMAGE PANEL                             ║
              ║  Mobile:  fixed 200px height, full width ║
              ║  Desktop: 42% width, full sidebar height ║
              ╚══════════════════════════════════════════╝ */}
          <div
            className={[
              "relative flex items-center justify-center overflow-hidden bg-[#F2F4F8]",
              // Mobile — fixed height, doesn't shrink
              "h-[200px] shrink-0",
              // Desktop — sidebar: 42% wide, stretches to full modal height
              "md:h-auto md:self-stretch md:w-[42%] md:shrink-0",
            ].join(" ")}
          >
            {/* Dot grid background */}
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, #001F3F 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            {/* Top & bottom gradient vignette */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/[0.04] to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/[0.04] to-transparent pointer-events-none" />

            {/* Industrial corner marks */}
            <div className="absolute top-4 left-4 w-5 h-5 md:w-7 md:h-7 border-t-[2.5px] border-l-[2.5px] border-[#001F3F]/12" />
            <div className="absolute bottom-4 right-4 w-5 h-5 md:w-7 md:h-7 border-b-[2.5px] border-r-[2.5px] border-[#001F3F]/12" />

            {/* Product image — centered, 70% of the panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-[70%] h-[70%]"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized={product.image?.startsWith("data:")}
                className="object-contain mix-blend-multiply drop-shadow-2xl"
                sizes="(max-width: 768px) 70vw, 35vw"
                priority
              />
            </motion.div>

            {/* VEA watermark */}
            <div className="absolute bottom-3 left-4 select-none pointer-events-none opacity-[0.04]">
              <span className="font-serif font-black text-5xl md:text-7xl tracking-tighter text-[#001F3F]">
                VEA
              </span>
            </div>
          </div>

          {/* ╔═══════════════════════════════════════════════════════╗
              ║  CONTENT PANEL                                        ║
              ║  flex-col + flex-1 + min-h-0 + min-w-0               ║
              ║  ├─ Scroll area  [flex-1 min-h-0 overflow-y-auto]    ║
              ║  └─ Action bar   [shrink-0]                           ║
              ╚═══════════════════════════════════════════════════════╝ */}
          <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-white relative">

            {/* ── Scrollable region ──────────────────────────────── */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-7 sm:py-7 md:px-10 md:py-9">

              {/* ── Header: badges · name · price ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="flex flex-col gap-3 mb-6 md:mb-8"
              >
                {/* Brand & category badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#001F3F]/5 text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#001F3F] border border-[#001F3F]/10 rounded-sm">
                    {product.brand}
                  </span>
                  <span className="px-2.5 py-1 bg-[#B8860B]/10 text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#8B6508] border border-[#B8860B]/20 rounded-sm">
                    {product.category}
                  </span>
                </div>

                {/* Product name */}
                <h2 className="font-serif font-bold leading-[1.1] tracking-tight text-[#1A1A1A] text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex flex-col gap-0.5 pt-3 border-t border-neutral-100">
                  <span className="font-mono font-bold tracking-tighter text-[#1A1A1A] text-2xl sm:text-3xl md:text-[2.5rem]">
                    {product.price > 0
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(product.price)
                      : "Hubungi Kami"}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">
                    {product.price > 0
                      ? "Excluding Sales Tax | Shipping Policy"
                      : "Product Inquiry / Negotiation"}
                  </p>
                </div>
              </motion.div>

              {/* ── Body: summary · specs · feature cards ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.22 }}
                className="space-y-5 md:space-y-6"
              >
                {/* Summary highlight */}
                <div className="p-4 md:p-5 rounded-xl bg-[#001F3F]/[0.02] border border-[#001F3F]/5">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
                    <p className="text-sm md:text-[15px] font-medium leading-relaxed text-[#1A1A1A]/80">
                      {product.summary}
                    </p>
                  </div>
                </div>

                {/* Technical specifications */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] border-b pb-2.5 border-neutral-100">
                    <FileText className="w-3.5 h-3.5 text-[#001F3F]/60" />
                    Spesifikasi Teknis
                  </h4>
                  <p className="text-sm md:text-[15px] leading-loose text-[#1A1A1A]/70 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                {/* Feature badge cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] md:text-[12px] font-bold tracking-wide uppercase text-[#1A1A1A]">
                        Garansi Resmi
                      </h5>
                      <p className="text-[10px] text-[#1A1A1A]/60 mt-1 leading-relaxed tracking-wide">
                        Dukungan teknis &amp; layanan manufaktur principal.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                    <div className="p-2 rounded-lg bg-[#001F3F]/10 text-[#001F3F] shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] md:text-[12px] font-bold tracking-wide uppercase text-[#1A1A1A]">
                        Premium
                      </h5>
                      <p className="text-[10px] text-[#1A1A1A]/60 mt-1 leading-relaxed tracking-wide">
                        Kualitas terjamin standar PT Vanguard Energy Amanah.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Sticky Action Bar ─────────────────────────────────
                shrink-0  →  never compressed, always anchored to bottom.
                Sits OUTSIDE the scroll div.
            ──────────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.32 }}
              className="shrink-0 px-5 py-4 sm:px-7 sm:py-5 md:px-10 md:py-6 bg-white border-t border-[#001F3F]/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                {/* Primary CTA */}
                <Button
                  className="flex-1 rounded-full h-[60px] md:h-[64px] shadow-xl shadow-[#001F3F]/20 hover:shadow-2xl hover:shadow-[#001F3F]/30 hover:-translate-y-0.5 transition-all duration-300 text-[14px] md:text-[15px] font-bold tracking-[0.1em] uppercase"
                  style={{ backgroundColor: "#001F3F", color: "var(--gold)" }}
                  onClick={() => {
                    window.location.href = "/#kontak";
                    onClose();
                  }}
                >
                  <Phone className="w-5 h-5 mr-3 shrink-0" />
                  Hubungi Tim Ahli
                </Button>

                {/* Secondary CTA */}
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none sm:px-8 md:px-10 rounded-full h-[60px] md:h-[64px] text-[13px] md:text-[14px] font-bold uppercase tracking-[0.1em] border-2 border-[#001F3F]/25 hover:border-[#001F3F]/50 hover:bg-[#001F3F]/5 transition-all text-[#001F3F] hover:text-[#001F3F]"
                >
                  <LinkIcon className="w-5 h-5 mr-2.5 shrink-0" />
                  Unduh Brosur
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
