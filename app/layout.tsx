import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A192F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ptvea.com"),
  title: {
    default: "PT Vanguard Energy Amanah — Solusi Energi, Instrumen & Valves Indonesia",
    template: "%s | PT Vanguard Energy Amanah",
  },
  description:
    "PT Vanguard Energy Amanah (PT VEA) adalah kontraktor pengadaan instrumen presisi, valves industri, dan layanan EPC terpercaya untuk sektor Oil & Gas dan Power Plants di Indonesia.",
  keywords: [
    "PT Vanguard Energy Amanah",
    "PT VEA",
    "Distributor Valves Indonesia",
    "Instrumen Oil and Gas",
    "Barton Recorder",
    "Fisher Valves",
    "Daniel Flow",
    "Kontraktor EPC Energi",
    "Pengadaan Industri Migas",
    "Solusi Energi Terpercaya",
  ],
  authors: [{ name: "PT Vanguard Energy Amanah", url: "https://ptvea.com" }],
  creator: "PT Vanguard Energy Amanah",
  publisher: "PT Vanguard Energy Amanah",
  openGraph: {
    title: "PT Vanguard Energy Amanah — Solusi Energi, Instrumen & Valves Indonesia",
    description:
      "Mitra strategis terpercaya pengadaan instrumen presisi dan valves industri dengan komitmen mutu dan ketepatan waktu operasional.",
    url: "https://ptvea.com",
    siteName: "PT Vanguard Energy Amanah",
    images: [
      {
        url: "/main-vea-logo.png",
        width: 1200,
        height: 630,
        alt: "PT Vanguard Energy Amanah — Solusi Instrumen & Valves Terpercaya",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Vanguard Energy Amanah — Solusi Instrumen & Valves Terpercaya",
    description:
      "Mitra strategis terpercaya pengadaan instrumen presisi dan valves industri di Indonesia.",
    images: ["/main-vea-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${sans.variable} ${serif.variable} scroll-smooth`}
    >
      <body className="antialiased font-sans bg-background text-foreground selection:bg-gold/20 selection:text-navy">
        {children}
        <Toaster richColors position="top-center" closeButton />
        {/* Midtrans Snap.js Client SDK */}
        <Script
          src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ?? "https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
