"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { Mitra } from "@/app/actions/mitra";

function PartnerCard({ mitra }: { mitra: Mitra }) {
  const content = (
    <div
      className="flex-shrink-0 flex items-center gap-4 mx-4 p-5 rounded-2xl border transition-all duration-300 group hover:shadow-lg hover:-translate-y-1"
      style={{
        borderColor: "var(--border)",
        background: "white",
        width: "280px",
        height: "100px",
      }}
    >
      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mitra.logoUrl} alt={mitra.name} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="flex flex-col gap-1.5 overflow-hidden">
        <span
          className="text-base font-bold truncate transition-colors duration-300 group-hover:text-[var(--gold-dark)]"
          style={{ color: "var(--navy)" }}
        >
          {mitra.name}
        </span>
      </div>
    </div>
  );

  if (mitra.websiteUrl) {
    return (
      <a href={mitra.websiteUrl} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
        {content}
      </a>
    );
  }

  return content;
}

export function PartnersSlider({ mitras }: { mitras: Mitra[] }) {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseVelocity = -0.6;

  useAnimationFrame(() => {
    if (!containerRef.current || mitras.length === 0) return;
    const containerWidth = containerRef.current.scrollWidth / 2;
    const current = x.get();
    const newX = current + baseVelocity;

    if (Math.abs(newX) >= containerWidth) {
      x.set(0);
    } else {
      x.set(newX);
    }
  });

  // Duplicate the array enough times to ensure seamless scrolling
  const minItemsForScroll = 10;
  let doubled = [...(mitras || [])];
  if (doubled.length > 0) {
    while (doubled.length < minItemsForScroll) {
      doubled = [...doubled, ...(mitras || [])];
    }
    doubled = [...doubled, ...doubled];
  }

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

        <div className="overflow-hidden py-4">
          {(!mitras || mitras.length === 0) ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">Belum ada mitra yang ditambahkan.</p>
            </div>
          ) : (
            <motion.div
              ref={containerRef}
              style={{ x }}
              className="flex items-center"
            >
              {doubled.map((mitra, i) => (
                <PartnerCard key={`${mitra.id}-${i}`} mitra={mitra} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
