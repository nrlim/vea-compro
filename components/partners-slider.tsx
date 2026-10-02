"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { Mitra } from "@/app/actions/mitra";

function PartnerItem({ mitra }: { mitra: Mitra }) {
  const content = (
    <div className="flex-shrink-0 flex items-center justify-center px-10 sm:px-14 py-4 h-24 sm:h-28 group cursor-pointer transition-all">
      {mitra.logoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={mitra.logoUrl}
          alt={mitra.name}
          className="h-11 sm:h-14 w-auto max-w-[180px] sm:max-w-[220px] object-contain opacity-70 grayscale contrast-125 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
        />
      ) : (
        <span className="text-sm sm:text-base font-bold text-slate-500 whitespace-nowrap group-hover:text-navy transition-colors">
          {mitra.name}
        </span>
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
  const baseVelocity = -0.4;

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
      className="py-12 bg-slate-50/80 border-b border-slate-200/80 overflow-hidden"
      aria-label="Trusted Clients and Partners"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl mb-6 text-center">
        <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Trusted by Leading EPC Contractors &amp; National Energy Operators
        </p>
      </div>

      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="overflow-hidden">
          {!mitras || mitras.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-xs">No partner records currently published.</p>
            </div>
          ) : (
            <motion.div ref={containerRef} style={{ x }} className="flex items-center">
              {list.map((mitra, idx) => (
                <PartnerItem key={`${mitra.id}-${idx}`} mitra={mitra} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
