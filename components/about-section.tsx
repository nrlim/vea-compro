"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

const VALUES = [
  {
    title: "Amanah (Integrity & Trust)",
    desc: "Unwavering commitment to genuine OEM part numbers, authentic mill test certificates, and contractual reliability.",
  },
  {
    title: "Responsive Execution",
    desc: "Rapid commercial proposal generation and technical readiness for emergency equipment replacements in the field.",
  },
  {
    title: "Long-Term Reliability",
    desc: "Supporting the complete operational lifecycle of client energy assets through dependable ongoing spare parts supply.",
  },
  {
    title: "Collaborative Engineering",
    desc: "Partnering closely with client project engineers for valve sizing verification, material compatibility, and BOM review.",
  },
];

export function AboutSection() {
  return (
    <section
      id="tentang"
      className="py-16 md:py-24 bg-white border-b border-slate-200/80"
      aria-label="About PT Vanguard Energy Amanah"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Corporate Narrative (6 cols) */}
          <div className="lg:col-span-6">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gold-dark mb-2">
              About PT Vanguard Energy Amanah
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-navy mb-6">
              Strategic Procurement &amp; Engineering Partner for the Energy Sector
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-8">
              <p>
                Headquartered in Jakarta, PT Vanguard Energy Amanah serves as a premier distributor and engineering supplier of precision instrumentation, severe service valves, and high-pressure piping systems across Indonesia&apos;s oil &amp; gas, petrochemical, and power generation sectors.
              </p>
              <p>
                Guided by the principle of <strong>Amanah</strong> (trust and accountability), we ensure every component is backed by authentic manufacturer test reports (MTR 3.1), strict compliance with API and ASME codes, and reliable delivery schedules that keep operations running smoothly.
              </p>
            </div>

            {/* 4 Core Pillars Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {VALUES.map((val) => (
                <div
                  key={val.title}
                  className="p-4 sm:p-5 rounded-xs bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  <h3 className="font-bold text-sm text-navy mb-1.5">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Facility Showcase & Certification (6 cols) */}
          <div className="lg:col-span-6">
            <div className="rounded-xs border border-slate-200/90 bg-white overflow-hidden shadow-sm">
              <div className="relative w-full h-72 sm:h-96 bg-slate-100">
                <Image
                  src="/images/about-facility.png"
                  alt="Industrial Engineering Facility & Testing"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/20 to-transparent" />
                
                {/* Floating Trust Metrics */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-1">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>ISO 9001:2015 Certified System</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    Quality Controlled &amp; Verified Supply Chain
                  </div>
                </div>
              </div>

              {/* Bottom Callout Banner */}
              <div className="p-6 bg-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-white">Need Project Procurement Support?</div>
                  <div className="text-xs text-slate-300 mt-0.5">Connect directly with our engineering sales team.</div>
                </div>
                <Link
                  href="/#kontak"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xs bg-gold text-navy hover:bg-[#d4ba90] text-xs font-semibold transition-colors shrink-0"
                >
                  <span>Contact Our Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
