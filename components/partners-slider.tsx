"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

// Partner/client company names (simplified — logos would be actual images)
const PARTNERS = [
  { name: "Pertamina", abbr: "PTM" },
  { name: "PLN Indonesia", abbr: "PLN" },
  { name: "Medco Energi", abbr: "MED" },
  { name: "Elnusa", abbr: "ELN" },
  { name: "Adaro Energy", abbr: "ADA" },
  { name: "Harum Energy", abbr: "HAR" },
  { name: "Indo Tambangraya", abbr: "ITM" },
  { name: "Bukit Asam", abbr: "PTB" },
  { name: "PGN", abbr: "PGN" },
  { name: "Citra Marga", abbr: "CIT" },
];

function PartnerCard({ partner }: { partner: { name: string; abbr: string } }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center gap-3 mx-6 py-3 px-6 rounded-xl border transition-all duration-300 group"
      style={{
        borderColor: "var(--border)",
        background: "white",
        minWidth: "180px",
      }}
    >
      {/* Placeholder logo block — greyscale corporate style */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all duration-300 group-hover:opacity-80"
        style={{
          background: "oklch(0.92 0 0)",
          color: "oklch(0.45 0 0)",
          fontFamily: "var(--font-inter)",
        }}
      >
        {partner.abbr}
      </div>
      <span
        className="text-sm font-semibold whitespace-nowrap transition-colors duration-300 group-hover:opacity-70"
        style={{ color: "oklch(0.45 0 0)" }}
      >
        {partner.name}
      </span>
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
