import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PartnersSlider } from "@/components/partners-slider";
import { ServicesSection } from "@/components/services-section";
import { AboutSection } from "@/components/about-section";
import { AdvantagesSection } from "@/components/advantages-section";
import { ContactSection } from "@/components/contact-section";
import { BrandsSection } from "@/components/brands-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Footer } from "@/components/footer";

import { type Product } from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/app/actions/settings";
import { FALLBACK_DATA } from "@/lib/fallback-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let settings = FALLBACK_DATA.settings;
  let dbProducts: any[] = [];
  let mitras: any[] = [];
  let brands: any[] = [];

  try {
    const settingsResult = await getAppSettings();
    if (settingsResult.data) {
      settings = settingsResult.data as any;
    }
    
    dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    mitras = await prisma.mitra.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    // Database unavailable, using structured fallback
  }

  // Use fallback if database has no records yet
  const finalMitras = mitras.length > 0 ? mitras : FALLBACK_DATA.mitras;
  const finalBrands = brands.length > 0 ? brands : FALLBACK_DATA.brands;
  
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
      <main>
        <HeroSection />
        <PartnersSlider mitras={finalMitras} />
        <BrandsSection brands={finalBrands} />
        <AboutSection />
        <ServicesSection />
        <AdvantagesSection />
        <ContactSection products={finalProducts} />
      </main>
      <Footer />
      <WhatsAppButton 
        phone={settings?.whatsappNumber}
        message={settings?.whatsappMessage}
      />
    </>
  );
}
