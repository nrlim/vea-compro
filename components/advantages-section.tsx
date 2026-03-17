"use client";

import { motion } from "framer-motion";
import { Award, Users, Target, TrendingUp } from "lucide-react";

const ADVANTAGES = [
  {
    icon: Award,
    stat: "Teruji",
    label: "Amanah & Keandalan",
    description:
      "Beroperasi dengan menjunjung tinggi integritas untuk memastikan kelancaran operasional setiap proyek klien kami.",
  },
  {
    icon: Target,
    stat: "100%",
    label: "Sesuai Spesifikasi",
    description:
      "Komitmen penuh memberikan produk berkualitas tinggi yang sangat persis dengan spesifikasi standar industri Anda.",
  },
  {
    icon: TrendingUp,
    stat: "On-Time",
    label: "Ketepatan Waktu",
    description:
      "Manajemen logistik dan suplai yang responsif menepati tenggat waktu penyediaan sesuai jadwal proyek Anda.",
  },
  {
    icon: Users,
    stat: "Sinergi",
    label: "Mitra Kolaboratif",
    description:
      "Bukan sekedar vendor, melainkan tenaga loyal dan kolaboratif bagi kesuksesan jangka panjang industri nasional.",
  },
];

export function AdvantagesSection() {
  return (
    <section
      id="keunggulan"
      className="py-20 md:py-32 relative overflow-hidden"
      aria-label="Keunggulan PT Vanguard Energy Amanah"
    >
      {/* Dark navy background */}
      <div className="absolute inset-0 bg-navy-gradient" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--gold), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--gold), transparent 70%)",
          }}
        />
        {/* Grid pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-dark"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dark)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--gold)" }}
          >
            Nilai Inti (Core Values)
          </p>
          <h2
            className="font-serif font-bold text-fluid-4xl text-white gold-line gold-line-center mb-4"
          >
            Mengapa Bermitra dengan PT VEA?
          </h2>
          <p className="mt-8 text-fluid-base leading-relaxed text-white/70">
            Nilai-nilai fundamental—Amanah, Responsif, Loyal, dan Kolaboratif—adalah janji kami untuk hadir bukan hanya sebagai penyuplai produk, namun sebagai faktor krusial yang mendukung pemenuhan target kerja pelanggan.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: i * 0.12,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-2xl p-7 border transition-all duration-400 hover:-translate-y-1"
              style={{
                background: "oklch(1 0 0 / 0.05)",
                borderColor: "oklch(1 0 0 / 0.12)",
              }}
            >
              {/* Hover background */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: "oklch(1 0 0 / 0.04)",
                }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "oklch(0.78 0.16 80 / 0.15)",
                  border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                }}
              >
                <item.icon
                  className="w-5 h-5"
                  style={{ color: "var(--gold)" }}
                  strokeWidth={1.5}
                />
              </div>

              {/* Stat */}
              <div className="mb-1">
                <span className="font-serif font-bold text-3xl text-white">
                  {item.stat}
                </span>
              </div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: "var(--gold)" }}
              >
                {item.label}
              </p>
              <p className="text-sm leading-relaxed text-white/60">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
