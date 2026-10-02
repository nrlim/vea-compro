"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden px-0 py-24 sm:py-28 bg-navy-deep text-white"
      aria-label="PT Vanguard Energy Amanah Hero"
    >
      {/* Background Image with Cinematic Industrial Depth */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-energy.png"
          alt="PT Vanguard Energy Amanah Energy Facility"
          fill
          priority
          className="object-cover object-center brightness-75 contrast-110"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(10, 25, 47, 0.48) 0%, rgba(4, 10, 22, 0.78) 100%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center">
        {/* Subtle Clean Kicker (No Pill Badge) */}
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-gold-light uppercase mb-3 sm:mb-4">
          PT Vanguard Energy Amanah &bull; Jakarta, Indonesia
        </p>

        {/* Confident, High-Impact Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-4 sm:mb-5">
          Precision Instrumentation, Severe Service Valves &amp; Fabrication
        </h1>

        {/* Clear, Concise English Value Proposition */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8">
          Trusted procurement and engineering partner providing Barton chart recorders, Fisher automated control valves, and seamless piping systems certified to API &amp; ASME standards.
        </p>

        {/* Seamless Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 sm:mb-10">
          <Link
            href="/produk"
            className="w-full sm:w-auto h-12 px-7 rounded-sm font-semibold text-sm bg-gold hover:bg-[#d4ba90] text-navy transition-colors flex items-center justify-center gap-2 shadow-xs group"
          >
            <span>Explore Product Catalog</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <Link
            href="/#kontak"
            className="w-full sm:w-auto h-12 px-7 rounded-sm font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/25 transition-colors flex items-center justify-center gap-2"
          >
            <span>Request for Quotation (RFQ)</span>
            <ArrowRight className="w-4 h-4 text-slate-300" />
          </Link>
        </div>

        {/* Integrated Trust & Reliability Strip */}
        <div className="pt-5 sm:pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 sm:gap-6 text-left max-w-4xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">15+ Years</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Energy Industry Track Record</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">200+ Projects</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">EPC &amp; Facility Operators</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">API &amp; ASME</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Certified Mill Test Reports (MTR)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">ISO 9001</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Certified Quality System</div>
          </div>
        </div>
      </div>
    </section>
  );
}
