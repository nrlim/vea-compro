import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/app/actions/settings";
import { FALLBACK_DATA, type FallbackProduct } from "@/lib/fallback-data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Award,
  FileText,
  FileCheck,
  Phone,
  ShoppingCart,
  Check,
  ArrowLeft,
  ArrowRight,
  Share2,
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProductData(id: string) {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (dbProduct) {
      return {
        id: dbProduct.id,
        name: dbProduct.name,
        category: dbProduct.category,
        brand: "PT VEA",
        image: dbProduct.imageUrl || (dbProduct as any).images?.[0] || "/product-placeholder.png",
        images: (dbProduct as any).images || [],
        manualUrl: (dbProduct as any).manualUrl || null,
        datasheetUrl: (dbProduct as any).datasheetUrl || null,
        summary: dbProduct.description,
        description: dbProduct.description,
        price: (dbProduct as any).price ? Number((dbProduct as any).price) : 0,
      };
    }
  } catch (error) {
    // Database fallback
  }

  const fallback = FALLBACK_DATA.products.find((p) => p.id === id);
  if (fallback) return fallback;

  return null;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductData(id);

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  return {
    title: `${product.name} — Spesifikasi Teknik`,
    description: product.summary || product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductData(id);
  const settingsResult = await getAppSettings();
  const settings = settingsResult.data || FALLBACK_DATA.settings;

  if (!product) {
    notFound();
  }

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const combinedImages = [product.image, ...(product.images || [])].filter(
    (url) => typeof url === "string" && url.length > 0 && url !== "/product-placeholder.png"
  );
  if (combinedImages.length === 0) combinedImages.push("/product-placeholder.png");
  const images = Array.from(new Set(combinedImages));
  const shouldSkipOptimizer = (src: string) => src.startsWith("data:") || src.startsWith("/uploads/");

  const relatedProducts = FALLBACK_DATA.products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-24">
        
        {/* Top Dark Hero Breadcrumb Banner */}
        <div className="relative bg-navy-deep text-white pt-28 pb-12 md:pt-36 md:pb-16 border-b border-white/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-energy.png"
              alt="Background Header PT VEA"
              fill
              priority
              className="object-cover object-center brightness-40 contrast-110"
              sizes="100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(4, 10, 22, 0.90) 0%, rgba(7, 19, 38, 0.80) 50%, rgba(4, 10, 22, 0.98) 100%)",
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Link href="/" className="hover:text-gold transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/produk" className="hover:text-gold transition-colors">
                Katalog Produk
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gold font-medium truncate max-w-xs">{product.name}</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-light">
                  {product.brand} • {product.category}
                </span>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-white mt-1">
                  {product.name}
                </h1>
              </div>

              <Link
                href="/produk"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-colors self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Katalog</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Product Workspace */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Gallery Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square w-full bg-white rounded-xl border border-border/80 p-8 flex items-center justify-center shadow-xs overflow-hidden">
                <Image
                  src={images[0]}
                  alt={product.name}
                  fill
                  unoptimized={shouldSkipOptimizer(images[0])}
                  className="object-contain p-6 mix-blend-multiply"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg border border-border bg-white p-2 overflow-hidden shadow-xs"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        unoptimized={shouldSkipOptimizer(imgUrl)}
                        className="object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Technical Specs & Commercial Procurement (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pricing & Commercial Terms Card */}
              <div className="p-6 rounded-xl bg-white border border-border/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    {product.price > 0 ? "Harga Satuan Estimasi Resmi" : "Status Penawaran Proyek"}
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-navy">
                    {product.price > 0 ? formatRupiah(product.price) : "Hubungi Kami (RFQ)"}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    *Excluding PPN & Freight Charges ke fasilitas lokasi kerja Anda.
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={`https://wa.me/6281319994160?text=${encodeURIComponent(
                      `Halo PT VEA, saya ingin menanyakan ketersediaan dan penawaran resmi untuk produk: ${product.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Tanya via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Technical Description */}
              <div className="p-6 rounded-xl bg-white border border-border/80 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-navy">
                  Deskripsi & Rekayasa Teknis
                </h3>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                  {product.description}
                </div>

                {/* Industrial Compliance Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-navy">100% Original</p>
                      <p className="text-[10px] text-muted-foreground">Sertifikat Pabrik</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-gold-dark shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-navy">Standar API & ASME</p>
                      <p className="text-[10px] text-muted-foreground">Kepatuhan Migas</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-navy">ISO 9001:2015</p>
                      <p className="text-[10px] text-muted-foreground">Teruji & Terkalibrasi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Downloadable Manual & Datasheet */}
              {(product.manualUrl || product.datasheetUrl) && (
                <div className="p-6 rounded-xl bg-white border border-border/80 shadow-xs space-y-3">
                  <h4 className="font-serif font-bold text-base text-navy">
                    Dokumentasi & Datasheet Teknis
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {product.manualUrl && (
                      <a
                        href={product.manualUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-bold text-navy border border-border transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gold-dark" />
                        <span>Unduh Manual Book (PDF)</span>
                      </a>
                    )}
                    {product.datasheetUrl && (
                      <a
                        href={product.datasheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-bold text-navy border border-border transition-colors"
                      >
                        <FileText className="w-4 h-4 text-gold-dark" />
                        <span>Unduh Technical Datasheet (PDF)</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Request for Quotation Direct Form */}
              <div className="p-6 sm:p-8 rounded-xl bg-navy-gradient text-white border border-white/10 shadow-lg space-y-4">
                <h3 className="font-serif font-bold text-lg text-white">
                  Permintaan Penawaran Resmi (RFQ) untuk {product.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hubungi tim engineering & sales PT VEA untuk penawaran harga volume besar, surat dukungan tender, dan jadwal pengiriman.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/#kontak?product=${encodeURIComponent(product.name)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider bg-gold hover:bg-gold-light text-navy transition-all shadow-md"
                  >
                    <span>Kirim Formulir RFQ Resmi</span>
                    <ArrowRight className="w-4 h-4 text-navy" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

          {/* Related Products Recommendation */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-10 border-t border-border">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold-dark">
                    Rekomendasi Terkait
                  </p>
                  <h3 className="font-serif font-bold text-2xl text-navy">
                    Produk Kategori Serupa
                  </h3>
                </div>
                <Link
                  href="/produk"
                  className="text-xs font-bold uppercase tracking-wider text-navy hover:text-gold-dark transition-colors"
                >
                  Lihat Semua &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p as any} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton 
        phone={settings?.whatsappNumber}
        message={settings?.whatsappMessage}
      />
    </>
  );
}
