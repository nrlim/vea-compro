import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PT Vanguard Energy Amanah — Solusi Energi Terpercaya Indonesia",
  description:
    "PT Vanguard Energy Amanah (PT VEA) berkomitmen menyediakan layanan energi berkelanjutan dengan integritas dan keunggulan operasional untuk masa depan industri Indonesia.",
  keywords: [
    "PT Vanguard Energy Amanah",
    "PT VEA",
    "energi Indonesia",
    "solusi energi",
    "minyak dan gas",
    "energi berkelanjutan",
  ],
  authors: [{ name: "PT Vanguard Energy Amanah" }],
  openGraph: {
    title: "PT Vanguard Energy Amanah — Solusi Energi Terpercaya Indonesia",
    description:
      "PT VEA (Vanguard Energy Amanah) berkomitmen menyediakan layanan energi berkelanjutan dengan integritas dan keunggulan operasional.",
    url: "https://ptvea.com",
    siteName: "PT Vanguard Energy Amanah",
    images: [
      {
        url: "/vea-logo.png",
        width: 1200,
        height: 630,
        alt: "Logo PT Vanguard Energy Amanah",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Vanguard Energy Amanah — Solusi Energi Terpercaya Indonesia",
    description:
      "PT VEA berkomitmen menyediakan layanan energi berkelanjutan dengan integritas dan keunggulan operasional.",
    images: ["/vea-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
