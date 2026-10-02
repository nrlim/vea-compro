"use client";

import { Award, Clock, FileCheck, ShieldCheck } from "lucide-react";

const STANDARDS = [
  {
    icon: FileCheck,
    title: "MTR 3.1 & Full Traceability",
    desc: "Every product is backed by Mill Test Certificates (EN 10204 3.1), factory test reports, and manufacturer Certificate of Conformance (CoC).",
  },
  {
    icon: Award,
    title: "API, ASME & NACE Codes",
    desc: "Full adherence to API 6D, API 598, ASME B16.34 standards, and NACE MR0175 metallurgic specifications for sour gas environments.",
  },
  {
    icon: Clock,
    title: "On-Time Supply Chain Delivery",
    desc: "Dedicated logistics planning tailored for plant turnarounds (TAR), planned shutdowns, and critical spares with zero operational delay.",
  },
  {
    icon: ShieldCheck,
    title: "Rapid RFQ Turnaround (< 24h SLA)",
    desc: "Formal commercial quotations, valve sizing verification, and OEM part cross-referencing delivered within one business day.",
  },
];

export function AdvantagesSection() {
  return (
    <section
      id="keunggulan"
      className="py-16 md:py-24 bg-navy-deep text-white border-b border-navy-light/20"
      aria-label="Quality Standards and Compliance"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header (No Badge) */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gold-light mb-2">
            Quality Assurance &amp; Technical Compliance
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Uncompromised Quality &amp; Engineering Standards
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            In severe process environments, equipment integrity is critical to personnel safety and asset longevity. We guarantee absolute compliance with international design codes.
          </p>
        </div>

        {/* 4 Columns (No Badges) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STANDARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 sm:p-7 rounded-xs bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xs bg-gold/15 text-gold flex items-center justify-center mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
