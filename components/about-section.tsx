"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building2, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MILESTONES = [
  { year: "2009", event: "Pendirian PT Vanguard Energy Amanah" },
  { year: "2013", event: "Ekspansi ke layanan EPC nasional" },
  { year: "2018", event: "Sertifikasi ISO 9001:2015 diraih" },
  { year: "2021", event: "Inisiatif Energi Terbarukan diluncurkan" },
  { year: "2024", event: "Jangkauan 32 provinsi Indonesia" },
];

export function AboutSection() {
  return (
    <section
      id="tentang"
      className="py-20 md:py-32"
      style={{ background: "var(--background)" }}
      aria-label="Tentang PT Vanguard Energy Amanah"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--gold-dark)" }}
            >
              Profil Perusahaan
            </p>
            <h2
              className="font-serif font-bold text-fluid-4xl gold-line mb-4"
              style={{ color: "var(--navy)" }}
            >
              Tentang PT Vanguard Energy Amanah
            </h2>

            <div
              className="mt-8 space-y-5 text-fluid-base leading-relaxed"
              style={{ color: "oklch(0.42 0.02 255)" }}
            >
              <p>
                PT Vanguard Energy Amanah adalah perusahaan energi Indonesia yang
                didirikan dengan visi untuk menjadi mitra strategis terpercaya
                dalam transformasi sektor energi nasional. Dengan pengalaman lebih
                dari 15 tahun, kami telah membuktikan komitmen kami melalui
                ratusan proyek yang berhasil dilaksanakan.
              </p>
              <p>
                Berlandaskan nilai-nilai integritas, profesionalisme, dan
                keberlanjutan, PT VEA memadukan keahlian teknis kelas dunia dengan
                pemahaman mendalam tentang dinamika industri energi Indonesia untuk
                menghadirkan solusi yang tepat sasaran.
              </p>
            </div>

            {/* Value pillars */}
            <div className="mt-8 space-y-3">
              {[
                ["Amanah", "Kepercayaan sebagai fondasi setiap kemitraan"],
                ["Unggul", "Standar operasional yang melampaui ekspektasi industri"],
                ["Inovatif", "Solusi adaptif untuk tantangan energi masa depan"],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "var(--gold-dark)" }}
                    strokeWidth={1.5}
                  />
                  <div>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "var(--navy)" }}
                    >
                      {title}
                      {" — "}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "oklch(0.50 0.02 255)" }}
                    >
                      {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button
                asChild
                variant="outline"
                className="touch-target font-semibold text-sm px-8 hover:-translate-y-0.5 transition-all duration-300"
                style={{
                  borderColor: "var(--navy)",
                  color: "var(--navy)",
                }}
              >
                <Link href="#kontak">Konsultasi Dengan Kami</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right — Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div
              className="rounded-2xl p-8 md:p-10 border"
              style={{
                background: "oklch(0.975 0.005 250)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.22 0.065 255 / 0.1)" }}
                >
                  <Clock
                    className="w-5 h-5"
                    style={{ color: "var(--navy)" }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className="font-serif font-bold text-xl"
                  style={{ color: "var(--navy)" }}
                >
                  Perjalanan Kami
                </h3>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div
                  className="absolute left-5 top-0 bottom-0 w-px"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--gold-light), var(--gold-dark), transparent)",
                  }}
                />

                <div className="space-y-7">
                  {MILESTONES.map((milestone, i) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex items-start gap-5 pl-3"
                    >
                      {/* Dot */}
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 mt-1 border-2 bg-white z-10"
                        style={{ borderColor: "var(--gold)" }}
                      />

                      <div>
                        <span
                          className="text-xs font-bold tracking-widest"
                          style={{ color: "var(--gold-dark)" }}
                        >
                          {milestone.year}
                        </span>
                        <p
                          className="text-sm font-medium mt-0.5 leading-snug"
                          style={{ color: "var(--navy)" }}
                        >
                          {milestone.event}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom stats */}
              <div
                className="mt-10 pt-7 border-t grid grid-cols-2 gap-6"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="text-center">
                  <p
                    className="font-serif font-bold text-3xl"
                    style={{ color: "var(--navy)" }}
                  >
                    15+
                  </p>
                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: "oklch(0.55 0.02 255)" }}
                  >
                    Tahun Beroperasi
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="font-serif font-bold text-3xl"
                    style={{ color: "var(--navy)" }}
                  >
                    200+
                  </p>
                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: "oklch(0.55 0.02 255)" }}
                  >
                    Proyek Selesai
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
