"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart-sheet";

const NAV_LINKS = [
  { href: "/#tentang", label: "Tentang Kami" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/#keunggulan", label: "Keunggulan" },
  { href: "/produk", label: "Produk" },
  { href: "/#mitra", label: "Mitra" },
  { href: "/#kontak", label: "Kontak" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav glass-nav-scrolled" : "glass-nav"
        }`}
      >
        <nav className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 group"
            aria-label="PT Vanguard Energy Amanah — Beranda"
          >
            <div className="relative w-9 h-9 md:w-10 md:h-10 overflow-hidden rounded-sm">
              <Image
                src="/vea-logo.png"
                alt="PT VEA Logo"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-serif font-bold text-sm md:text-base tracking-wide"
                style={{ color: "var(--navy)" }}
              >
                PT Vanguard Energy
              </span>
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: "var(--gold-dark)" }}
              >
                Amanah
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links — Center */}
          <ul className="hidden lg:flex items-center gap-1" role="navigation">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 group rounded-md"
                  style={{ color: "var(--navy)" }}
                >
                  <span className="relative z-10 group-hover:opacity-70 transition-opacity">
                    {link.label}
                  </span>
                  <span
                    className="absolute inset-x-4 bottom-1 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"
                    style={{ background: "var(--gold)" }}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* Cart — Right */}
          <div className="hidden lg:flex items-center gap-4">
            {pathname === "/produk" && <CartSheet />}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {pathname === "/produk" && <CartSheet />}
            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-toggle"
              className="touch-target flex items-center justify-center w-11 h-11 rounded-md transition-colors duration-200 hover:bg-black/5"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" style={{ color: "var(--navy)" }} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" style={{ color: "var(--navy)" }} strokeWidth={1.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(320px,90vw)] bg-white shadow-2xl flex flex-col lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu Navigasi"
            >
              {/* Drawer Header */}
              <div
                className="flex items-center justify-between px-6 py-5 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="font-serif font-bold text-lg"
                  style={{ color: "var(--navy)" }}
                >
                  PT VEA
                </span>
                <button
                  className="touch-target flex items-center justify-center w-10 h-10 rounded-md hover:bg-black/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" style={{ color: "var(--navy)" }} strokeWidth={1.5} />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className="flex items-center justify-between w-full px-4 py-3.5 rounded-lg font-medium text-base transition-all duration-200 hover:bg-slate-50 group touch-target"
                        style={{ color: "var(--navy)" }}
                      >
                        <span>{link.label}</span>
                        <ChevronRight
                          className="w-4 h-4 opacity-30 group-hover:opacity-70 group-hover:translate-x-1 transition-all duration-200"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Drawer Bottom Spacing */}
              <div className="px-6 pb-8 pt-4 border-t" style={{ borderColor: "var(--border)" }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
