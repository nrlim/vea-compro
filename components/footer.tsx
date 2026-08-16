import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

const FOOTER_LINKS = {
  navigasi: [
    { label: "Tentang Kami", href: "/#tentang" },
    { label: "Layanan & Solusi", href: "/#layanan" },
    { label: "Keunggulan", href: "/#keunggulan" },
    { label: "Katalog Produk", href: "/produk" },
    { label: "Principal Brands", href: "/#brands" },
    { label: "Mitra Industri", href: "/#mitra" },
  ],
  kategori: [
    { label: "Instruments & Measurement", href: "/produk" },
    { label: "Valves & Actuators", href: "/produk" },
    { label: "Piping & Tubing Fittings", href: "/produk" },
    { label: "EPC Turnkey Procurement", href: "/#layanan" },
    { label: "Konsultasi Teknis", href: "/#kontak" },
  ],
  legalitas: [
    { label: "ISO 9001:2015 Mutu", href: "#" },
    { label: "Terdaftar Resmi BKPM", href: "#" },
    { label: "Kebijakan Privasi Data", href: "#" },
    { label: "Syarat & Ketentuan Pengadaan", href: "#" },
  ],
};

const SOCIALS = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn PT Vanguard Energy Amanah" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram PT Vanguard Energy Amanah" },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-navy-gradient text-white border-t border-white/10"
      aria-label="Footer PT Vanguard Energy Amanah"
    >
      {/* Decorative top brass line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-16 pb-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Brand & Corporate Summary (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-3.5 mb-5 group focus:outline-none"
              aria-label="PT Vanguard Energy Amanah"
            >
              <div className="relative w-10 h-10 overflow-hidden rounded-lg p-0.5 bg-white border border-white/20 shadow-xs">
                <Image
                  src="/main-vea-logo.png"
                  alt="PT VEA Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-bold text-base text-white tracking-tight">
                  PT Vanguard Energy
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold mt-0.5">
                  Amanah
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-white/65 leading-relaxed mb-6 font-normal">
              Penyedia instrumen presisi, valves industri, dan kontraktor EPC terpercaya untuk sektor Oil & Gas, Petrokimia, dan Power Generation di Indonesia dengan komitmen mutu dan ketepatan waktu.
            </p>

            {/* Socials & ISO Badge */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/40 hover:bg-white/10 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gold-light">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>ISO 9001:2015</span>
              </div>
            </div>
          </div>

          {/* Quick Nav (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.navigasi.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories (2 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">
              Kategori Pengadaan
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.kategori.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">
              Kantor Pusat & Kontak
            </h4>
            <ul className="space-y-3 text-xs text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Jl. Jenderal Sudirman, Senayan, Kebayoran Baru, Jakarta Selatan 12190</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:harpenas@ptvea.com" className="hover:text-white transition-colors">
                  harpenas@ptvea.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="https://wa.me/6281319994160" className="hover:text-white transition-colors">
                  +62 813-1999-4160
                </a>
              </li>
            </ul>

            {/* BKPM Notice */}
            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[11px] text-white/50 leading-relaxed">
                Terdaftar resmi dan beroperasi di bawah pengawasan BKPM Republik Indonesia.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/45 text-center sm:text-left">
            &copy; {new Date().getFullYear()} PT Vanguard Energy Amanah. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>High-End Industrial Grade</span>
            <span>•</span>
            <Link href="/internal-admin/login" className="hover:text-white transition-colors">
              Internal Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
