"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  ShieldCheck,
  Pipette,
  Layers,
  Wrench,
  Truck,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    icon: Gauge,
    title: "Pemasok Instrumen Presisi",
    category: "Measurement & Control",
    description:
      "Distribusi alat ukur tekanan, laju aliran (flow), temperatur, dan level fluida berakurasi tinggi termasuk Barton Chart Recorders, Pressure Gauges, dan Transmitters.",
    highlights: ["Barton Recorders", "Pressure & Temp Transmitters", "Flow Meters"],
  },
  {
    icon: ShieldCheck,
    title: "Suplai Valves & Actuators",
    category: "Fluid Control",
    description:
      "Pengadaan Control Valves, Emergency Shut Down (ESD), Ball Valves, Check Valves, dan Safety Relief Valves dengan standar API 6D, API 598, dan ASME.",
    highlights: ["Fisher Controls", "Daniel Metering", "Safety Relief Valves"],
  },
  {
    icon: Pipette,
    title: "Sistem Perpipaan & Tubing",
    category: "Piping & Fittings",
    description:
      "Penyediaan Seamless Stainless Steel Tubing, High Pressure Fittings, Needle Valves, dan Manifolds untuk sistem instrumentasi bertekanan tinggi tanpa kebocoran.",
    highlights: ["SS 316/316L Seamless", "Double Ferrule Fittings", "Instrument Manifolds"],
  },
  {
    icon: Layers,
    title: "Kontraktor Pengadaan EPC",
    category: "Turnkey Procurement",
    description:
      "Mitra pengadaan menyeluruh untuk proyek Engineering, Procurement, and Construction (EPC), menjamin kelengkapan bill of materials (BOM) sesuai target operasional.",
    highlights: ["BOM Reconciliation", "MTR & Certificates", "Vendor Consolidation"],
  },
  {
    icon: Wrench,
    title: "Konsultasi & Rekayasa Teknis",
    category: "Technical Advisory",
    description:
      "Pendampingan spesifikasi teknis dari para ahli untuk merekomendasikan sizing valve, pemilihan material kompatibel (NACE MR0175), serta instrumentasi yang tepat.",
    highlights: ["Valve Sizing Support", "Material Compatibility", "Datasheet Review"],
  },
  {
    icon: Truck,
    title: "Logistik Cepat & Tepat Waktu",
    category: "Supply Chain",
    description:
      "Manajemen rantai pasok dan pergudangan andal untuk memastikan pengiriman tepat waktu ke lokasi operasi onshore maupun offshore di seluruh wilayah Nusantara.",
    highlights: ["Jadwal Ketat Terpantau", "Onshore & Offshore Ready", "Proteksi Kemasan Ekspor"],
  },
];

export function ServicesSection() {
  return (
    <section
      id="layanan"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
      aria-label="Layanan & Solusi PT Vanguard Energy Amanah"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-dark mb-3">
              Solusi & Portofolio Pengadaan
            </p>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-navy tracking-tight">
              Keahlian Pengadaan Komprehensif Sektor Energi
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-3">
              Kombinasi produk instrumentasi presisi dan dedikasi waktu penyediaan untuk memastikan efisiensi dan keselamatan instalasi migas Anda.
            </p>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy hover:text-gold-dark transition-colors group shrink-0"
          >
            <span>Jelajahi Semua Layanan & Katalog</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="card-hover-lift group relative bg-white rounded-2xl p-7 border border-border/80 flex flex-col justify-between overflow-hidden shadow-xs"
            >
              {/* Hairline Brass Accent on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Header with Icon & Category Badge */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-navy group-hover:border-navy transition-all duration-300">
                    <service.icon className="w-6 h-6 text-navy group-hover:text-gold transition-colors duration-300" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-gold/10 group-hover:text-gold-dark transition-colors">
                    {service.category}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-serif font-bold text-xl text-navy mb-3 group-hover:text-gold-dark transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              {/* Technical Highlights Chips */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {service.highlights.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
