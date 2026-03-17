import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PartnersSlider } from "@/components/partners-slider";
import { ServicesSection } from "@/components/services-section";
import { AboutSection } from "@/components/about-section";
import { AdvantagesSection } from "@/components/advantages-section";
import { ContactSection } from "@/components/contact-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Footer } from "@/components/footer";

import { type Product } from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/app/actions/settings";

export const revalidate = 60; // Revalidate public homepage every minute

export default async function HomePage() {
  const settingsResult = await getAppSettings();
  const settings = settingsResult.data;
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const products: Product[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    brand: "PT VEA",
    image: p.imageUrl || "/product-placeholder.png",
    summary: p.description,
    description: p.description,
    price: (p as any).price ? Number((p as any).price) : 0,
  }));
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PartnersSlider />
        <AboutSection />
        <ServicesSection />
        <AdvantagesSection />
        <ContactSection products={products} />
      </main>
      <Footer />
      <WhatsAppButton 
        phone={settings?.whatsappNumber}
        message={settings?.whatsappMessage}
      />
    </>
  );
}
