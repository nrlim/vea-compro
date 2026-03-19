import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  company: [
    { label: "Tentang Kami", href: "#tentang" },
    { label: "Kepemimpinan", href: "#tentang" },
    { label: "Karir", href: "#" },
    { label: "Berita & Media", href: "#" },
  ],
  services: [
    { label: "Distribusi Energi", href: "#layanan" },
    { label: "Engineering & EPC", href: "#layanan" },
    { label: "Energi Berkelanjutan", href: "#layanan" },
    { label: "Konsultasi Strategis", href: "#layanan" },
  ],
  legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Kode Etik", href: "#" },
  ],
};

const SOCIALS = [
  { icon: Linkedin, href: "#", label: "LinkedIn PT VEA" },
  { icon: Instagram, href: "#", label: "Instagram PT VEA" },
  { icon: Twitter, href: "#", label: "Twitter PT VEA" },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.14 0.065 258) 0%, oklch(0.10 0.04 253) 100%)",
      }}
      aria-label="Footer PT Vanguard Energy Amanah"
    >
      {/* Decorative top gradient line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--gold), transparent)",
        }}
      />

      <div className="container mx-auto px-6 pt-14 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3 mb-5 group"
              aria-label="PT Vanguard Energy Amanah"
            >
              <div className="relative w-9 h-9 overflow-hidden rounded-sm">
                <Image
                  src="/main-vea-logo.png"
                  alt="PT VEA Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif font-bold text-sm text-white tracking-wide">
                  PT Vanguard Energy
                </span>
                <span
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: "var(--gold)" }}
                >
                  Amanah
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/55 mb-6">
              Solusi energi berkelanjutan dengan integritas dan keunggulan
              operasional untuk masa depan industri Indonesia.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "oklch(1 0 0 / 0.07)",
                    border: "1px solid oklch(1 0 0 / 0.12)",
                  }}
                >
                  <s.icon
                    className="w-4 h-4 text-white/60 hover:text-white transition-colors"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Perusahaan */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Layanan
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak Kami */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--gold)" }}
            >
              Kontak Kami
            </h4>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li>
                <a href="mailto:harpenas@ptvea.com" className="hover:text-white transition-colors duration-200">
                  Email: harpenas@ptvea.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/6281319994160" className="hover:text-white transition-colors duration-200">
                  WA: +62 813-1999-4160
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors duration-200">
                  Telp: (+62) 21 50996969 Ext. 1641
                </span>
              </li>
            </ul>

            {/* BKPM Notice */}
            <div
              className="mt-6 p-3 rounded-lg border"
              style={{
                background: "oklch(1 0 0 / 0.04)",
                borderColor: "oklch(1 0 0 / 0.1)",
              }}
            >
              <p className="text-xs text-white/40 leading-snug">
                Terdaftar dan diawasi oleh BKPM Republik Indonesia
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{ background: "oklch(1 0 0 / 0.08)" }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 text-center sm:text-left">
            Copyright &copy; 2026 PT Vanguard Energy Amanah
          </p>
          <p className="text-xs text-white/30">
            Designed & Built with precision in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
