"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

// Partner/client company names (simplified — logos would be actual images)
const PARTNERS = [
  { 
    name: "Pertamina Group", 
    abbr: "PTM",
    desc: "Suplai instrumen presisi, kalibrasi sistem perpipaan, dan optimalisasi keamanan kilang minyak."
  },
  { 
    name: "PLN Indonesia", 
    abbr: "PLN",
    desc: "Perawatan sistem turbin boiler dan penyediaan panel kontrol untuk gardu induk operasional."
  },
  { 
    name: "Medco Energi", 
    abbr: "MED",
    desc: "Mitra penyedia valve industri, sensor, dan alat ukur untuk fasilitas eksplorasi migas lepas pantai."
  },
  { 
    name: "Adaro Energy", 
    abbr: "ADA",
    desc: "Dukungan mekanik suku cadang vital dan sistem kelistrikan terintegrasi di area tambang."
  },
  { 
    name: "PGN", 
    abbr: "PGN",
    desc: "Instalasi gas detector, valve control, dan maintenance komprehensif jaringan distribusi gas."
  },
  { 
    name: "Elnusa", 
    abbr: "ELN",
    desc: "Penyediaan perangkat keselamatan (HSE) dan instrumen operasional survei seismik."
  },
  { 
    name: "Pupuk Indonesia", 
    abbr: "PPI",
    desc: "Pemasok komponen kontrol temperatur dan pressure gauge untuk stabilitas pabrik pupuk."
  },
];

function PartnerCard({ partner }: { partner: { name: string; abbr: string; desc: string } }) {
  return (
    <div
      className="flex-shrink-0 flex items-start gap-4 mx-4 p-5 rounded-2xl border transition-all duration-300 group hover:shadow-lg hover:-translate-y-1"
      style={{
        borderColor: "var(--border)",
        background: "white",
        width: "340px",
      }}
    >
      {/* Placeholder logo block — premium corporate style */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{
          background: "oklch(0.975 0.005 250)",
          color: "var(--navy)",
          fontFamily: "var(--font-inter)",
          border: "1px solid var(--border)",
        }}
      >
        {partner.abbr}
      </div>
      <div className="flex flex-col gap-1.5">
        <span
          className="text-base font-bold whitespace-nowrap transition-colors duration-300 group-hover:text-[var(--gold-dark)]"
          style={{ color: "var(--navy)" }}
        >
          {partner.name}
        </span>
        <p 
          className="text-sm leading-relaxed" 
          style={{ color: "oklch(0.45 0.02 255)", whiteSpace: "normal" }}
        >
          {partner.desc}
        </p>
      </div>
    </div>
  );
}

export function PartnersSlider() {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseVelocity = -0.6;

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.scrollWidth / 2;
    const current = x.get();
    const newX = current + baseVelocity;

    if (Math.abs(newX) >= containerWidth) {
      x.set(0);
    } else {
      x.set(newX);
    }
  });

  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section
      id="mitra"
      className="py-16 md:py-24 overflow-hidden"
      style={{ background: "var(--background)" }}
      aria-label="Mitra dan Klien PT VEA"
    >
      <div className="container mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--gold-dark)" }}
          >
            Jaringan Kemitraan
          </p>
          <h2
            className="font-serif font-bold text-fluid-3xl gold-line gold-line-center pb-4"
            style={{ color: "var(--navy)" }}
          >
            Dipercaya oleh Pemimpin Industri
          </h2>
          <p
            className="mt-8 text-fluid-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.50 0.02 255)" }}
          >
            Sebagai mitra kontraktor dan penyuplai instrumen pilihan, PT VEA secara konsisten mendukung kelancaran operasional perusahaan-perusahaan energi dan migas terkemuka di Indonesia.
          </p>
        </motion.div>
      </div>

      {/* Gradient fade masks on edges */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--background), transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, var(--background), transparent)",
          }}
        />

        {/* Slider track */}
        <div className="overflow-hidden py-4">
          <motion.div
            ref={containerRef}
            style={{ x }}
            className="flex items-center"
          >
            {doubled.map((partner, i) => (
              <PartnerCard key={`${partner.abbr}-${i}`} partner={partner} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
