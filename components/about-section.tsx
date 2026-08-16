"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  HeartHandshake,
  Compass,
  Clock,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MILESTONES = [
  {
    year: "2009",
    event: "Pendirian PT Vanguard Energy Amanah di Jakarta",
    detail: "Fokus awal pada penyediaan suku cadang kritis industri migas & energi nasional.",
  },
  {
    year: "2014",
    event: "Kemitraan Principal Manufaktur Global",
    detail: "Kerjasama distribusi resmi Barton Instruments, Fisher Controls, dan Daniel Measurement.",
  },
  {
    year: "2018",
    event: "Sertifikasi ISO 9001:2015 Sistem Manajemen Mutu",
    detail: "Standardisasi penanganan pengadaan instrumen presisi dan audit keselamatan operasional.",
  },
  {
    year: "2022",
    event: "Pengembangan Divisi Engineering & EPC Sizing",
    detail: "Menyediakan layanan rekonsiliasi BOM, valve sizing, dan material compliance NACE MR0175.",
  },
  {
    year: "2026",
    event: "Jangkauan Pasokan Nasional di Seluruh Indonesia",
    detail: "Mendukung lebih dari 200+ proyek hulu migas, kilang petrokimia, dan pembangkit listrik.",
  },
];

const CORE_VALUES = [
  {
    title: "Amanah",
    desc: "Menjalankan setiap mandat pengadaan dengan integritas penuh, kepastian orisinalitas part number, dan transparansi.",
    icon: ShieldCheck,
    tag: "Integritas & Kepercayaan",
  },
  {
    title: "Responsif",
    desc: "Cepat tanggap dalam penerbitan quotation (RFQ), analisis sizing teknis, dan antisipasi jadwal darurat di lapangan.",
    icon: Zap,
    tag: "Kecepatan Layanan",
  },
  {
    title: "Loyal",
    desc: "Setia memberikan pendampingan teknis jangka panjang bagi pemeliharaan aset dan siklus hidup fasilitas energi klien.",
    icon: HeartHandshake,
    tag: "Komitmen Berkelanjutan",
  },
  {
    title: "Kolaboratif",
    desc: "Bekerja sama erat dengan engineer dan procurement manager untuk mencapai solusi pengadaan paling efektif.",
    icon: Compass,
    tag: "Sinergi Teknis",
  },
];

export function AboutSection() {
  return (
    <section
      id="tentang"
      className="py-20 md:py-28 bg-slate-surface/50 relative overflow-hidden"
      aria-label="Profil Korporasi PT Vanguard Energy Amanah"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-dark mb-1">
            Profil Korporasi
          </p>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-navy tracking-tight leading-[1.15]">
            Mitra Strategis Pengadaan Energi dengan Komitmen Mutu dan Keandalan.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-3">
            PT Vanguard Energy Amanah (PT VEA) adalah kontraktor pengadaan instrumen presisi, control valves, dan sistem perpipaan industri yang melayani sektor hulu-hilir Migas, Petrokimia, dan Pembangkit Listrik di Indonesia.
          </p>
        </div>

        {/* Vision & Mission Bento */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Vision Card */}
          <div className="p-7 sm:p-8 rounded-2xl bg-white border border-border/80 shadow-xs hover:border-gold/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center mb-4 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                <Target className="w-5 h-5 text-navy group-hover:text-gold-dark transition-colors" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark block mb-1">
                Visi Perusahaan
              </span>
              <h3 className="font-serif font-bold text-xl text-navy mb-2.5">
                Menjadi Mitra Terpercaya & Terdepan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Menjadi mitra terpercaya, memegang teguh komitmen dan amanah untuk memenuhi kebutuhan pelanggan dalam rangka mencapai pemenuhan target kerja pelanggan secara optimal dan berkelanjutan.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-gold-dark" />
              <span>Berorientasi pada kepuasan jangka panjang mitra</span>
            </div>
          </div>

          {/* Mission Card */}
          <div className="p-7 sm:p-8 rounded-2xl bg-white border border-border/80 shadow-xs hover:border-gold/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center mb-4 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                <Award className="w-5 h-5 text-navy group-hover:text-gold-dark transition-colors" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark block mb-1">
                Misi Perusahaan
              </span>
              <h3 className="font-serif font-bold text-xl text-navy mb-2.5">
                Ketepatan Mutu, Spesifikasi & Waktu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Memberikan produk dan layanan terbaik sesuai spesifikasi teknik yang dipersyaratkan, jaminan orisinalitas part number manufaktur, dan ketepatan waktu penyediaan yang disepakati.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Kepatuhan penuh standar API, ASME & ISO</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: 4 Core Values & Track Record Timeline */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: 4 Core Values */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="font-serif font-bold text-2xl text-navy mb-1.5">
                4 Pilar Nilai Inti Perusahaan
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Prinsip dasar yang menuntun seluruh operasional dan hubungan kemitraan PT VEA.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {CORE_VALUES.map((val) => (
                <div
                  key={val.title}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-border/80 shadow-xs hover:shadow-md hover:border-gold/50 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                        <val.icon className="w-4.5 h-4.5 text-navy group-hover:text-gold-dark transition-colors" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {val.tag}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-navy mb-1.5 group-hover:text-gold-dark transition-colors">
                      {val.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                asChild
                className="bg-navy text-white hover:bg-navy-deep font-bold text-xs uppercase tracking-wider rounded-full px-6 h-11 shadow-sm gap-2"
              >
                <Link href="/#kontak">
                  <span>Konsultasikan Kebutuhan Anda</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Centered Milestone Timeline */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-border/80 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-navy">
                      Rekam Jejak & Dedikasi
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Perjalanan dedikasi PT VEA untuk industri nasional
                    </p>
                  </div>
                </div>

                {/* Mathematically Centered Timeline Track */}
                <div className="space-y-4">
                  {MILESTONES.map((m, i) => {
                    const isLast = i === MILESTONES.length - 1;
                    return (
                      <motion.div
                        key={m.year}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className="flex items-start gap-3.5 group"
                      >
                        {/* Centered Track & Dot */}
                        <div className="flex flex-col items-center shrink-0 self-stretch">
                          <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-gold group-hover:bg-gold group-hover:scale-110 shadow-xs transition-all mt-0.5 z-10 shrink-0" />
                          {!isLast && (
                            <span className="w-[2px] flex-1 bg-gradient-to-b from-gold via-slate-200 to-slate-200 mt-1 min-h-[24px]" />
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 pb-1.5">
                          <div className="flex items-baseline gap-2 flex-wrap sm:flex-nowrap">
                            <span className="font-mono font-bold text-xs text-gold-dark shrink-0">
                              {m.year}
                            </span>
                            <h4 className="font-semibold text-xs sm:text-[13px] text-navy leading-snug">
                              {m.event}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {m.detail}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Metrics Snapshot */}
              <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl">
                <div className="text-center">
                  <p className="font-serif font-bold text-xl sm:text-2xl text-navy">
                    15+ Thn
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    Pengalaman Industri
                  </p>
                </div>
                <div className="text-center border-l border-border">
                  <p className="font-serif font-bold text-xl sm:text-2xl text-gold-dark">
                    ISO 9001
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    Sistem Manajemen Mutu
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
