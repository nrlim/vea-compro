import { Navbar } from "@/components/navbar";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductGrid, Product } from "@/components/products/ProductGrid";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/app/actions/settings";

export const metadata = {
  title: "Katalog Produk — PT Vanguard Energy Amanah",
  description: "Katalog produk profesional PT Vanguard Energy Amanah. Menyediakan perangkat keras mutakhir dan sistem evaluasi energi andal.",
};

export const revalidate = 60; // Revalidate public catalog every minute

export default async function ProdukPage() {
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
      <main className="pt-16 md:pt-20">
        <ProductGrid initialProducts={products} />
      </main>
      <WhatsAppButton 
        phone={settings?.whatsappNumber}
        message={settings?.whatsappMessage}
      />
    </>
  );
}
