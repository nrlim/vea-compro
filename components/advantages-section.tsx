"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Target, Zap, Clock, ThumbsUp } from "lucide-react";

const ADVANTAGES = [
  {
    icon: Award,
    stat: "100%",
    label: "Amanah & Keandalan",
    title: "Integritas Tanpa Kompromi",
    desc: "Beroperasi dengan memprioritaskan kejujuran teknis, keterbukaan status pengadaan, dan kepatuhan penuh pada standar keselamatan industri.",
  },
  {
    icon: Target,
    stat: "Zero Fault",
    label: "Akurasi Spesifikasi",
    title: "Presisi Standar Internasional",
    desc: "Seluruh produk diverifikasi ketat terhadap standar API, ANSI, DIN, dan ASME sebelum diserahkan ke fasilitas pelanggan.",
  },
  {
    icon: Clock,
    stat: "On-Schedule",
    label: "Ketepatan Jadwal",
    title: "Komitmen Waktu Pengadaan",
    desc: "Rantai pasok terstruktur menjamin material tiba tepat waktu untuk menghindari risiko shutdown atau downtime proyek yang merugikan.",
  },
  {
    icon: ThumbsUp,
    stat: "Kemitraan",
    label: "Sinergi Jangka Panjang",
    title: "Mitra Solusi Berkelanjutan",
    desc: "Bukan sekadar vendor transaksional, melainkan penasihat teknis yang proaktif mendukung efisiensi jangka panjang pemeliharaan aset Anda.",
  },
];

export function AdvantagesSection() {
  return (
    <section
      id="keunggulan"
      className="py-24 md:py-32 relative overflow-hidden bg-navy-gradient text-white"
      aria-label="Keunggulan PT Vanguard Energy Amanah"
    >
      {/* Subtle radial gold glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-gold-light text-[11px] font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
            <span>Nilai Unggul & Komitmen</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            Mengapa Memilih PT Vanguard Energy Amanah?
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl mx-auto">
            Fondasi keunggulan kami didasari pada komitmen pemenuhan target kerja pelanggan dengan menjunjung tinggi amanah, kecepatan respon, dan ketepatan spesifikasi.
          </p>
        </div>

        {/* 4-Card Luxury Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((adv, i) => (
            <motion.div
              key={adv.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl p-7 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-gold/40 transition-all duration-400 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Icon & Stat */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <adv.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-white group-hover:text-gold transition-colors">
                    {adv.stat}
                  </span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-gold-light mb-1">
                  {adv.label}
                </p>
                <h3 className="font-serif font-bold text-lg text-white mb-2.5 leading-snug">
                  {adv.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {adv.desc}
                </p>
              </div>

              {/* Bottom Subtle Bar */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-[10px] uppercase font-semibold text-white/40 tracking-wider">
                  Standar Keandalan PT VEA
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
