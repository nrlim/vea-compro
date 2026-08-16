"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Shield, User } from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";
import { StaffLoginModal } from "@/components/staff-login-modal";

const NAV_LINKS = [
  { href: "/#tentang", label: "Tentang Kami" },
  { href: "/#layanan", label: "Layanan & Solusi" },
  { href: "/#keunggulan", label: "Keunggulan" },
  { href: "/produk", label: "Katalog Produk" },
  { href: "/#brands", label: "Principal Brands" },
  { href: "/#mitra", label: "Mitra Industri" },
  { href: "/#kontak", label: "Konsultasi & RFQ" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const pathname = usePathname();
  const isCatalogPage = pathname === "/produk" || pathname.startsWith("/produk/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-deep/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3"
            : "bg-gradient-to-b from-navy-deep/80 via-navy-deep/40 to-transparent backdrop-blur-[2px] py-4"
        }`}
      >
        {/* Full-width container with clean 1-line content distribution */}
        <nav className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-6">
          
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group focus:outline-none"
            aria-label="PT Vanguard Energy Amanah — Beranda"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-xl p-0.5 border border-white/20 group-hover:border-gold/60 transition-all duration-300 bg-white shadow-md shrink-0">
              <Image
                src="/main-vea-logo.png"
                alt="PT VEA Logo"
                fill
                className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <span className="font-serif font-bold text-sm sm:text-base lg:text-[16px] tracking-tight text-white group-hover:text-gold-light transition-colors whitespace-nowrap">
              PT Vanguard Energy Amanah
            </span>
          </Link>

          {/* Seamless Desktop Nav Links (1-Line Center/Right) */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-7 2xl:gap-8" role="navigation">
            {NAV_LINKS.map((link) => {
              const isProdukActive = link.href === "/produk" && isCatalogPage;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 block whitespace-nowrap ${
                      isProdukActive
                        ? "text-gold font-bold"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${
                        isProdukActive
                          ? "w-full bg-gold shadow-[0_0_8px_rgba(200,160,80,0.8)]"
                          : "w-0 hover:w-full bg-white/60"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Utilities (Clean & Compact) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Portal Staff Popup Trigger: rendered on catalog pages */}
            {isCatalogPage && (
              <button
                type="button"
                onClick={() => setStaffModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 border border-white/15 transition-colors cursor-pointer"
                aria-label="Buka Portal Staff"
              >
                <Shield className="w-3.5 h-3.5 text-gold" />
                <span>Portal Staff</span>
              </button>
            )}

            <CartSheet />
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="lg:hidden flex items-center gap-2.5">
            <CartSheet />
            <button
              id="mobile-menu-toggle"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors focus:outline-none"
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
                    <X className="w-4 h-4 text-white" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-4 h-4 text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Staff Login Modal Component */}
      <StaffLoginModal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-navy-deep/80 backdrop-blur-md lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(340px,88vw)] bg-navy-deep border-l border-white/10 shadow-2xl flex flex-col lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu Navigasi"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 overflow-hidden rounded-lg border border-white/20 bg-white">
                    <Image
                      src="/main-vea-logo.png"
                      alt="PT VEA Logo"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <span className="font-serif font-bold text-sm text-white">
                    PT Vanguard Energy
                  </span>
                </div>
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-1.5">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.25 }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium text-sm text-white/80 hover:bg-white/5 hover:text-gold transition-colors group"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {isCatalogPage && (
                  <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setStaffModalOpen(true);
                      }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-white/15 text-white hover:bg-white/5 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <span>Portal Internal Staff</span>
                      <User className="w-4 h-4 text-gold" />
                    </button>
                  </div>
                )}
              </nav>

              <div className="px-6 py-4 border-t border-white/10 bg-navy/40">
                <p className="text-[11px] text-white/40 text-center font-medium">
                  PT Vanguard Energy Amanah &copy; {new Date().getFullYear()}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
