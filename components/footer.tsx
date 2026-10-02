import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

const FOOTER_LINKS = {
  navigation: [
    { label: "Products Catalog", href: "/produk" },
    { label: "Core Capabilities", href: "/#layanan" },
    { label: "Authorized Brands", href: "/#brands" },
    { label: "Quality & Standards", href: "/#keunggulan" },
    { label: "About PT VEA", href: "/#tentang" },
    { label: "Request for Quotation", href: "/#kontak" },
  ],
  categories: [
    { label: "Flow Measurement & Recorders", href: "/produk?kategori=instruments" },
    { label: "Automated Control & ESD Valves", href: "/produk?kategori=valves" },
    { label: "Seamless SS Tubing & Fittings", href: "/produk?kategori=piping" },
    { label: "Valve Sizing & Skid Assembly", href: "/#layanan" },
    { label: "Hydrotest & MTR Verification", href: "/#keunggulan" },
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
              <div className="relative w-10 h-10 overflow-hidden rounded-xs p-0.5 bg-white border border-white/20 shadow-xs">
                <Image
                  src="/main-vea-logo.png"
                  alt="PT VEA Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-sans font-bold text-base text-white tracking-tight">
                  PT Vanguard Energy
                </span>
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-gold mt-0.5">
                  Amanah
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-white/65 leading-relaxed mb-6 font-normal">
              Premier supplier of precision instrumentation, severe service valves, and high-pressure piping systems engineered for oil &amp; gas, petrochemical, and power generation facilities across Indonesia.
            </p>

            {/* Socials & ISO Note (No Badge) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/40 hover:bg-white/10 transition-colors"
                  >
                    <s.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gold-light font-medium">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>ISO 9001:2015 Certified</span>
              </div>
            </div>
          </div>

          {/* Quick Nav (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.navigation.map((link) => (
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

          {/* Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">
              Procurement Scopes
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.categories.map((link) => (
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

          {/* Contact & Location (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">
              Headquarters &amp; Contact
            </h4>
            <ul className="space-y-3 text-xs text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Sudirman Central Business District (SCBD), Kebayoran Baru, South Jakarta 12190, Indonesia</span>
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

            <div className="mt-5 p-3 rounded-xs bg-white/5 border border-white/10">
              <p className="text-[11px] text-white/50 leading-relaxed">
                Registered and fully compliant enterprise under Indonesian Ministry of Investment (BKPM).
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
            <span>ISO 9001:2015 Certified System</span>
            <span>&bull;</span>
            <Link href="/internal-admin/login" className="hover:text-white transition-colors">
              Internal Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
