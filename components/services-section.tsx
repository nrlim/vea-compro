"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const CAPABILITIES = [
  {
    image: "/images/capability-instruments.png",
    alt: "Precision Instrumentation and Flow Measurement",
    title: "Precision Instrumentation & Flow Measurement",
    summary:
      "High-accuracy differential pressure transmitters, Barton chart recorders, and process analyzers engineered for custody transfer and critical facility monitoring.",
    highlights: [
      "Barton Chart Recorders (Model 202E / 199 DPU)",
      "Pressure, Temperature & Level Transmitters",
      "Factory Calibration & Inspection Certification",
    ],
    actionHref: "/produk?kategori=instruments",
    actionLabel: "View Instrumentation Catalog",
  },
  {
    image: "/images/capability-valves.png",
    alt: "Severe Service and Industrial Control Valves",
    title: "Industrial & Severe Service Valves",
    summary:
      "Supply and distribution of automated control valves, emergency shutdown (ESD) valves, ball, gate, and globe valves for extreme pressure and high-temperature service.",
    highlights: [
      "Fisher Automated Control Valves & Actuators",
      "API 6D, API 598 & ASME B16.34 Compliance",
      "Sour Gas & H2S Resistant Alloys (NACE MR0175)",
    ],
    actionHref: "/produk?kategori=valves",
    actionLabel: "View Valves Catalog",
  },
  {
    image: "/images/capability-piping.png",
    alt: "High-Pressure Piping and Seamless Tubing Systems",
    title: "High-Pressure Piping & Tubing Systems",
    summary:
      "Cold-drawn precision instrumentation tubing, double-ferrule compression fittings, and multi-valve manifolds delivering zero-leakage performance under extreme pressure.",
    highlights: [
      "Seamless SS 316 / 316L Instrumentation Tubing",
      "Double Ferrule Compression Tube Fittings",
      "Leak-Free High Pressure Instrument Manifolds",
    ],
    actionHref: "/produk?kategori=piping",
    actionLabel: "View Piping Catalog",
  },
  {
    image: "/images/capability-fabrication.png",
    alt: "Skid Fabrication and Valve Automation Engineering",
    title: "Engineering, Skid Fabrication & Sizing",
    summary:
      "Complete engineering services including valve sizing calculations, pneumatic/electric actuator automation mounting, modular skid assembly, and hydrostatic testing.",
    highlights: [
      "Valve Cv Sizing & Engineering Data Sheet Review",
      "Actuation Automation & Control Skid Assembly",
      "Hydrostatic Pressure Testing & MTR 3.1 Traceability",
    ],
    actionHref: "/#kontak",
    actionLabel: "Request Technical Consultation",
  },
];

export function ServicesSection() {
  return (
    <section
      id="layanan"
      className="py-16 md:py-24 bg-white border-b border-slate-200/80"
      aria-label="Core Capabilities and Solutions"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header (No Badge, Clean Text Hierarchy) */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gold-dark mb-2">
            Core Engineering &amp; Procurement Solutions
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-navy mb-4">
            End-to-End Solutions for Critical Flow &amp; Process Facilities
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            From precision measurement and severe-service valves to custom fabrication, we ensure every component delivers uncompromised reliability across your operations.
          </p>
        </div>

        {/* 4 Visual Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CAPABILITIES.map((item) => (
            <div
              key={item.title}
              className="rounded-xs border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative w-full h-48 sm:h-56 bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold-dark transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {item.summary}
                  </p>

                  <ul className="space-y-2.5 mb-2">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-slate-100">
                <Link
                  href={item.actionHref}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-navy hover:text-gold-dark transition-colors group/link"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 text-gold-dark" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
