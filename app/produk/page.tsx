import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductGrid, Product } from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/app/actions/settings";
import { FALLBACK_DATA } from "@/lib/fallback-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk & Inventaris Industrial",
  description:
    "Katalog instrumen presisi, valves industri, dan peralatan perpipaan migas PT Vanguard Energy Amanah berstandar mutu internasional.",
};

export const dynamic = "force-dynamic";

export default async function ProdukPage() {
  let settings = FALLBACK_DATA.settings;
  let dbProducts: any[] = [];

  try {
    const settingsResult = await getAppSettings();
    if (settingsResult.data) {
      settings = settingsResult.data as any;
    }

    dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    // Database unavailable, fallback is used
  }

  const mappedDbProducts: Product[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    brand: "PT VEA",
    image: p.imageUrl || p.images?.[0] || "/product-placeholder.png",
    images: p.images || [],
    manualUrl: p.manualUrl || null,
    datasheetUrl: p.datasheetUrl || null,
    summary: p.description,
    description: p.description,
    price: p.price ? Number(p.price) : 0,
  }));

  const finalProducts: Product[] = mappedDbProducts.length > 0 ? mappedDbProducts : FALLBACK_DATA.products;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <ProductGrid initialProducts={finalProducts} />
      </main>
      <Footer />
      <WhatsAppButton 
        phone={settings?.whatsappNumber}
        message={settings?.whatsappMessage}
      />
    </>
  );
}
