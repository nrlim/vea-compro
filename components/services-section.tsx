"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Settings,
  Leaf,
  BarChart3,
  ShieldCheck,
  Globe,
} from "lucide-react";

const SERVICES = [
  {
    icon: Settings,
    title: "Pemasok Instrumen Presisi",
    description:
      "Penyediaan alat ukur tekanan, aliran, dan level berakurasi tinggi seperti Barton Recorder dan Gauges.",
  },
  {
    icon: ShieldCheck,
    title: "Suplai Valves Industri",
    description:
      "Pengadaan Shut Down, Safety, dan Control Valves kelas dunia (Fisher, Daniel) untuk keamanan operasional.",
  },
  {
    icon: BarChart3,
    title: "Solusi Perpipaan Terintegrasi",
    description:
      "Distribusi Tubing Seamless dan Fittings berkualitas tinggi untuk menahan tekanan ekstrim tanpa bocor.",
  },
  {
    icon: Globe,
    title: "Pengadaan & Kontraktor",
    description:
      "Berperan sebagai mitra kontraktor pengadaan yang memastikan kesesuaian spesifikasi teknik Oil & Gas.",
  },
  {
    icon: Zap,
    title: "Konsultasi Teknis & Produk",
    description:
      "Pendampingan ahli dalam merekomendasikan instrumen yang paling relevan dengan standar proyek Anda.",
  },
  {
    icon: Leaf,
    title: "Dukungan & Logistik Tepat Waktu",
    description:
      "Komitmen tinggi pada waktu penyediaan yang disepakati untuk menjamin kelancaran jadwal proyek pelanggan.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function ServicesSection() {
  return (
    <section
      id="layanan"
      className="py-20 md:py-32"
      style={{ background: "oklch(0.975 0.005 250)" }}
      aria-label="Layanan PT Vanguard Energy Amanah"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-16 md:mb-20"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--gold-dark)" }}
          >
            Fokus Layanan
          </p>
          <h2
            className="font-serif font-bold text-fluid-4xl gold-line mb-4"
            style={{ color: "var(--navy)" }}
          >
            Solusi Pengadaan Industrial
          </h2>
          <p
            className="mt-8 text-fluid-base leading-relaxed"
            style={{ color: "oklch(0.45 0.02 255)" }}
          >
            Sebagai penyedia kebutuhan sektor Oil & Gas terpercaya, PT VEA mendistribusikan produk instrumentasi canggih dengan memprioritaskan ketepatan spesifikasi produk dan efisiensi waktu pemenuhan target Anda.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service, i) => (
            <motion.article
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="card-hover group relative bg-white rounded-2xl p-7 md:p-8 border overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Top gold accent */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold-dark), var(--gold-light))",
                }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "oklch(0.96 0.015 255)",
                }}
              >
                <service.icon
                  className="w-5 h-5 transition-colors duration-300"
                  style={{ color: "var(--navy)" }}
                  strokeWidth={1.5}
                />
              </div>

              <h3
                className="font-serif font-bold text-lg mb-3"
                style={{ color: "var(--navy)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.50 0.02 255)" }}
              >
                {service.description}
              </p>

              {/* Hover arrow */}
              <div
                className="mt-5 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                style={{ color: "var(--gold-dark)" }}
              >
                Pelajari Lebih Lanjut
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
