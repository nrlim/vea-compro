"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="beranda"
      className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-32 md:pt-36 md:pb-40"
      aria-label="Beranda PT Vanguard Energy Amanah"
    >
      {/* Background Image: High-Tech Facility at Twilight */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-energy.png"
          alt="Fasilitas Instrumentasi dan Pipa Industri PT Vanguard Energy Amanah"
          fill
          priority
          className="object-cover object-center brightness-60 contrast-110"
          sizes="100vw"
        />
        {/* Layered deep navy & obsidian gradient for high readability & seamless navbar merge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4, 10, 22, 0.85) 0%, rgba(7, 19, 38, 0.70) 45%, rgba(4, 10, 22, 0.95) 100%)",
          }}
        />
        {/* Ambient warm golden glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(197, 168, 128, 0.35) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif font-bold text-white text-3xl sm:text-5xl md:text-6xl lg:text-[62px] leading-[1.12] tracking-tight mb-6 max-w-4xl text-balance"
          >
            Presisi Rekayasa Instrumen &{" "}
            <span className="text-gradient-gold">Valves Kritis</span> untuk Sektor Energi Indonesia.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-slate-300/90 leading-relaxed max-w-2xl mb-10 font-normal"
          >
            Mitra pengadaan strategis untuk Barton Chart Recorders, Fisher Control Valves, Daniel Flow Meters, dan High-Pressure Piping berstandar API & ASME.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/produk"
              className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full font-bold text-xs uppercase tracking-wider bg-gold hover:bg-[#d8be96] text-navy hover:text-navy transition-all duration-300 shadow-xl shadow-gold/20 flex items-center justify-center gap-3 group"
            >
              <span>Eksplorasi Katalog Produk</span>
              <span className="w-7 h-7 rounded-full bg-navy/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-navy" />
              </span>
            </Link>

            <Link
              href="/#kontak"
              className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full font-semibold text-xs uppercase tracking-wider text-white hover:text-navy bg-white/10 hover:bg-white border border-white/25 hover:border-white backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2.5 group shadow-sm"
            >
              <span>Permintaan Penawaran (RFQ)</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:text-navy transition-colors" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Trust Metrics Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-4 md:bottom-8 left-0 right-0 z-20 px-4 sm:px-6"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-navy-deep/80 backdrop-blur-xl shadow-2xl overflow-hidden p-4 sm:p-5">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {[
                { value: "15+", label: "Tahun Pengalaman", desc: "Keandalan Industri Migas" },
                { value: "200+", label: "Proyek Nasional", desc: "Mitra EPC & Pengadaan" },
                { value: "100%", label: "Orisinal & Teruji", desc: "Standar API, ASME, ISO" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center text-center px-2 sm:px-4 group"
                >
                  <span className="font-serif font-bold text-xl sm:text-3xl md:text-4xl text-white group-hover:text-gold transition-colors duration-300">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold-light/90 mt-0.5">
                    {stat.label}
                  </span>
                  <span className="hidden md:inline-block text-[11px] text-white/50 font-medium mt-0.5">
                    {stat.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
