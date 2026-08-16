"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { Mitra } from "@/app/actions/mitra";
import { Building2, ExternalLink, ShieldCheck } from "lucide-react";

function PartnerCard({ mitra }: { mitra: Mitra }) {
  const content = (
    <div className="flex-shrink-0 flex items-center gap-4 mx-3 px-5 py-3.5 rounded-2xl bg-white border border-border/80 shadow-xs hover:shadow-lg hover:border-gold/60 transition-all duration-300 group cursor-pointer w-[280px] h-[86px]">
      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-100 group-hover:border-gold/30 transition-colors">
        {mitra.logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={mitra.logoUrl}
            alt={mitra.name}
            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <Building2 className="w-6 h-6 text-slate-400 group-hover:text-gold transition-colors" />
        )}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-xs font-bold text-navy truncate group-hover:text-gold-dark transition-colors">
          {mitra.name}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-gold-dark shrink-0" />
          <span>Mitra Korporat</span>
        </span>
      </div>
      {mitra.websiteUrl && (
        <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-gold-dark transition-colors shrink-0" />
      )}
    </div>
  );

  if (mitra.websiteUrl) {
    return (
      <a
        href={mitra.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none"
      >
        {content}
      </a>
    );
  }

  return content;
}

export function PartnersSlider({ mitras }: { mitras: Mitra[] }) {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const baseVelocity = -0.5;

  useAnimationFrame(() => {
    if (isPaused || !containerRef.current || !mitras || mitras.length === 0) return;
    const containerWidth = containerRef.current.scrollWidth / 2;
    const current = x.get();
    const newX = current + baseVelocity;

    if (Math.abs(newX) >= containerWidth) {
      x.set(0);
    } else {
      x.set(newX);
    }
  });

  // Duplicate the array enough times to ensure seamless infinite scrolling
  const minItemsForScroll = 8;
  let list = [...(mitras || [])];
  if (list.length > 0) {
    while (list.length < minItemsForScroll) {
      list = [...list, ...(mitras || [])];
    }
    list = [...list, ...list];
  }

  return (
    <section
      id="mitra"
      className="py-16 md:py-20 bg-slate-surface/60 border-y border-border/70 overflow-hidden"
      aria-label="Jaringan Kemitraan PT VEA"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-dark mb-1">
              Jaringan Industri & Kemitraan
            </p>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-navy">
              Dipercaya oleh Sektor Energi Nasional
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Mendukung kelancaran supply chain instrumen dan valves bagi operator migas serta kontraktor EPC terkemuka di Indonesia.
          </p>
        </div>
      </div>

      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft edge fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 z-10 pointer-events-none bg-gradient-to-r from-slate-surface via-slate-surface/80 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 z-10 pointer-events-none bg-gradient-to-l from-slate-surface via-slate-surface/80 to-transparent" />

        <div className="overflow-hidden py-2">
          {!mitras || mitras.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-xs">Belum ada mitra yang ditambahkan.</p>
            </div>
          ) : (
            <motion.div ref={containerRef} style={{ x }} className="flex items-center">
              {list.map((mitra, i) => (
                <PartnerCard key={`${mitra.id}-${i}`} mitra={mitra} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
