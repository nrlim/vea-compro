import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
      className={`${sans.variable} ${mono.variable} scroll-smooth`}
    >
      <body className="antialiased font-sans bg-background text-foreground selection:bg-gold/20 selection:text-navy">
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
