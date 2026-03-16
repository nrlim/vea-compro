"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      id="beranda"
      className="relative w-full h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden"
      aria-label="Halaman Utama PT Vanguard Energy Amanah"
    >
      {/* Background Image & Cinematic Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-energy.png"
          alt="Infrastruktur energi PT VEA"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        {/* Deep Navy to Almost Black Gradient Overlay for perfect text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(170deg, rgba(13, 31, 60, 0.85) 0%, rgba(5, 12, 25, 0.95) 100%)",
          }}
        />
        
        {/* Subtle glowing radial accent behind text */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(200, 160, 80, 0.15) 0%, transparent 60%)"
          }}
        />
      </div>

      {/* Main Content (Centered layout is foolproof for responsiveness) */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-12 md:mt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center w-full"
        >
          {/* Top ISO Badge (Glassmorphism) */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl"
              style={{ background: "rgba(255, 255, 255, 0.08)" }}
            >
              <Award
                className="w-4 h-4"
                style={{ color: "var(--gold)" }}
                strokeWidth={2}
              />
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">
                Bersertifikasi ISO 9001:2015
              </span>
            </div>
          </motion.div>

          {/* Headline - using text-balance to perfectly wrap text */}
          <motion.h1
            variants={itemVariants}
            className="font-serif font-bold leading-[1.15] text-white text-[clamp(2.5rem,6vw,5.5rem)] mb-6 tracking-tight text-balance"
          >
            Solusi Energi <span style={{ color: "var(--gold)" }}>Terpercaya</span>{" "}
            untuk Masa Depan Industri.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={itemVariants}
            className="text-fluid-lg leading-relaxed text-white/70 mb-10 max-w-2xl text-balance"
          >
            PT Vanguard Energy Amanah berkomitmen menyediakan layanan energi
            berkelanjutan dengan integritas teknis dan keunggulan operasional
            sebagai mitra strategis Anda.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto touch-target font-bold text-sm px-8 hover:-translate-y-1 transition-all duration-400 group border-none"
              style={{
                background: "linear-gradient(135deg, var(--gold-dark), var(--gold))",
                color: "var(--navy)",
                boxShadow: "0 10px 30px -10px rgba(200, 160, 80, 0.5)",
              }}
            >
              <Link href="#kontak">
                Konsultasi Sekarang
                <ArrowRight
                  className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto touch-target font-semibold text-sm px-8 hover:-translate-y-1 transition-all duration-400 text-white hover:bg-white/10"
              style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(4px)"
              }}
            >
              <Link href="#tentang">Buku Profil Perusahaan</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Glass Stats Grid (Docked at bottom on Desktop, inline on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
        className="absolute bottom-6 md:bottom-12 left-0 right-0 z-20 w-full px-6"
      >
        <div className="container mx-auto max-w-5xl">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl"
            style={{ background: "rgba(13, 31, 60, 0.45)" }}
          >
            {[
              { value: "15+", label: "Tahun Pengalaman" },
              { value: "200+", label: "Proyek Nasional" },
              { value: "50+", label: "Mitra Korporat" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center group">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-white mb-1 group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/50 group-hover:text-white/80 transition-colors duration-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
